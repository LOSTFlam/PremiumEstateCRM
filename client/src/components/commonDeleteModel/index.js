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
import { useTranslation } from "react-i18next";
import {
  buildDeleteQuestion,
  buildDeleteTitle,
  translateCrmText,
} from "i18n/crmDictionary";

const CommonDeleteModel = (props) => {
  const { isOpen, onClose, type, handleDeleteData, ids, selectedValues } =
    props;
  const { t, i18n } = useTranslation();
  const translatedType = translateCrmText(type, { t, language: i18n.language });
  const isLoding = false;

  const handleDelete = () => {
    handleDeleteData(ids, selectedValues);
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Modal onClose={onClose} isOpen={isOpen} isCentered scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent className="admin-density-shell">
          <ModalHeader className="admin-density-shell__header">
            {buildDeleteTitle(translatedType || type, {
              t,
              language: i18n.language,
            })}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody className="admin-density-shell__body">
            {Array.isArray(ids) && ids.length > 1
              ? t("common.deleteConfirmation")
              : buildDeleteQuestion(translatedType || type || "record", {
                  t,
                  language: i18n.language,
                })}
          </ModalBody>
          <ModalFooter className="admin-density-shell__footer">
            <Button
              colorScheme="red"
              size="sm"
              mr={2}
              onClick={handleDelete}
              disabled={isLoding ? true : false}
            >
              {isLoding ? <Spinner /> : t("common.confirm")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClose}>
              {t("common.cancel")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommonDeleteModel;
