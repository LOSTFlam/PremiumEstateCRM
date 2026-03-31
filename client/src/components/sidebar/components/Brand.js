// Chakra imports
import { Flex, Heading, Image, useColorModeValue } from "@chakra-ui/react";
import i18next from "i18next";
import { getBrandLabel, getBrandMark } from "i18n/crmDictionary";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from, largeLogo } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("gray.800", "white");
  let sidebarBg = useColorModeValue("rgba(255, 255, 255, 0.9)", "navy.900");

  return (
    <Flex
      align="center"
      direction="column"
      style={{
        position: "sticky",
        top: "0",
        left: "0",
        background: sidebarBg,
      }}
      borderBottom="1px solid rgba(148, 163, 184, 0.12)"
      px={openSidebar ? 5 : 3}
      py={3}
    >
      <Flex>
        {largeLogo && (largeLogo[0]?.logoLgImg || largeLogo[0]?.logoSmImg) ? (
          <Image
            style={{ width: "100%", height: "52px" }}
            src={
              openSidebar === true
                ? largeLogo[0]?.logoLgImg
                : largeLogo[0]?.logoSmImg
            }
            alt="Logo"
            cursor="pointer"
            onClick={() => !from && setOpenSidebar(!openSidebar)}
            userSelect="none"
            my={2}
          />
        ) : (
          <Heading
            my={4}
            cursor={"pointer"}
            onClick={() => !from && setOpenSidebar(!openSidebar)}
            userSelect={"none"}
            color={logoColor}
            fontSize={openSidebar ? "2xl" : "xl"}
            lineHeight="1.15"
            textAlign="center"
          >
            {openSidebar === true
              ? getBrandLabel(i18next.language)
              : getBrandMark(i18next.language)}
          </Heading>
        )}
      </Flex>
    </Flex>
  );
}

export default SidebarBrand;
