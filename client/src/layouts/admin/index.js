// Chakra imports
import { Portal, Box, useDisclosure, Flex, Icon } from "@chakra-ui/react";
import Footer from "components/footer/FooterAdmin.js";
// Layout components
import Navbar from "components/navbar/NavbarAdmin.js";
import Sidebar from "components/sidebar/Sidebar.js";
import Spinner from "components/spinner/Spinner";
import { SidebarContext } from "contexts/SidebarContext";
import React, { Suspense, useEffect } from "react";
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROLE_PATH } from "../../roles";
import newRoutes from "routes.js";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../redux/slices/imageSlice";
import { getApi } from "services/api";
import { MdHome, MdLock } from "react-icons/md";
import DynamicPage from "views/admin/dynamicPage";
import DynamicPageview from "views/admin/dynamicPage/DynamicPageview";
import { fetchRouteData } from "../../redux/slices/routeSlice";
import { LuChevronRightCircle } from "react-icons/lu";
import { fetchRoles } from "../../redux/slices/roleSlice";
import { fetchModules } from "../../redux/slices/moduleSlice";
import {
  getActiveCrmNavbarValue,
  getActiveCrmRoute,
  getActiveCrmRouteLabel,
  renderCrmRoutes,
} from "../shared/crmLayoutUtils";
import { getBrandLabel } from "i18n/crmDictionary";

const MainDashboard = React.lazy(() => import("views/admin/default"));

