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
import React, { useState } from "react";
import Spinner from "components/spinner/Spinner";
import { GiClick } from "react-icons/gi";
import CommonCheckTable from "components/reactTable/checktable";
import { useTranslation } from "react-i18next";

const AccountModel = (props) => {
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
  const title = "Account";

  const [isLoding, setIsLoding] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSubmit = async () => {
    try {
      setIsLoding(true);
      setFieldValue(fieldName, selectedValues);
      onClose();
    } catch (e) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };
  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    { Header: safeT("fields.accountName", "Account Name"), accessor: "name" },
    { Header: safeT("fields.officePhone", "Office Phone"), accessor: "officePhone" },
    { Header: safeT("fields.fax", "Fax"), accessor: "fax" },
    { Header: safeT("fields.emailAddress", "Email Address"), accessor: "emailAddress" },
  ];

  // const fetchData = async () => {
  //     setIsLoding(true)
  //     const result = await dispatch(fetchAccountData())

  //     if (result.payload.status === 200) {
  //         setData(result?.payload?.data);
  //     } else {
  //         toast.error("Failed to fetch data", "error");
  //     }
  //     setIsLoding(false)
  // }

  // useEffect(() => {
  //     fetchData()
  // }, [])

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoding ? (
            <Flex justifyContent={"center"} alignItems={"center"} width="100%">
              <Spinner />
            </Flex>
          ) : (
            <CommonCheckTable
              title={title}
              isLoding={isLoding}
              columnData={tableColumns ?? []}
              // dataColumn={columns ?? []}
              allData={data ?? []}
              tableData={data}
              AdvanceSearch={false}
              ManageGrid={false}
              deleteMany={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              selectType="single"
              customSearch={false}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            me={2}
            disabled={isLoding ? true : false}
            leftIcon={<GiClick />}
            onClick={handleSubmit}
          >
            {" "}
            {isLoding ? <Spinner /> : "Select"}
          </Button>
          <Button variant="outline" size="sm" colorScheme="red" onClick={() => onClose()}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AccountModel;
