import { useState } from "react";
import { useSelector } from "react-redux";
import { canManageListings, getPropertyAdminPath } from "utils/adminAccess";

export function usePropertyInlineEdit(property, setProperty, options = {}) {
  const { onSyncCollection } = options;
  const reduxUser = useSelector((state) => state?.user?.user);
  const canEditListing = canManageListings(reduxUser);
  const propertyAdminPath = getPropertyAdminPath(property?._id);
  const [editSection, setEditSection] = useState(null);

  const openEdit = (section) => setEditSection(section);
  const closeEdit = () => setEditSection(null);

  const handlePropertySaved = (updated) => {
    if (!updated) return;
    setProperty((prev) => ({ ...prev, ...updated }));
    onSyncCollection?.(updated);
  };

  return {
    canEditListing,
    propertyAdminPath,
    editSection,
    openEdit,
    closeEdit,
    handlePropertySaved,
    isEditOpen: Boolean(editSection),
  };
}
