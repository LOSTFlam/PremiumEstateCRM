import { Text } from "@chakra-ui/react";
import React from "react";
import { useTranslation } from "react-i18next";

const DataNotFound = ({ message }) => {
  const { t } = useTranslation();
  return (
    <Text 
      textAlign="center" 
      fontSize="md" 
      fontWeight="600" 
      color="gray.500"
      py={4}
    >
      {message || `-- ${t("common.noData")} --`}
    </Text>
  );
};

export default DataNotFound;
