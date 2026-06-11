const User = require("../../model/schema/user");
const bcrypt = require("bcryptjs");
const {
  AUTH_COOKIE_NAME,
  REFRESH_COOKIE_NAME,
  assertJwtSecret,
  signAuthToken,
  signRefreshToken,
  verifyRefreshToken,
  generateRefreshTokenId,
  storeRefreshToken,
  rotateRefreshToken,
  getAuthCookieOptions,
  getRefreshCookieOptions,
  getLogoutCookieOptions,
  sanitizeUser,
} = require("./auth.service");
const {
  validatePasswordComplexity,
  validatePasswordChange,
  hashPassword,
} = require("../../middlewares/passwordValidator");
const {
  incrementFailedAttempts,
  resetFailedAttempts,
} = require("../../middlewares/rateLimiter");
const { invalidateUserCache } = require("../../middlewares/auth");
const { pickAllowedQuery } = require("../../utils/safeQuery");
const { issueCsrfToken } = require("../../middlewares/csrf");

const getDefaultUsers = () =>
  String(process.env.DEFAULT_USERS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const normalizeIdentity = (value) => String(value || "").trim().toLowerCase();

// Admin register — only allowed when no superAdmin exists yet (bootstrap)
const adminRegister = async (req, res, next) => {
  try {
    assertJwtSecret();
    const existingSuperAdmin = await User.findOne({ role: "superAdmin", deleted: false }).lean();
    if (existingSuperAdmin) {
      return res.status(403).json({ message: "Admin bootstrap is disabled. Contact system owner." });
    }

    const { username, password, firstName, lastName, phoneNumber } = req.body;
    const normalizedUsername = normalizeIdentity(username);
    const user = await User.findOne({ username: normalizedUsername });
    if (user) {
      return res
        .status(400)
        .json({ message: "Admin already exist please try another email" });
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: "Password does not meet requirements",
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedUsername,
      password: hashedPassword,
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      phoneNumber,
      role: "superAdmin",
      // Store initial password in history to prevent reuse on first change
      passwordHistory: [{ password: hashedPassword }],
      lastPasswordChange: new Date(),
    });

    await newUser.save();
    res.status(200).json({ message: "Admin created successfully" });
  } catch (error) {
    next(error);
  }
};

// User Registration - accepts email and generates username from it
const register = async (req, res, next) => {
  try {
    assertJwtSecret();
    const { email, username, password, firstName, lastName, phoneNumber, roles } = req.body;

    const normalizedEmail = email ? normalizeIdentity(email) : null;
    const baseUsername = normalizeIdentity(
      normalizedEmail || username || (normalizedEmail ? normalizedEmail.split("@")[0] : "")
    );

    if (!baseUsername) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    if (normalizedEmail) {
      const existingByEmail = await User.findOne({ email: normalizedEmail });
      if (existingByEmail) {
        return res
          .status(409)
          .json({ message: "User already exists. Please try another email." });
      }
    }

    let finalUsername = baseUsername;
    let suffix = 1;
    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}-${suffix}`;
      suffix += 1;
      if (suffix > 50) {
        return res.status(409).json({ message: "Unable to generate a unique username" });
      }
    }

    // Validate password complexity
    const passwordValidation = validatePasswordComplexity(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: "Password does not meet requirements",
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await hashPassword(password);
    const now = new Date();
    const newUser = new User({
      username: finalUsername,
      email: normalizedEmail,
      password: hashedPassword,
      roles: Array.isArray(roles) ? roles : [],
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      phoneNumber,
      role: "user",
      passwordHistory: [{ password: hashedPassword }],
      lastPasswordChange: now,
      lastActiveAt: now,
      lastLoginAt: now,
    });

    await newUser.save();

    // Generate tokens (include role for authorize middleware)
    const token = signAuthToken({ userId: newUser._id, role: newUser.role });
    const refreshTokenId = generateRefreshTokenId();
    const refreshToken = signRefreshToken({ userId: newUser._id, tokenId: refreshTokenId });
    
    // Store refresh token
    await storeRefreshToken(newUser._id, refreshToken, refreshTokenId);

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
    issueCsrfToken(res);

    res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(newUser),
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const query = {
      ...pickAllowedQuery(req.query, ["role", "firstName", "lastName", "username", "email"]),
      deleted: false,
    };

    const user = await User.find(query)
      .populate({
        path: "roles",
      })
      .exec();

    res.status(200).json({ user: user.map(sanitizeUser) });
  } catch (error) {
    next(error);
  }
};

const view = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id, deleted: false }).populate({
      path: "roles",
    });
    if (!user) return res.status(404).json({ message: "no Data Found." });
    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    next(error);
  }
};

let deleteData = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (getDefaultUsers().includes(user?.username)) {
      return res
        .status(400)
        .json({ message: `You don't have access to delete ${user?.username}` });
    }
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.role !== "superAdmin") {
      // Update the user's 'deleted' field to true
      await User.updateOne({ _id: userId }, { $set: { deleted: true } });
      // Invalidate cache to prevent stale auth data
      invalidateUserCache(userId);
      res.send({ message: "Record deleted Successfully" });
    } else {
      res.status(404).json({ message: "admin can not delete" });
    }
  } catch (error) {
    next(error);
  }
};

