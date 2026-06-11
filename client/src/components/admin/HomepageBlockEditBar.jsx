import { Box, HStack, Text } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AdminEditButton from "components/admin/AdminEditButton";
import PropTypes from "prop-types";

export default function HomepageBlockEditBar({ blockKey, blockLabel, belowHeader = false }) {
  const { t } = useTranslation();

  return (
    <Box
      position="absolute"
      top={belowHeader ? { base: "96px", md: "88px" } : { base: 2, md: 4 }}
      right={{ base: 2, md: 4 }}
      zIndex={40}
      px={3}
      py={2}
      borderRadius="full"
      bg="rgba(8, 17, 26, 0.82)"
      border="1px solid rgba(245, 208, 118, 0.24)"
      backdropFilter="blur(10px)"
      boxShadow="0 10px 30px rgba(0,0,0,0.28)"
    >
      <HStack spacing={2}>
        <Text fontSize="xs" color="#f5d076" fontWeight="700" display={{ base: "none", md: "block" }}>
          {blockLabel || t(`homepageEditor.blocks.${blockKey}`)}
        </Text>
        <AdminEditButton
          compact
          href={`/homepage-editor#${blockKey}`}
          label={t("adminInline.editBlock", { defaultValue: "Edit block" })}
        />
      </HStack>
    </Box>
  );
}

HomepageBlockEditBar.propTypes = {
  blockKey: PropTypes.string.isRequired,
  blockLabel: PropTypes.string,
  belowHeader: PropTypes.bool,
};
