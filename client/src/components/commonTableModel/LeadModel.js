import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseSelectionModal from "./BaseSelectionModal";

const LeadModel = (props) => {
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
      { Header: safeT("fields.leadName", "Lead Name"), accessor: "leadName" },
      { Header: safeT("fields.leadEmail", "Lead Email"), accessor: "leadEmail" },
      { Header: safeT("fields.leadMobile", "Lead Mobile"), accessor: "leadMobile" },
    ],
    [i18nT],
  );

  return (
    <BaseSelectionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Leads"
      fieldName={fieldName}
      setFieldValue={setFieldValue}
      data={data ?? []}
      columns={tableColumns}
      isLoading={isLoding}
    />
  );
};

export default LeadModel;
