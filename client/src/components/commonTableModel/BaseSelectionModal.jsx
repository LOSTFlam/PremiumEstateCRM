import React, { useMemo, useState } from "react";
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { GiClick } from "react-icons/gi";
import { useTranslation } from "react-i18next";
import CommonCheckTable from "components/reactTable/checktable";
import Spinner from "components/spinner/Spinner";
import { translateCrmText } from "i18n/crmDictionary";

const BaseSelectionModal = ({
  isOpen,
  onClose,
  title,
  fieldName,
  setFieldValue,
  data = [],
  columns = [],
  isLoading = false,
  selectType = "single",
}) => {
  const { t: i18nT, i18n } = useTranslation();
  const [selectedValues, setSelectedValues] = useState([]);
  const modalTitle = translateCrmText(title, {
    t: i18nT,
    language: i18n.language,
  });

  const labels = useMemo(
    () => ({
      select: i18nT("common.select") || "Select",
      close: i18nT("common.close") || "Close",
    }),
    [i18nT],
  );

  const handleSubmit = async () => {
    try {
      setFieldValue(fieldName, selectedValues);
      onClose();
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  };

  return (
    <Modal onClose={onClose} size="6xl" isOpen={isOpen} scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent className="admin-density-shell">
        <ModalHeader className="admin-density-shell__header">{modalTitle}</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="admin-density-shell__body">
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Spinner />
            </Flex>
          ) : (
            <CommonCheckTable
              title={modalTitle}
              isLoding={isLoading}
              columnData={columns}
              allData={data}
              tableData={data}
              AdvanceSearch={() => ""}
              ManageGrid={false}
              deleteMany={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              selectType={selectType}
              customSearch={false}
            />
          )}
        </ModalBody>
        <ModalFooter className="admin-density-shell__footer">
          <Button
            variant="brand"
            size="sm"
            me={2}
            disabled={isLoading}
            leftIcon={<GiClick />}
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner /> : labels.select}
          </Button>
          <Button variant="outline" size="sm" colorScheme="red" onClick={onClose}>
            {labels.close}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BaseSelectionModal;
