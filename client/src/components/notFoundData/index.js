import { Text } from "@chakra-ui/react";
import React from "react";

const DataNotFound = ({ message }) => {
  return (
    <Text 
      textAlign="center" 
      fontSize="md" 
      fontWeight="600" 
      color="gray.500"
      py={4}
    >
      {message || "-- No Data Found --"}
    </Text>
  );
};

export default DataNotFound;
