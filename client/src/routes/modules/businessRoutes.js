import React from "react";
import { Icon } from "@chakra-ui/react";
import { MdContacts, MdGavel, MdHome, MdLeaderboard, MdOutlineAddHome } from "react-icons/md";
import { LuBuilding2 } from "react-icons/lu";
import { TbBulb, TbFileInvoice } from "react-icons/tb";
import { RiAccountCircleFill } from "react-icons/ri";
import { HiTemplate } from "react-icons/hi";
import { ROLE_PATH } from "../../roles";
import { createRoute } from "../../utils/routeHelpers";

const MainDashboard = React.lazy(() => import("views/admin/default"));
const MyListings = React.lazy(() => import("views/myListings"));
const Lead = React.lazy(() => import("views/admin/lead"));
const LeadView = React.lazy(() => import("views/admin/lead/View"));
const LeadImport = React.lazy(() => import("views/admin/lead/components/LeadImport"));
const Contact = React.lazy(() => import("views/admin/contact"));
const ContactView = React.lazy(() => import("views/admin/contact/View"));
const ContactImport = React.lazy(() => import("views/admin/contact/components/ContactImport"));
const Property = React.lazy(() => import("views/admin/property"));
const PropertyView = React.lazy(() => import("views/admin/property/View"));
const PropertyImport = React.lazy(() => import("views/admin/property/components/PropertyImport"));
const PropertyPhotos = React.lazy(() => import("views/admin/property/PropertyPhotos"));
const ModerationQueue = React.lazy(() => import("views/admin/moderation"));
const Opportunities = React.lazy(() => import("views/admin/opportunities"));
const OpportunitiesView = React.lazy(() => import("views/admin/opportunities/View"));
const OpportunitiesImport = React.lazy(
  () => import("views/admin/opportunities/components/OpprtunityImport")
);
const Account = React.lazy(() => import("views/admin/account"));
const AccountView = React.lazy(() => import("views/admin/account/View"));
const AccountImport = React.lazy(() => import("views/admin/account/components/AccountImport"));
const Invoices = React.lazy(() => import("views/admin/invoice"));
const InvoicesView = React.lazy(() => import("views/admin/invoice/View"));
const InvoicesImport = React.lazy(() => import("views/admin/invoice/components/InvoiceImport"));

export const businessRoutes = [
  createRoute({
    name: "Dashboard",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/dashboard",
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  }),
  createRoute({
    name: "My Listings",
    i18nKey: "navigation.myListings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/my-listings",
    icon: <Icon as={MdOutlineAddHome} width="20px" height="20px" color="inherit" />,
    component: MyListings,
  }),
  createRoute({
    name: "Leads",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/lead",
    icon: <Icon as={MdLeaderboard} width="20px" height="20px" color="inherit" />,
    component: Lead,
  }),
  createRoute({
    name: "Leads",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "lead",
    parentName: "Leads",
    path: "/leadView/:id",
    component: LeadView,
  }),
  createRoute({
    name: "Lead Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "lead",
    parentName: "Leads",
    path: "/leadImport",
    component: LeadImport,
  }),
  createRoute({
    name: "Contacts",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/contacts",
    icon: <Icon as={MdContacts} width="20px" height="20px" color="inherit" />,
    component: Contact,
  }),
  createRoute({
    name: "Contacts",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "contacts",
    parentName: "Contacts",
    path: "/contactView/:id",
    component: ContactView,
  }),
  createRoute({
    name: "Contact Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "contacts",
    parentName: "Contacts",
    path: "/contactImport",
    component: ContactImport,
  }),
  createRoute({
    name: "Moderation",
    i18nKey: "navigation.moderation",
    layout: [ROLE_PATH.superAdmin],
    path: "/moderation",
    icon: <Icon as={MdGavel} width="20px" height="20px" color="inherit" />,
    component: ModerationQueue,
  }),
  createRoute({
    name: "Properties",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/properties",
    icon: <Icon as={LuBuilding2} width="20px" height="20px" color="inherit" />,
    component: Property,
  }),
  createRoute({
    name: "Properties",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "Properties",
    under: "properties",
    path: "/propertyView/:id",
    component: PropertyView,
  }),
  createRoute({
    name: "Property Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "properties",
    parentName: "Properties",
    path: "/propertyImport",
    component: PropertyImport,
  }),
  createRoute({
    name: "Property Photos",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "properties",
    parentName: "Properties",
    path: "/propertyPhotos",
    icon: <Icon as={HiTemplate} width="20px" height="20px" color="inherit" />,
    component: PropertyPhotos,
  }),
  createRoute({
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opportunities",
    icon: <Icon as={TbBulb} width="20px" height="20px" color="inherit" />,
    component: Opportunities,
  }),
  createRoute({
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opportunitiesView/:id",
    under: "opportunities",
    parentName: "Opportunities",
    icon: <Icon as={TbBulb} width="20px" height="20px" color="inherit" />,
    component: OpportunitiesView,
  }),
  createRoute({
    name: "Opportunities",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/opprotunitiesImport",
    under: "opportunities",
    parentName: "Opportunities",
    icon: <Icon as={TbBulb} width="20px" height="20px" color="inherit" />,
    component: OpportunitiesImport,
  }),
  createRoute({
    name: "Account",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/account",
    icon: <Icon as={RiAccountCircleFill} width="20px" height="20px" color="inherit" />,
    component: Account,
  }),
  createRoute({
    name: "Account",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/accountView/:id",
    under: "account",
    parentName: "Account",
    icon: <Icon as={RiAccountCircleFill} width="20px" height="20px" color="inherit" />,
    component: AccountView,
  }),
  createRoute({
    name: "Account Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/accountImport",
    under: "account",
    parentName: "Account",
    icon: <Icon as={RiAccountCircleFill} width="20px" height="20px" color="inherit" />,
    component: AccountImport,
  }),
  createRoute({
    name: "Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/invoices",
    icon: <Icon as={TbFileInvoice} width="20px" height="20px" color="inherit" />,
    component: Invoices,
  }),
  createRoute({
    name: "Invoices",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "invoices",
    parentName: "Invoices",
    path: "/invoicesView/:id",
    component: InvoicesView,
  }),
  createRoute({
    name: "Invoices Import",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    both: true,
    under: "invoices",
    parentName: "Invoices",
    path: "/invoicesImport",
    component: InvoicesImport,
  }),
];
