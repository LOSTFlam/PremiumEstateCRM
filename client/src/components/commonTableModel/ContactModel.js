import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseSelectionModal from "./BaseSelectionModal";

const ContactModel = (props) => {
  const { t: i18nT } = useTranslation();
  
  // Safe translation with fallback - always returns a string
  const safeT = (key, fallback) => {
    try {
      const result = i18nT(key);
      return result || fallback || key;
    } catch (e) {
      return fallback || key;
    }
  };
  
  const {
    onClose,
    isOpen,
    fieldName,
    setFieldValue,
    data,
  } = props;
  const [isLoding] = useState(false);

  const tableColumns = useMemo(
    () => [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      { Header: safeT("fields.fullName", "Full Name"), accessor: "fullName" },
      { Header: safeT("fields.email", "Email"), accessor: "email" },
      { Header: safeT("fields.phoneNumber", "Phone Number"), accessor: "phoneNumber" },
    ],
    [i18nT],
  );

  return (
    <BaseSelectionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Contacts"
      fieldName={fieldName}
      setFieldValue={setFieldValue}
      data={data ?? []}
      columns={tableColumns}
      isLoading={isLoding}
    />
  );
};

export default ContactModel;