// Custom Chakra theme
export default function Dashboard(props) {
  const { ...rest } = props;
  // states and functions
  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  // const user = JSON.parse(localStorage.getItem("user"))
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  // let routes = newRoutes;
  const [routes, setRoutes] = useState(newRoutes);
  const route = useSelector((state) => state?.route?.data);
  const modules = useSelector((state) => state?.modules?.data);
  const dispatch = useDispatch();

  const pathName = (name) => {
    return `/${name?.toLowerCase()?.replace(/ /g, "-")}`;
  };

  const getRoute = () => {
    return window?.location?.pathname !== "/admin/full-screen-maps";
  };

  const dynamicRoute = () => {
    let apiData = [];

    route &&
      route?.length > 0 &&
      route?.map((item, i) => {
        let rec = routes?.find((route) => route?.name === item?.moduleName);
        if (!routes?.some((route) => route?.name === item?.moduleName)) {
          const newRoute = [
            {
              name: item?.moduleName,
              layout: [ROLE_PATH?.superAdmin],
              path: pathName(item?.moduleName),
              icon: item?.icon ? (
                <img src={item?.icon} width="20px" height="20px" alt="icon" />
              ) : (
                <Icon
                  as={LuChevronRightCircle}
                  width="20px"
                  height="20px"
                  color="inherit"
                />
              ),
              component: DynamicPage,
            },
            {
              name: item?.moduleName,
              layout: [ROLE_PATH?.superAdmin],
              under: item?.moduleName,
              parentName: item?.moduleName,
              path: `${pathName(item?.moduleName)}/:id`,
              icon: item?.icon ? (
                <img src={item?.icon} width="20px" height="20px" alt="icon" />
              ) : (
                <Icon
                  as={LuChevronRightCircle}
                  width="20px"
                  height="20px"
                  color="inherit"
                />
              ),
              component: DynamicPageview,
            },
          ];
          setRoutes((pre) => [...pre, ...newRoute]);
        } else if (
          routes?.some((route) => route?.name === item?.moduleName) &&
          rec.icon?.props?.src !== item?.icon
        ) {
          const updatedData = routes?.map((i) => {
            if (i.name === item?.moduleName) {
              return {
                ...i,
                icon: (
                  <img src={item?.icon} width="20px" height="20px" alt="icon" />
                ),
              };
            }
            return i;
          });
          setRoutes(updatedData);
        }
        if (routes?.find((route) => route?.name !== item?.moduleName)) {
          if (
            !newRoutes?.find(
              (route) =>
                route?.name?.toLowerCase() === item?.moduleName?.toLowerCase(),
            )
          ) {
            const newRoute = [
              {
                name: item?.moduleName,
                layout: [ROLE_PATH?.superAdmin],
                path: pathName(item?.moduleName),
                icon: item?.icon ? (
                  <img src={item?.icon} width="20px" height="20px" alt="icon" />
                ) : (
                  <Icon
                    as={LuChevronRightCircle}
                    width="20px"
                    height="20px"
                    color="inherit"
                  />
                ),
                component: DynamicPage,
              },
              {
                name: item?.moduleName,
                layout: [ROLE_PATH.superAdmin],
                under: item?.moduleName,
                parentName: item?.moduleName,
                path: `${pathName(item.moduleName)}/:id`,
                icon: item?.icon ? (
                  <img src={item?.icon} width="20px" height="20px" alt="icon" />
                ) : (
                  <Icon
                    as={LuChevronRightCircle}
                    width="20px"
                    height="20px"
                    color="inherit"
                  />
                ),
                component: DynamicPageview,
              },
            ];

            apiData.push(...newRoute);
          }
        }
      });

    let filterData = [...newRoutes, ...apiData];

    const activeModel = modules
      ?.filter((module) => module?.isActive)
      ?.map((module) => module?.moduleName);

    const activeRoutes = filterData?.filter(
      (data) =>
        activeModel?.includes(data?.name) ||
        activeModel?.includes(data?.parentName) ||
        !modules?.some(
          (module) =>
            module?.moduleName === data?.name ||
            module?.moduleName === data?.parentName,
        ),
    );

    setRoutes(activeRoutes);
  };

  useEffect(() => {
    dynamicRoute();
  }, [route, modules]);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (window.location.pathname === "/dashboard") {
        await dispatch(fetchRouteData());
        await dispatch(fetchImage());
      }

      await dispatch(fetchModules());
    };

    loadDashboardData();
  }, [dispatch]);

  const largeLogo = useSelector((state) =>
    state?.images?.images?.filter((item) => item?.isActive === true),
  );

  useEffect(() => {
    if (window?.location?.pathname === "/dashboard") {
      dispatch(fetchRoles(userId));
    }
  }, [dispatch, userId]);

  document.documentElement.dir = "ltr";
  const { onOpen } = useDisclosure();
  document.documentElement.dir = "ltr";
  return (
    <Box>
      <Box>
        <SidebarContext.Provider
          value={{
            toggleSidebar,
            setToggleSidebar,
          }}
        >
          <Sidebar
            routes={routes}
            largeLogo={largeLogo}
            display="none"
            {...rest}
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar}
          />
          <Box
            float="right"
            minHeight="100vh"
            height="100%"
            overflow="auto"
            position="relative"
            maxHeight="100%"
            // w={{ base: '100%', xl: 'calc( 100% - 290px )' }}
            w={{
              base: "100%",
              xl:
                openSidebar === true
                  ? "calc( 100% - 300px )"
                  : "calc( 100% - 88px )",
            }}
            maxWidth={{
              base: "100%",
              xl:
                openSidebar === true
                  ? "calc( 100% - 300px )"
                  : "calc( 100% - 88px )",
            }}
            transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
            transitionDuration=".2s, .2s, .35s"
            transitionProperty="top, bottom, width"
            transitionTimingFunction="linear, linear, ease"
          >
            <Portal>
              <Box className="header">
                <Navbar
                  onOpen={onOpen}
                  logoText={getBrandLabel()}
                  brandText={getActiveCrmRouteLabel(routes)}
                  secondary={getActiveCrmNavbarValue(routes, "secondary")}
                  message={getActiveCrmNavbarValue(routes, "messageNavbar")}
                  routes={routes}
                  fixed={fixed}
                  under={getActiveCrmRoute(routes)}
                  largeLogo={largeLogo}
                  openSidebar={openSidebar}
                  setOpenSidebar={setOpenSidebar}
                  {...rest}
                />
              </Box>
            </Portal>
            <Box pt={{ base: "150px", md: "95px", xl: "95px" }}>
              {getRoute() ? (
                <Box
                  mx="auto"
                  pe="20px"
                  minH="84vh"
                  pt="50px"
                  style={{
                    padding: openSidebar ? "8px 20px 8px 0px" : "8px 20px",
                  }}
                >
                  <Suspense
                    fallback={
                      <Flex
                        justifyContent={"center"}
                        alignItems={"center"}
                        width="100%"
                      >
                        <Spinner />
                      </Flex>
                    }
                  >
                    <Routes>
                      {renderCrmRoutes(
                        routes,
                        (route) =>
                          !route?.under &&
                          route?.layout?.includes(ROLE_PATH?.superAdmin),
                      )}
                      {renderCrmRoutes(routes, (route) => Boolean(route?.under))}
                      <Route path="/*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </Suspense>
                </Box>
              ) : null}
            </Box>
            <Box>
              <Footer />
            </Box>
          </Box>
        </SidebarContext.Provider>
      </Box>
    </Box>
  );
}
