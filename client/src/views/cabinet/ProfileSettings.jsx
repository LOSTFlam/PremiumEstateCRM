import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import i18next from "i18n/i18n.config";
import { deletePath, getApi, postApi, putApi } from "services/api";
import { constant } from "constant";
import { getStoredUser, persistUser } from "utils/authStorage";
import { setUser } from "../../redux/slices/localSlice";
import { setLanguage } from "../../redux/slices/languageSlice";
import { useCabinetPreferences } from "hooks/useCabinetPreferences";
import { saveExtendedPreferences } from "services/userPreferences";
import BuyerWishesPanel from "./BuyerWishesPanel";

const panelStyle = {
  borderRadius: "24px",
  bg: "rgba(255,255,255,0.06)",
  border: "1px solid",
  borderColor: "whiteAlpha.200",
  p: { base: 5, md: 7 },
};

const formatAccountDate = (value, locale) => {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString(locale?.startsWith("ru") ? "ru-RU" : "en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "—";
  }
};

const ProfileSettings = () => {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const storedUser = getStoredUser();
  const currentLanguage = useSelector((state) => state?.language?.currentLanguage || "en");
  const { buyerProfile, notifications, refreshLocal } = useCabinetPreferences({ autoSync: false });

  const [userMeta, setUserMeta] = useState(storedUser);
  const [profile, setProfile] = useState({
    firstName: storedUser?.firstName || "",
    lastName: storedUser?.lastName || "",
    email: storedUser?.email || "",
    phoneNumber: storedUser?.phoneNumber || "",
  });
  const [avatarUrl, setAvatarUrl] = useState(storedUser?.avatarUrl || "");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notify, setNotify] = useState({
    emailUpdates: true,
    newListings: true,
    priceChanges: false,
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [savingNotify, setSavingNotify] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const resolvedAvatar = avatarUrl
    ? `${constant.baseUrl.replace(/\/$/, "")}${avatarUrl}`
    : undefined;

  const updateStoredUser = (user) => {
    if (!user) return;
    persistUser(user, Boolean(localStorage.getItem("user")));
    dispatch(setUser(user));
    setUserMeta(user);
  };

  useEffect(() => {
    setNotify({
      emailUpdates: notifications.emailUpdates !== false,
      newListings: notifications.newListings !== false,
      priceChanges: Boolean(notifications.priceChanges),
    });
  }, [notifications]);

  const handleProfileSave = async () => {
    setSavingProfile(true);
    try {
      const response = await putApi("api/user/me", profile);
      updateStoredUser(response?.data?.user);
      toast({ title: t("cabinet.profile.saved"), status: "success", duration: 2500 });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error?.response?.data?.message || t("cabinet.profile.saveError"),
        status: "error",
        duration: 3500,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    setUploadingAvatar(true);

    try {
      const response = await postApi("api/user/avatar", formData, { isFormData: true });
      setAvatarUrl(response?.data?.avatarUrl || "");
      updateStoredUser(response?.data?.user);
      toast({ title: t("cabinet.profile.avatarSaved"), status: "success", duration: 2500 });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error?.response?.data?.message || t("cabinet.profile.avatarError"),
        status: "error",
        duration: 3500,
      });
    } finally {
      setUploadingAvatar(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const response = await deletePath("api/user/avatar");
      setAvatarUrl("");
      updateStoredUser(response?.data?.user);
      toast({ title: t("cabinet.profile.avatarRemoved"), status: "info", duration: 2500 });
    } catch {
      toast({ title: t("cabinet.profile.avatarError"), status: "error", duration: 3000 });
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast({ title: t("cabinet.profile.passwordMismatch"), status: "warning", duration: 3000 });
      return;
    }

    setSavingPassword(true);
    try {
      await postApi("api/user/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: t("cabinet.profile.passwordSaved"), status: "success", duration: 2500 });
    } catch (error) {
      toast({
        title: t("common.error"),
        description: error?.response?.data?.error || t("cabinet.profile.passwordError"),
        status: "error",
        duration: 3500,
      });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleNotificationsSave = async () => {
    setSavingNotify(true);
    try {
      await saveExtendedPreferences({ notifications: notify });
      refreshLocal();
      toast({ title: t("cabinet.notifications.saved"), status: "success", duration: 2500 });
    } finally {
      setSavingNotify(false);
    }
  };

  const handleLanguageChange = (lng) => {
    dispatch(setLanguage(lng));
    i18next.changeLanguage(lng);
  };

  const refreshProfile = async () => {
    try {
      const data = await getApi("api/user/me", { silent: true });
      const user = data?.user;
      if (!user) return;
      setProfile({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
      setAvatarUrl(user.avatarUrl || "");
      updateStoredUser(user);
    } catch {
      // silent
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <Stack spacing={6}>
      <Box {...panelStyle}>
        <Heading size="md" color="white" mb={4}>
          {t("cabinet.account.title")}
        </Heading>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <Box>
            <Text color="whiteAlpha.600" fontSize="sm">{t("cabinet.account.username")}</Text>
            <Text color="white" fontWeight="600">{userMeta?.username || "—"}</Text>
          </Box>
          <Box>
            <Text color="whiteAlpha.600" fontSize="sm">{t("cabinet.account.memberSince")}</Text>
            <Text color="white" fontWeight="600">
              {formatAccountDate(userMeta?.createdAt || userMeta?.createdDate, i18n.language)}
            </Text>
          </Box>
          <Box>
            <Text color="whiteAlpha.600" fontSize="sm">{t("cabinet.account.lastLogin")}</Text>
            <Text color="white" fontWeight="600">
              {formatAccountDate(userMeta?.lastLoginAt, i18n.language)}
            </Text>
          </Box>
          <Box>
            <Text color="whiteAlpha.600" fontSize="sm">{t("navigation.language")}</Text>
            <Select
              mt={1}
              value={currentLanguage}
              onChange={(event) => handleLanguageChange(event.target.value)}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
              maxW="220px"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </Select>
          </Box>
        </Grid>
      </Box>

      <Box {...panelStyle}>
        <Heading size="md" color="white" mb={5}>
          {t("cabinet.profile.title")}
        </Heading>
        <Stack direction={{ base: "column", md: "row" }} align="center" spacing={6} mb={6}>
          <Avatar size="2xl" name={`${profile.firstName} ${profile.lastName}`} src={resolvedAvatar} />
          <Stack spacing={3} align={{ base: "center", md: "flex-start" }}>
            <Text color="whiteAlpha.700">{t("cabinet.profile.avatarHint")}</Text>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              hidden
              onChange={handleAvatarUpload}
            />
            <HStack>
              <Button
                onClick={() => fileRef.current?.click()}
                isLoading={uploadingAvatar}
                colorScheme="green"
                variant="outline"
              >
                {t("cabinet.profile.uploadAvatar")}
              </Button>
              {avatarUrl ? (
                <Button variant="ghost" colorScheme="red" onClick={handleAvatarDelete}>
                  {t("cabinet.profile.removeAvatar")}
                </Button>
              ) : null}
            </HStack>
          </Stack>
        </Stack>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("cabinet.profile.firstName")}</FormLabel>
            <Input
              value={profile.firstName}
              onChange={(event) => setProfile({ ...profile, firstName: event.target.value })}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("cabinet.profile.lastName")}</FormLabel>
            <Input
              value={profile.lastName}
              onChange={(event) => setProfile({ ...profile, lastName: event.target.value })}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("common.email")}</FormLabel>
            <Input
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("common.phone")}</FormLabel>
            <Input
              value={profile.phoneNumber}
              onChange={(event) => setProfile({ ...profile, phoneNumber: event.target.value })}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
        </Grid>

        <Button mt={6} colorScheme="green" onClick={handleProfileSave} isLoading={savingProfile}>
          {t("common.save")}
        </Button>
      </Box>

      <BuyerWishesPanel buyerProfile={buyerProfile} onSaved={refreshLocal} />

      <Box {...panelStyle}>
        <Heading size="md" color="white" mb={2}>
          {t("cabinet.notifications.title")}
        </Heading>
        <Text color="whiteAlpha.700" mb={4}>
          {t("cabinet.notifications.desc")}
        </Text>
        <Stack spacing={4}>
          <HStack justify="space-between">
            <Text color="white">{t("cabinet.notifications.emailUpdates")}</Text>
            <Switch
              colorScheme="green"
              isChecked={notify.emailUpdates}
              onChange={(event) => setNotify({ ...notify, emailUpdates: event.target.checked })}
            />
          </HStack>
          <HStack justify="space-between">
            <Text color="white">{t("cabinet.notifications.newListings")}</Text>
            <Switch
              colorScheme="green"
              isChecked={notify.newListings}
              onChange={(event) => setNotify({ ...notify, newListings: event.target.checked })}
            />
          </HStack>
          <HStack justify="space-between">
            <Text color="white">{t("cabinet.notifications.priceChanges")}</Text>
            <Switch
              colorScheme="green"
              isChecked={notify.priceChanges}
              onChange={(event) => setNotify({ ...notify, priceChanges: event.target.checked })}
            />
          </HStack>
        </Stack>
        <Button mt={5} colorScheme="green" variant="outline" onClick={handleNotificationsSave} isLoading={savingNotify}>
          {t("cabinet.notifications.save")}
        </Button>
      </Box>

      <Box {...panelStyle}>
        <Heading size="md" color="white" mb={5}>
          {t("cabinet.profile.passwordTitle")}
        </Heading>
        <Stack spacing={4} maxW="480px">
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("cabinet.profile.currentPassword")}</FormLabel>
            <Input
              type="password"
              value={passwords.currentPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, currentPassword: event.target.value })
              }
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("cabinet.profile.newPassword")}</FormLabel>
            <Input
              type="password"
              value={passwords.newPassword}
              onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })}
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
          <FormControl>
            <FormLabel color="whiteAlpha.800">{t("cabinet.profile.confirmPassword")}</FormLabel>
            <Input
              type="password"
              value={passwords.confirmPassword}
              onChange={(event) =>
                setPasswords({ ...passwords, confirmPassword: event.target.value })
              }
              bg="whiteAlpha.100"
              borderColor="whiteAlpha.300"
              color="white"
            />
          </FormControl>
        </Stack>
        <Divider my={5} borderColor="whiteAlpha.200" />
        <Button colorScheme="green" variant="outline" onClick={handlePasswordChange} isLoading={savingPassword}>
          {t("cabinet.profile.changePassword")}
        </Button>
      </Box>
    </Stack>
  );
};

export default ProfileSettings;
