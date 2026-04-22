import { adminRoutes } from "./routes/modules/adminRoutes";
import { businessRoutes } from "./routes/modules/businessRoutes";
import { engagementRoutes } from "./routes/modules/engagementRoutes";

const routes = [...businessRoutes, ...engagementRoutes, ...adminRoutes];

export default routes;
