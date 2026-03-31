import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import Spinner from "components/spinner/Spinner";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CommonDeleteModel = (props) => {
  const { isOpen, onClose, type, handleDeleteData, ids, selectedValues } =
    props;
  const [isLoding, setIsLoding] = useState(false);
  const { i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");

  const handleDelete = () => {
    handleDeleteData(ids, selectedValues);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isRu ? "Удалить запись" : `Delete ${`${type}`}`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isRu ? "Вы уверены, что хотите удалить выбранную запись?" : `Are You Sure To Delete selected ${`${type}`} ?`}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              size="sm"
              mr={2}
              onClick={handleDelete}
              disabled={isLoding ? true : false}
            >
              {isLoding ? <Spinner /> : isRu ? "Да" : "Yes"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClose}>
              {isRu ? "Нет" : "No"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommonDeleteModel;
