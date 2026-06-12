import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { putApi } from "services/api";
import PropTypes from "prop-types";

const readFieldValue = (property, key) => {
  const value = property?.[key];
  if (value === null || value === undefined) return "";
  if (key === "unitType" && Array.isArray(value)) {
    return value.map((item) => item?.name || item?.label || item?.title || item).join(", ");
  }
  return String(value);
};

export default function PropertyInlineEditModal({
  isOpen,
  onClose,
  property,
  section,
  sectionConfig,
  onSaved,
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [values, setValues] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isOpen || !sectionConfig?.fields) return;
    const next = {};
    sectionConfig.fields.forEach((field) => {
      next[field.key] = readFieldValue(property, field.key);
    });
    setValues(next);
  }, [isOpen, property, sectionConfig]);

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!property?._id) return;

    setSaving(true);
    try {
      const payload = { ...values };
      if ("numberofBedrooms" in payload)
        payload.numberofBedrooms = Number(payload.numberofBedrooms) || 0;
      if ("numberofBathrooms" in payload)
        payload.numberofBathrooms = Number(payload.numberofBathrooms) || 0;

      const response = await putApi(`api/property/edit/${property._id}`, payload, false);
      const updated = response?.data || { ...property, ...payload };
      onSaved?.(updated);
      toast({
        title: t("adminInline.saved", { defaultValue: "Changes saved" }),
        status: "success",
        duration: 2500,
      });
      onClose();
    } catch {
      toast({
        title: t("adminInline.saveError", { defaultValue: "Failed to save changes" }),
        status: "error",
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {t(`adminInline.sections.${section}`, {
            defaultValue: t("common.edit", { defaultValue: "Edit" }),
          })}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            {sectionConfig?.fields?.map((field) => (
              <FormControl key={field.key}>
                <FormLabel fontSize="sm">
                  {t(field.labelKey, { defaultValue: field.key })}
                </FormLabel>
                {field.type === "textarea" ? (
                  <Textarea
                    value={values[field.key] || ""}
                    rows={field.rows || 3}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                ) : field.type === "select" ? (
                  <Select
                    value={values[field.key] || ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  >
                    {(field.options || []).map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    type={
                      field.type === "number" ? "number" : field.type === "date" ? "date" : "text"
                    }
                    value={values[field.key] || ""}
                    onChange={(event) => handleChange(field.key, event.target.value)}
                  />
                )}
              </FormControl>
            ))}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t("common.cancel", { defaultValue: "Cancel" })}
          </Button>
          <Button colorScheme="green" onClick={handleSave} isLoading={saving}>
            {t("common.save", { defaultValue: "Save" })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

PropertyInlineEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  property: PropTypes.object,
  section: PropTypes.string.isRequired,
  sectionConfig: PropTypes.object.isRequired,
  onSaved: PropTypes.func,
};
