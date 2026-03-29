const User = require("../../model/schema/user");
const bcrypt = require("bcrypt");
const {
  AUTH_COOKIE_NAME,
  assertJwtSecret,
  signAuthToken,
  getAuthCookieOptions,
  getLogoutCookieOptions,
  sanitizeUser,
} = require("./auth.service");

const getDefaultUsers = () =>
  String(process.env.DEFAULT_USERS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

const normalizeIdentity = (value) => String(value || "").trim().toLowerCase();

// Admin register
const adminRegister = async (req, res, next) => {
  try {
    assertJwtSecret();
    const { username, password, firstName, lastName, phoneNumber } = req.body;
    const normalizedUsername = normalizeIdentity(username);
    const user = await User.findOne({ username: normalizedUsername });
    if (user) {
      return res
        .status(400)
        .json({ message: "Admin already exist please try another email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: normalizedUsername,
      email: normalizedUsername,
      password: hashedPassword,
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      phoneNumber,
      role: "superAdmin",
      createdDate: new Date(),
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
    const finalUsername = normalizeIdentity(username || (normalizedEmail ? normalizedEmail.split("@")[0] : ""));

    if (!finalUsername) {
      return res.status(400).json({ message: "Username or email is required" });
    }

    const existingUser = await User.findOne({
      $or: [
        { username: finalUsername },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
    });

    if (existingUser) {
      return res
        .status(401)
        .json({ message: "User already exist please try another email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: finalUsername,
      email: normalizedEmail,
      password: hashedPassword,
      roles: Array.isArray(roles) ? roles : [],
      firstName: String(firstName || "").trim(),
      lastName: String(lastName || "").trim(),
      phoneNumber,
      role: "user",
      createdDate: new Date(),
    });

    await newUser.save();

    const token = signAuthToken({ userId: newUser._id });
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res.status(201).json({
      message: "User created successfully",
      user: sanitizeUser(newUser),
      token,
    });
  } catch (error) {
    next(error);
  }
};

const index = async (req, res, next) => {
  try {
    const query = { ...req.query, deleted: false };

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

    res.status(200).json({ message: "done", updatedUsers });
  } catch (err) {
    next(err);
  }
};

const edit = async (req, res, next) => {
  try {
    const { username, email, firstName, lastName, phoneNumber } = req.body;
    const update = {
      updatedDate: new Date(),
    };

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
      .select("+password")
      .populate({
        path: "roles",
      });

    if (!user) {
      res
        .status(401)
        .json({ error: "Authentication failed, invalid username" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res
        .status(401)
        .json({ error: "Authentication failed, password does not match" });
      return;
    }

    const token = signAuthToken({ userId: user._id });
    res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());

    res
      .status(200)
      .setHeader("Authorization", `Bearer ${token}`)
      .json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res
    .clearCookie(AUTH_COOKIE_NAME, getLogoutCookieOptions())
    .status(200)
    .json({ message: "Logged out successfully" });
};

const changeRoles = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const result = await User.updateOne(
      { _id: userId },
      { $set: { roles: req.body } }
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  adminRegister,
  index,
  deleteMany,
  view,
  deleteData,
  edit,
  changeRoles,
};
