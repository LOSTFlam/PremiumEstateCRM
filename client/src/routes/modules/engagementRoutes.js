import React from "react";
import { Icon } from "@chakra-ui/react";
import { AiFillFolderOpen, AiOutlineMail } from "react-icons/ai";
import { FaCalendarAlt, FaRupeeSign, FaTasks } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";
import { PiPhoneCallBold } from "react-icons/pi";
import { HiUsers, HiTemplate } from "react-icons/hi";
import { MdInsertChartOutlined, MdLock } from "react-icons/md";
import { ROLE_PATH } from "../../roles";
import { createRoute } from "../../utils/routeHelpers";

const Task = React.lazy(() => import("views/admin/task"));
const TaskView = React.lazy(() => import("views/admin/task/components/taskView"));
const Meeting = React.lazy(() => import("views/admin/meeting"));
const MeetingView = React.lazy(() => import("views/admin/meeting/View"));
const PhoneCall = React.lazy(() => import("views/admin/phoneCall"));
const PhoneCallView = React.lazy(() => import("views/admin/phoneCall/View"));
const EmailHistory = React.lazy(() => import("views/admin/emailHistory"));
const EmailHistoryView = React.lazy(() => import("views/admin/emailHistory/View"));
const EmailTemplate = React.lazy(() => import("views/admin/emailTemplate"));
const EmailTemplateAddEdit = React.lazy(() => import("views/admin/emailTemplate/AddEdit"));
const EmailTemplateView = React.lazy(() => import("views/admin/emailTemplate/view.js"));
const Calender = React.lazy(() => import("views/admin/calender"));
const Payments = React.lazy(() => import("views/admin/payments"));
const Document = React.lazy(() => import("views/admin/document"));
const Report = React.lazy(() => import("views/admin/reports"));
const User = React.lazy(() => import("views/admin/users"));
const UserView = React.lazy(() => import("views/admin/users/View"));
const SignInCentered = React.lazy(() => import("views/auth/signIn"));

export const engagementRoutes = [
  createRoute({
    name: "Tasks",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/task",
    icon: <Icon as={FaTasks} width="20px" height="20px" color="inherit" />,
    component: Task,
  }),
  createRoute({
    name: "Tasks",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "task",
    parentName: "Tasks",
    path: "/view/:id",
    component: TaskView,
  }),
  createRoute({
    name: "Meetings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/metting",
    icon: <Icon as={SiGooglemeet} width="20px" height="20px" color="inherit" />,
    component: Meeting,
  }),
  createRoute({
    name: "Meetings",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "Meetings",
    parentName: "Meetings",
    path: "/metting/:id",
    component: MeetingView,
  }),
  createRoute({
    name: "Calls",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/phone-call",
    icon: <Icon as={PiPhoneCallBold} width="20px" height="20px" color="inherit" />,
    component: PhoneCall,
  }),
  createRoute({
    name: "Calls",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "phone-call",
    parentName: "Calls",
    path: "/phone-call/:id",
    component: PhoneCallView,
  }),
  createRoute({
    name: "Emails",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/email",
    icon: <Icon as={AiOutlineMail} width="20px" height="20px" color="inherit" />,
    component: EmailHistory,
  }),
  createRoute({
    name: "Emails",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "Emails",
    parentName: "Emails",
    path: "/Email/:id",
    component: EmailHistoryView,
  }),
  createRoute({
    name: "Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/email-template",
    icon: <Icon as={HiTemplate} width="20px" height="20px" color="inherit" />,
    component: EmailTemplate,
  }),
  createRoute({
    name: "Add Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "email-template",
    parentName: "Email Template",
    path: "/email-template/email-template-addEdit",
    icon: <Icon as={HiTemplate} width="20px" height="20px" color="inherit" />,
    component: EmailTemplateAddEdit,
  }),
  createRoute({
    name: "Email Template",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    under: "email-template",
    parentName: "Email Template",
    path: "/email-template/:id",
    icon: <Icon as={HiTemplate} width="20px" height="20px" color="inherit" />,
    component: EmailTemplateView,
  }),
  createRoute({
    name: "Calender",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/calender",
    icon: <Icon as={FaCalendarAlt} width="20px" height="20px" color="inherit" />,
    component: Calender,
  }),
  createRoute({
    name: "Payments",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/payments",
    icon: <Icon as={FaRupeeSign} width="20px" height="20px" color="inherit" />,
    component: Payments,
  }),
  createRoute({
    name: "Documents",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/documents",
    icon: <Icon as={AiFillFolderOpen} width="20px" height="20px" color="inherit" />,
    component: Document,
  }),
  createRoute({
    name: "Reporting and Analytics",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/reporting-analytics",
    icon: <Icon as={MdInsertChartOutlined} width="20px" height="20px" color="inherit" />,
    component: Report,
  }),
  createRoute({
    name: "Users",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    path: "/user",
    under: "user",
    icon: <Icon as={HiUsers} width="20px" height="20px" color="inherit" />,
    component: User,
  }),
  createRoute({
    name: "User View",
    layout: [ROLE_PATH.superAdmin, ROLE_PATH.user],
    parentName: "Users",
    under: "user",
    path: "/userView/:id",
    component: UserView,
  }),
  createRoute({
    name: "Sign In",
    layout: "/auth",
    path: "/sign-in",
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  }),
];
