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
import React, { useEffect, useState } from "react";
import Spinner from "components/spinner/Spinner";
import { GiClick } from "react-icons/gi";
import CommonCheckTable from "components/reactTable/checktable";
import { useDispatch } from "react-redux";
import { getApi } from "services/api";
import { useTranslation } from "react-i18next";

const UserModel = (props) => {
  const { t: i18nT, i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");

  // Safe translation with fallback - always returns a string
  const safeT = (key, fallback) => {
    try {
      const result = i18nT(key);
      return result || fallback || key;
    } catch (e) {
      return fallback || key;
    }
  };

  const { onClose, isOpen, fieldName, setFieldValue, data, isLoding, setIsLoding } = props;
  const title = "Users";
  const _dispatch = useDispatch();
  // const [data, setData] = useState([]);

  // const [isLoding, setIsLoding] = useState(false);
  const [_leadData, setLeadData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);
  const roleHeader = { Header: safeT("fields.role", "Role"), accessor: "role" };

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

  const fetchData = async () => {
    setIsLoding(true);
    try {
      const result = await getApi("api/user/");
      setLeadData(result?.data?.user || []);
    } catch (error) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isOpen]);

  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: safeT("fields.email", "Email"),
      accessor: "username",
    },
    { Header: safeT("fields.firstName", "First Name"), accessor: "firstName" },
    { Header: safeT("fields.lastName", "Last Name"), accessor: "lastName" },
    ...(fieldName !== "salesAgent" ? [roleHeader] : []),
  ];

  // const [columns, setColumns] = useState([...tableColumns]);
  // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

  // const fetchData = async () => {
  //     setIsLoding(true)
  //     let result = await getApi('api/user/');
  //     setData(result?.data?.user);
  //     setIsLoding(false)
  // }

  // useEffect(() => {
  //     fetchData()
  // }, [])

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isRu ? "Выбрать пользователя" : "Select User"}</ModalHeader>
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
            {isLoding ? <Spinner /> : isRu ? "Выбрать" : "Select"}
          </Button>
          <Button variant="outline" size="sm" colorScheme="red" onClick={() => onClose()}>
            {isRu ? "Закрыть" : "Close"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserModel;
