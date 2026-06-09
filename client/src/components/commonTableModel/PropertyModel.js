import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyData } from "../../redux/slices/propertySlice.js";
import { useTranslation } from "react-i18next";
import BaseSelectionModal from "./BaseSelectionModal";
import { selectPropertyList, selectPropertyLoading } from "../../redux/selectors/entitySelectors";

const PropertyModel = (props) => {
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

  const { onClose, isOpen, fieldName, setFieldValue, data } = props;
  const dispatch = useDispatch();
  const propertiesData = useSelector(selectPropertyList);
  const storeLoading = useSelector(selectPropertyLoading);

  const [isLoding, setIsLoding] = useState(false);

  const fetchData = useCallback(async () => {
    setIsLoding(true);
    try {
      await dispatch(fetchPropertyData());
      // Data is loaded via Redux
    } catch (error) {
      // Handle error silently - Redux will handle error state
    } finally {
      setIsLoding(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const tableColumns = useMemo(
    () => [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      { Header: safeT("fields.name", "Name"), accessor: "name" },
      { Header: safeT("fields.propertyAddress", "Address"), accessor: "propertyAddress" },
      { Header: safeT("fields.propertyType", "Type"), accessor: "propertyType" },
      { Header: safeT("fields.listingPrice", "Price"), accessor: "listingPrice" },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [safeT]
  );

  return (
    <BaseSelectionModal
      isOpen={isOpen}
      onClose={onClose}
      title="Properties"
      fieldName={fieldName}
      setFieldValue={setFieldValue}
      data={propertiesData ?? data ?? []}
      columns={tableColumns}
      isLoading={isLoding || storeLoading}
    />
  );
};

export default PropertyModel;
