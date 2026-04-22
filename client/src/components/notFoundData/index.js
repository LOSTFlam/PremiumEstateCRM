import { Text } from "@chakra-ui/react";
import React from "react";
import i18next from "i18next";

const DataNotFound = ({ message }) => {
  const isRu = i18next.language?.startsWith("ru");
  return (
    <Text textAlign="center" fontSize="md" fontWeight="600" color="gray.500" py={4}>
      {message || (isRu ? "-- Данные не найдены --" : "-- No Data Found --")}
    </Text>
  );
};

export default DataNotFound;
