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
import { useTranslation } from "react-i18next";

function ChangeStatusModel(props) {
  const { onClose, isOpen, clickOnYes, title, message } = props;
  const { i18n } = useTranslation();
  const isRu = i18n.language?.startsWith("ru");
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title || (isRu ? "Изменить статус" : "Change Status")}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{message || (isRu ? "Вы уверены, что хотите изменить статус?" : "Are you sure to change status")}</ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            type="submit"
            mr={2}
            onClick={clickOnYes}
          >
            {isRu ? "Да" : "Yes"}
          </Button>
          <Button variant="outline" colorScheme="red" size="sm" type="submit" onClick={onClose}>
            {isRu ? "Нет" : "No"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default ChangeStatusModel;