const deleteMany = async (req, res, next) => {
  try {
    const userIds = req.body;
    const users = await User.find({ _id: { $in: userIds } });

    const defaultUsers = getDefaultUsers();
    const filteredUsers = users.filter(
      (user) => !defaultUsers.includes(user.username)
    );

    const nonSuperAdmins = filteredUsers.filter(
      (user) => user.role !== "superAdmin"
    );
    const nonSuperAdminIds = nonSuperAdmins.map((user) => user._id);

    if (nonSuperAdminIds.length === 0) {
      return res
        .status(400)
        .json({ message: "No users to delete or all users are protected." });
    }

    // Update the 'deleted' field to true for the remaining users
    const updatedUsers = await User.updateMany(
      { _id: { $in: nonSuperAdminIds } },
      { $set: { deleted: true } }
    );

    // Invalidate cache for all deleted users
    nonSuperAdminIds.forEach(id => invalidateUserCache(id));

    res.status(200).json({ message: "done", updatedUsers });
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  try {
    const isSelf = String(req.params.id) === String(req.user?.userId);
    const isSuperAdmin = req.user?.role === "superAdmin";

    if (!isSelf && !isSuperAdmin) {
      return res.status(403).json({ message: "You can only edit your own profile" });
    }

    const { username, email, firstName, lastName, phoneNumber } = req.body;
    const update = {};

    if (username) {
      update.username = normalizeIdentity(username);
    }

    if (email) {
      update.email = normalizeIdentity(email);
    }

    if (firstName !== undefined) update.firstName = String(firstName).trim();
    if (lastName !== undefined) update.lastName = String(lastName).trim();
    if (phoneNumber !== undefined) update.phoneNumber = phoneNumber;

    const result = await User.updateOne(
      { _id: req.params.id },
      {
        $set: update,
      }
    );

    // Invalidate cache if user identity fields changed
    if (username || email) {
      invalidateUserCache(req.params.id);
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    assertJwtSecret();
    const { username, email, password } = req.body;
    const loginIdentifier = normalizeIdentity(username || email);

    const user = await User.findOne({
      deleted: false,
      $or: [
        { username: loginIdentifier },
        { email: loginIdentifier }
      ]
    })
      .select("+password +lockedUntil +failedLoginAttempts +isBlocked +blockReason")
      .populate({
        path: "roles",
      });

    if (!user) {
      res
        .status(401)
        .json({ error: "Authentication failed, invalid username" });
      return;
    }

    if (user.isBlocked) {
      return res.status(403).json({
        error: user.blockReason || "Your account has been blocked by an administrator",
        blocked: true,
      });
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const lockoutMinutes = Math.ceil((user.lockedUntil - new Date()) / 60000);
      return res.status(423).json({ 
        error: "Account temporarily locked due to too many failed attempts",
        lockedUntil: user.lockedUntil,
        lockoutMinutes,
      });
    }

    // Wrap bcrypt.compare in try-catch to handle potential errors
    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      // Console statement removed
      return res.status(500).json({ error: 'Authentication failed' });
    }
    
    if (!passwordMatch) {
      // Increment failed login attempts and check lockout status
      // incrementFailedAttempts returns lockout status, avoiding a second DB query
      // FIX: In production, fail closed if DB is unavailable to prevent brute force
      const lockoutResult = await incrementFailedAttempts(user._id).catch(err => {
        // Console statement removed
        // Fail closed in production to prevent brute force when DB is down
        const isProd = process.env.NODE_ENV === 'production';
        return { 
          locked: isProd, 
          lockedUntil: isProd ? new Date(Date.now() + 5 * 60 * 1000) : null 
        };
      });
      
      if (lockoutResult.locked) {
        const lockoutMinutes = Math.ceil((lockoutResult.lockedUntil - new Date()) / 60000);
        return res.status(423).json({
          error: "Account locked due to too many failed attempts",
          lockedUntil: lockoutResult.lockedUntil,
          lockoutMinutes,
        });
      }
      
      res
        .status(401)
        .json({ error: "Authentication failed, password does not match" });
      return;
    }

    // Reset failed attempts on successful login
    await resetFailedAttempts(user._id);

    // Generate tokens (include role for authorize middleware)
    const token = signAuthToken({ userId: user._id, role: user.role });
    const refreshTokenId = generateRefreshTokenId();
    const refreshToken = signRefreshToken({ userId: user._id, tokenId: refreshTokenId });
    
    // Store refresh token
    await storeRefreshToken(user._id, refreshToken, refreshTokenId);

    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
    issueCsrfToken(res);

    res
      .status(200)
      .json({ 
        user: sanitizeUser(user),
        expiresIn: 15 * 60 * 1000,  // 15 minutes
      });
  } catch (error) {
    next(error);
  }
};

const changeRoles = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const roles = Array.isArray(req.body) ? req.body : req.body?.roles;

    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: "roles must be an array of role IDs" });
    }

    const result = await User.updateOne(
      { _id: userId },
      { $set: { roles } }
    );

    // Invalidate cache to reflect role changes immediately
    invalidateUserCache(userId);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh access token using refresh token
 * Implements token rotation for security
 */
