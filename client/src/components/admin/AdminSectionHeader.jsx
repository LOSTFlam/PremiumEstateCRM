import { Flex, Heading } from "@chakra-ui/react";
import AdminEditButton from "components/admin/AdminEditButton";
import PropTypes from "prop-types";

export default function AdminSectionHeader({
  title,
  children,
  canEdit = false,
  onEdit,
  editHref,
  headingSize = "md",
}) {
  return (
    <Flex justify="space-between" align="center" gap={3} flexWrap="wrap" minW={0}>
      {children || (
        <Heading size={headingSize} flex={{ base: "1 1 100%", sm: "1" }} minW={0}>
          {title}
        </Heading>
      )}
      {canEdit ? <AdminEditButton onClick={onEdit} href={editHref} /> : null}
    </Flex>
  );
}

AdminSectionHeader.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  canEdit: PropTypes.bool,
  onEdit: PropTypes.func,
  editHref: PropTypes.string,
  headingSize: PropTypes.string,
};
