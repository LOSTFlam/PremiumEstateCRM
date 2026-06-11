import PropertyInlineEditModal from "components/admin/PropertyInlineEditModal";
import { PROPERTY_EDIT_SECTIONS } from "data/propertyEditSections";
import PropTypes from "prop-types";

export default function PropertyAdminEditLayer({
  property,
  editSection,
  onClose,
  onSaved,
}) {
  return (
    <PropertyInlineEditModal
      isOpen={Boolean(editSection)}
      onClose={onClose}
      property={property}
      section={editSection}
      sectionConfig={PROPERTY_EDIT_SECTIONS[editSection] || { fields: [] }}
      onSaved={onSaved}
    />
  );
}

PropertyAdminEditLayer.propTypes = {
  property: PropTypes.object,
  editSection: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSaved: PropTypes.func,
};
