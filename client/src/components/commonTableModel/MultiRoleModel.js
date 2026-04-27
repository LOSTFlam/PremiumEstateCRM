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
import { getApi } from "services/api";
import { useTranslation } from "react-i18next";

const MultiRoleModel = (props) => {
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

  const { onClose, isOpen, fieldName, setFieldValue, data: _data, role: _role } = props;
  const title = "Roles";

  const [isLoding, setIsLoding] = useState(false);
  const [roleData, setRoleData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    try {
      const result = await getApi("api/role/");
      setRoleData(result?.data || []);
    } catch (error) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await fetchCustomDataFields();
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

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

  const columns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
      display: false,
    },
    {
      Header: safeT("fields.roleName", "Role Name"),
      accessor: "roleName",
    },
    { Header: safeT("fields.description", "Description"), accessor: "description" },
  ];

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isRu ? "Выбрать роль" : "Select Role"}</ModalHeader>
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
              columnData={columns ?? []}
              allData={roleData ?? []}
              tableData={roleData}
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

export default MultiRoleModel;