const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || {};
    
    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token required" });
    }
    
    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
    
    // Rotate the refresh token
    const rotationResult = await rotateRefreshToken(decoded.userId, decoded.tokenId);
    
    if (rotationResult.error) {
      // Clear cookies on error (possible token theft detected)
      res.clearCookie(AUTH_COOKIE_NAME, getLogoutCookieOptions());
      res.clearCookie(REFRESH_COOKIE_NAME, getLogoutCookieOptions());
      return res.status(401).json({ error: rotationResult.error });
    }
    
    // Fetch user to get current role for the new access token
    const user = await User.findById(decoded.userId).select("+deleted");
    if (!user || user.deleted) {
      res.clearCookie(AUTH_COOKIE_NAME, getLogoutCookieOptions());
      res.clearCookie(REFRESH_COOKIE_NAME, getLogoutCookieOptions());
      return res.status(401).json({ error: "User not found or deleted" });
    }
    
    // Generate new access token (include role for authorize middleware)
    const newAccessToken = signAuthToken({ userId: decoded.userId, role: user.role });
    
    res.cookie(AUTH_COOKIE_NAME, newAccessToken, getAuthCookieOptions());
    res.cookie(REFRESH_COOKIE_NAME, rotationResult.refreshToken, getRefreshCookieOptions());
    issueCsrfToken(res);
    
    res.status(200).json({
      message: "Token refreshed successfully",
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Change password with validation
 * - Validates new password complexity
 * - Checks against password history
 * - Updates password history
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Only use authenticated user's ID - never accept from URL params
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current password and new password are required" });
    }
    
    // Get user with password
    const user = await User.findById(userId).select("+password +passwordHistory");
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Current password is incorrect" });
    }
    
    // Validate new password
    const validation = await validatePasswordChange(user, newPassword);
    if (!validation.valid) {
      return res.status(400).json({
        error: "New password does not meet requirements",
        errors: validation.errors || [validation.error],
      });
    }
    
    // Update password history (keep last 5)
    const passwordHistory = [...(user.passwordHistory || []), { password: user.password }];
    if (passwordHistory.length > 5) {
      passwordHistory.shift();  // Remove oldest
    }
    
    // Update user password
    await User.findByIdAndUpdate(userId, {
      password: validation.hashedPassword,
      passwordHistory,
      lastPasswordChange: new Date(),
      lastActiveAt: new Date(),  // FIX: Prevent immediate session expiry after password change
    });
    
    // Invalidate cache immediately after password change
    invalidateUserCache(userId);
    
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout with refresh token cleanup
 */
const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (userId) {
      // Clear refresh token from database
      await User.findByIdAndUpdate(userId, {
        refreshToken: null,
        refreshTokenExpiry: null,
      });
    }
  } catch (error) {
    // Console statement removed
  }
  
  res
    .clearCookie(AUTH_COOKIE_NAME, getLogoutCookieOptions())
    .clearCookie(REFRESH_COOKIE_NAME, getLogoutCookieOptions())
    .status(200)
    .json({ message: "Logged out successfully" });
};

const blockUser = async (req, res, next) => {
  try {
    const reason = String(req.body?.reason || req.body?.blockReason || "").trim();
    if (!reason) {
      return res.status(400).json({ message: "Block reason is required" });
    }

    const target = await User.findOne({ _id: req.params.id, deleted: false }).lean();
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }
    if (target.role === "superAdmin") {
      return res.status(403).json({ message: "Cannot block a super admin account" });
    }

    const now = new Date();
    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isBlocked: true,
          blockReason: reason,
          blockedAt: now,
          blockedBy: req.user.userId,
        },
      }
    );
    invalidateUserCache(String(req.params.id));

    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    next(error);
  }
};

const session = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user.userId, deleted: false }).populate({
      path: "roles",
    });

    if (!user) {
      return res.status(401).json({ message: "Session invalid" });
    }

    res.status(200).json({ user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const unblockUser = async (req, res, next) => {
  try {
    const target = await User.findOne({ _id: req.params.id, deleted: false }).lean();
    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          isBlocked: false,
          blockReason: "",
          blockedAt: null,
          blockedBy: null,
        },
      }
    );
    invalidateUserCache(String(req.params.id));

    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  changePassword,
  adminRegister,
  session,
  index,
  deleteMany,
  view,
  deleteData,
  edit,
  changeRoles,
  blockUser,
  unblockUser,
};
