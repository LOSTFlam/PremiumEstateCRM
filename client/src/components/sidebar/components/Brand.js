// Chakra imports
import { Flex, Heading, Image, useColorModeValue } from "@chakra-ui/react";

// Custom components
import { HSeparator } from "components/separator/Separator";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchImage } from "../../../redux/slices/imageSlice";
import i18next from "i18next";

export function SidebarBrand(props) {
  const { setOpenSidebar, openSidebar, from, largeLogo } = props;

  //   Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");
  let sidebarBg = useColorModeValue("white", "navy.900");
  const isRu = i18next.language?.startsWith("ru");

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
          >
            {openSidebar === true ? (isRu ? "Премиум Эстейт" : "PremiumEstate") : (isRu ? "ПЭ" : "PE")}
          </Heading>
        )}
      </Flex>
    </Flex>
  );
}

export default SidebarBrand;
