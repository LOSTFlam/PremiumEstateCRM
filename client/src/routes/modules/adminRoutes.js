import React from "react";
import { Icon } from "@chakra-ui/react";
import { FaCreativeCommonsBy, FaWpforms } from "react-icons/fa";
import { FiSliders } from "react-icons/fi";
import { TbExchange, TbTableColumn } from "react-icons/tb";
import { GrValidate } from "react-icons/gr";
import { VscFileSubmodule } from "react-icons/vsc";
import { ROLE_PATH } from "../../roles";
import { createRoute } from "../../utils/routeHelpers";

const AdminSetting = React.lazy(() => import("views/admin/adminSetting"));
const StorefrontFilters = React.lazy(() => import("views/admin/storefrontFilters"));
const Role = React.lazy(() => import("views/admin/role"));
const CustomField = React.lazy(() => import("views/admin/customField"));
const ChangeImage = React.lazy(() => import("views/admin/image"));
const Validation = React.lazy(() => import("views/admin/validation"));
const TableField = React.lazy(() => import("views/admin/tableField"));
const ActiveDeactiveModule = React.lazy(() => import("views/admin/activeDeactiveModule"));
const ModuleName = React.lazy(() => import("views/admin/moduleName"));

export const adminRoutes = [
  createRoute({
    name: "Admin Setting",
    i18nKey: "navigation.adminSettings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "admin",
    path: "/admin-setting",
    component: AdminSetting,
  }),
  createRoute({
    name: "Storefront Filters",
    i18nKey: "navigation.storefrontFilters",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/storefront-filters",
    icon: <Icon as={FiSliders} width="20px" height="20px" color="inherit" />,
    component: StorefrontFilters,
  }),
  createRoute({
    name: "Roles",
    i18nKey: "navigation.roles",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/role",
    under: "role",
    icon: <Icon as={FaCreativeCommonsBy} width="20px" height="20px" color="inherit" />,
    component: Role,
  }),
  createRoute({
    name: "Custom Fields",
    i18nKey: "navigation.customFields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/custom-Fields",
    under: "customField",
    icon: <Icon as={FaWpforms} width="20px" height="20px" color="inherit" />,
    component: CustomField,
  }),
  createRoute({
    name: "Change Images",
    i18nKey: "navigation.changeImages",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/change-images",
    under: "image",
    icon: <Icon as={TbExchange} width="20px" height="20px" color="inherit" />,
    component: ChangeImage,
  }),
  createRoute({
    name: "Validation",
    i18nKey: "navigation.validations",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/validations",
    under: "Validation",
    icon: <Icon as={GrValidate} width="20px" height="20px" color="inherit" />,
    component: Validation,
  }),
  createRoute({
    name: "Table Fields",
    i18nKey: "navigation.tableFields",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/table-field",
    under: "tableField",
    icon: <Icon as={TbTableColumn} width="20px" height="20px" color="inherit" />,
    component: TableField,
  }),
  createRoute({
    name: "Active Deactive Module",
    i18nKey: "navigation.activeModules",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/active-deactive-module",
    under: "activeDeactiveModule",
    icon: <Icon as={TbTableColumn} width="20px" height="20px" color="inherit" />,
    component: ActiveDeactiveModule,
  }),
  createRoute({
    name: "Module",
    i18nKey: "navigation.modules",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/module",
    under: "module",
    icon: <Icon as={VscFileSubmodule} width="20px" height="20px" color="inherit" />,
    component: ModuleName,
  }),
];
