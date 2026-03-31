// Chakra imports
// Chakra imports
import {
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import CountUpComponent from "components/countUpComponent/countUpComponent";
// Custom icons
import React from "react";
import { useTranslation } from "react-i18next";
import { isRussianLocale, translateCrmText } from "i18n/crmDictionary";

export default function Default(props) {
  const { startContent, endContent, name, growth, value } = props;
  const { t, i18n } = useTranslation();
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = "secondaryGray.600";
  const displayName = translateCrmText(name, { t, language: i18n.language });

  return (
    <Card cursor={"pointer"} py="15px" onClick={props?.onClick}>
      <Flex
        my="auto"
        h="100%"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Stat my="auto" ms={startContent ? "18px" : "0px"}>
          <StatLabel
            lineHeight="100%"
            color={textColorSecondary}
            fontSize={{
              base: props.fontsize ? props.fontsize : "sm",
            }}
            lineHeight="1.35"
          >
            {displayName}
          </StatLabel>
          <StatNumber
            color={textColor}
            fontSize={{
              base: "2xl",
            }}
          >
            <CountUpComponent targetNumber={value} />
            {/* {value} */}
          </StatNumber>
          {growth ? (
            <Flex align="center">
              <Text color="green.500" fontSize="xs" fontWeight="700" me="5px">
                {growth}
              </Text>
              <Text color="secondaryGray.600" fontSize="xs" fontWeight="400">
                {isRussianLocale(i18n.language)
                  ? "К прошлому месяцу"
                  : "Since last month"}
              </Text>
            </Flex>
          ) : null}
        </Stat>
        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
