import { Button, Flex, IconButton, useBreakpointValue } from "@chakra-ui/react";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useTranslation } from "react-i18next";

/**
 * Edit / Delete actions for CRM record view footers.
 * On mobile: compact icon buttons. On desktop: labeled buttons.
 */
export default function CabinetRecordActions({
  onEdit,
  onDelete,
  showEdit = true,
  showDelete = true,
  editLabel,
  deleteLabel,
  editIcon = <EditIcon />,
  deleteIcon = <DeleteIcon />,
}) {
  const { t } = useTranslation();
  const compact = useBreakpointValue({ base: true, md: false }) ?? true;
  const editText = editLabel || t("common.edit");
  const deleteText = deleteLabel || t("common.delete");

  if (!showEdit && !showDelete) return null;

  if (compact) {
    return (
      <Flex
        className="cabinet-record-actions"
        gap={2}
        w="100%"
        justify="flex-end"
        flexWrap="nowrap"
      >
        {showEdit ? (
          <IconButton
            aria-label={editText}
            icon={editIcon}
            onClick={onEdit}
            colorScheme="gold"
            variant="outline"
            size="md"
            minW="48px"
            w="48px"
            h="48px"
            flexShrink={0}
          />
        ) : null}
        {showDelete ? (
          <IconButton
            aria-label={deleteText}
            icon={deleteIcon}
            onClick={onDelete}
            colorScheme="red"
            size="md"
            minW="48px"
            w="48px"
            h="48px"
            flexShrink={0}
          />
        ) : null}
      </Flex>
    );
  }

  return (
    <Flex className="cabinet-record-actions" gap={2.5} w="100%" justify="flex-end" flexWrap="wrap">
      {showEdit ? (
        <Button
          onClick={onEdit}
          size="sm"
          leftIcon={editIcon}
          variant="outline"
          colorScheme="gold"
          whiteSpace="nowrap"
        >
          {editText}
        </Button>
      ) : null}
      {showDelete ? (
        <Button
          onClick={onDelete}
          size="sm"
          leftIcon={deleteIcon}
          colorScheme="red"
          whiteSpace="nowrap"
        >
          {deleteText}
        </Button>
      ) : null}
    </Flex>
  );
}
