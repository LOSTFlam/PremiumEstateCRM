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
  const { t: i18nT } = useTranslation();
  const [selectedValues, setSelectedValues] = useState([]);

  const labels = useMemo(
    () => ({
      select: i18nT("common.select") || "Select",
      close: i18nT("common.close") || "Close",
    }),
    [i18nT]
  );

  const handleSubmit = async () => {
    try {
      setFieldValue(fieldName, selectedValues);
      onClose();
    } catch (err) {
      // Handle submission error silently
    }
  };

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Spinner />
            </Flex>
          ) : (
            <CommonCheckTable
              title={title}
              isLoding={isLoading}
              columnData={columns}
              allData={data}
              tableData={data}
              AdvanceSearch={false}
              ManageGrid={false}
              deleteMany={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              selectType={selectType}
              customSearch={false}
            />
          )}
        </ModalBody>
        <ModalFooter>
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
