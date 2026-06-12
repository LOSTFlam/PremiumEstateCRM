import { Button, HStack, IconButton, Tooltip } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";
import PropTypes from "prop-types";

export default function AdminEditButton({ onClick, href, size = "sm", compact = false, label }) {
  const { t } = useTranslation();
  const editLabel = label || t("common.edit", { defaultValue: "Edit" });

  if (compact) {
    return (
      <HStack spacing={1}>
        {onClick ? (
          <Tooltip label={editLabel}>
            <IconButton
              aria-label={editLabel}
              icon={<EditIcon />}
              size={size}
              colorScheme="green"
              variant="solid"
              onClick={onClick}
            />
          </Tooltip>
        ) : href ? (
          <Tooltip label={editLabel}>
            <IconButton
              as={RouterLink}
              to={href}
              aria-label={editLabel}
              icon={<EditIcon />}
              size={size}
              colorScheme="green"
              variant="solid"
            />
          </Tooltip>
        ) : null}
        {href && onClick ? (
          <Tooltip label={t("adminInline.openInCrm", { defaultValue: "Open in CRM" })}>
            <IconButton
              as={RouterLink}
              to={href}
              aria-label={t("adminInline.openInCrm", { defaultValue: "Open in CRM" })}
              icon={<FiExternalLink />}
              size={size}
              variant="outline"
              colorScheme="green"
            />
          </Tooltip>
        ) : null}
      </HStack>
    );
  }

  return (
    <HStack spacing={2}>
      {onClick ? (
        <Button size={size} colorScheme="green" leftIcon={<EditIcon />} onClick={onClick}>
          {editLabel}
        </Button>
      ) : href ? (
        <Button as={RouterLink} to={href} size={size} colorScheme="green" leftIcon={<EditIcon />}>
          {editLabel}
        </Button>
      ) : null}
      {href && onClick ? (
        <Button
          as={RouterLink}
          to={href}
          size={size}
          variant="outline"
          colorScheme="green"
          leftIcon={<FiExternalLink />}
        >
          {t("adminInline.openInCrm", { defaultValue: "Open in CRM" })}
        </Button>
      ) : null}
    </HStack>
  );
}

AdminEditButton.propTypes = {
  onClick: PropTypes.func,
  href: PropTypes.string,
  size: PropTypes.string,
  compact: PropTypes.bool,
  label: PropTypes.string,
};
