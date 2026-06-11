import { getApi } from "services/api";
import { clearAuthStorage, getStoredUser, persistUser } from "utils/authStorage";

/**
 * Restore the authenticated user from httpOnly cookies on app load.
 * Keeps returning visitors logged in when refresh cookies are still valid.
 */
export const restoreAuthSession = async () => {
  try {
    const session = await getApi("api/user/session", { silent: true });
    if (session?.user) {
      persistUser(session.user, true);
      return session.user;
    }
  } catch (error) {
    const status = error?.response?.status;

    if (status === 401) {
      if (getStoredUser()) {
        clearAuthStorage();
      }
      return null;
    }

    // Network or server errors — keep the locally cached profile for resilience.
    return getStoredUser();
  }

  return null;
};
