import { getStoredUser } from "utils/authStorage";

export const getRoleHomePath = (role) => (role === "user" ? "/cabinet" : "/dashboard");

export const getProfilePath = (role, userId) =>
  role === "user" ? "/cabinet/profile" : `/userView/${userId || ""}`;

export const resolveAuthUser = (reduxUser) => {
  const raw = reduxUser ?? getStoredUser();
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
};

export const getPublicSitePath = () => "/";
