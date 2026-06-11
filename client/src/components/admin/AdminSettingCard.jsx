import { Box, Flex, Icon, Text, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import PropTypes from "prop-types";

export default function AdminSettingCard({ icon, title, description, onClick }) {
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const mutedColor = useColorModeValue("secondaryGray.600", "whiteAlpha.700");

  return (
    <Card
      cursor="pointer"
      py="18px"
      px="16px"
      h="100%"
      transition="transform 0.2s ease, box-shadow 0.2s ease"
      _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
      onClick={onClick}
    >
      <Flex align="flex-start" gap="16px">
        <IconBox
          w="56px"
          h="56px"
          minW="56px"
          bg="linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)"
          icon={<Icon w="28px" h="28px" as={icon} color="white" />}
        />
        <Box flex="1" minW={0}>
          <Text color={textColor} fontSize="md" fontWeight="700" lineHeight="1.3" noOfLines={2}>
            {title}
          </Text>
          <Text color={mutedColor} fontSize="sm" mt="6px" lineHeight="1.45" noOfLines={3}>
            {description}
          </Text>
        </Box>
      </Flex>
    </Card>
  );
}

AdminSettingCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
