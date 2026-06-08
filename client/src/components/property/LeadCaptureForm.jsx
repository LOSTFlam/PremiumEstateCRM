import { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  Input,
  Textarea,
  Button,
  Text,
  HStack,
  Icon,
  useToast,
  Select,
} from "@chakra-ui/react";
import { FiCalendar, FiMail, FiPhone, FiUser, FiMessageSquare } from "react-icons/fi";
import { postApi } from "services/api";
import { useTranslation } from "react-i18next";
import { formatPrice } from "views/public/catalog/catalogData";

const LeadCaptureForm = ({ isOpen, onClose, property, type = "viewing" }) => {
  const { i18n } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const locale = i18n.language?.startsWith("ru") ? "ru" : "en";
  const copy = {
    ru: {
      forms: {
        viewing: { title: "Записаться на просмотр", submitText: "Отправить запрос" },
        info: { title: "Запросить информацию", submitText: "Отправить запрос" },
        offer: { title: "Сделать предложение", submitText: "Отправить предложение" },
        consultation: { title: "Получить консультацию", submitText: "Заказать звонок" },
      },
      successTitle: "Запрос отправлен",
      successDescription: "Наша команда свяжется с вами в ближайшее время.",
      errorTitle: "Ошибка",
      errorDescription: "Не удалось отправить запрос. Попробуйте еще раз.",
      property: "Объект",
      priceLabel: "Цена",
      fullName: "Полное имя",
      email: "Эл. почта",
      phone: "Телефон",
      preferredDate: "Предпочтительная дата",
      preferredTime: "Предпочтительное время",
      selectTime: "Выберите время",
      morning: "Утро (09:00 - 12:00)",
      afternoon: "День (12:00 - 17:00)",
      evening: "Вечер (17:00 - 20:00)",
      message: "Сообщение",
      namePlaceholder: "Иван Иванов",
      emailPlaceholder: "почта@пример.рф",
      phonePlaceholder: "+7 (999) 123-45-67",
      messagePlaceholder: "Мне интересен этот объект, хочу уточнить детали.",
    },
    en: {
      forms: {
        viewing: { title: "Schedule a Viewing", submitText: "Request Viewing" },
        info: { title: "Request Information", submitText: "Send Request" },
        offer: { title: "Make an Offer", submitText: "Submit Offer" },
        consultation: { title: "Get a Consultation", submitText: "Request Call" },
      },
      successTitle: "Request sent successfully!",
      successDescription: "Our team will contact you soon.",
      errorTitle: "Error",
      errorDescription: "Failed to send request. Please try again.",
      property: "Property",
      priceLabel: "Price",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone Number",
      preferredDate: "Preferred Date",
      preferredTime: "Preferred Time",
      selectTime: "Select a time",
      morning: "Morning (9AM - 12PM)",
      afternoon: "Afternoon (12PM - 5PM)",
      evening: "Evening (5PM - 8PM)",
      message: "Message",
      namePlaceholder: "John Doe",
      emailPlaceholder: "john@example.com",
      phonePlaceholder: "+1 (555) 123-4567",
      messagePlaceholder: "I'm interested in this property...",
    },
  }[locale];
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
  });

  const formTitles = {
    viewing: {
      title: copy.forms.viewing.title,
      icon: FiCalendar,
      submitText: copy.forms.viewing.submitText,
    },
    info: {
      title: copy.forms.info.title,
      icon: FiMail,
      submitText: copy.forms.info.submitText,
    },
    offer: {
      title: copy.forms.offer.title,
      icon: FiMessageSquare,
      submitText: copy.forms.offer.submitText,
    },
    consultation: {
      title: copy.forms.consultation.title,
      icon: FiUser,
      submitText: copy.forms.consultation.submitText,
    },
  };

  const currentForm = formTitles[type] || formTitles.viewing;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        ...formData,
        propertyId: property?._id,
        propertyName: property?.name || property?.propertyAddress,
        type,
        source: "website",
      };

      const response = await postApi("api/lead/create", leadData);

      if (response && response.status === 200) {
        toast({
          title: copy.successTitle,
          description: copy.successDescription,
          status: "success",
          duration: 5000,
        });
        onClose();
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
        });
      } else {
        throw new Error("Failed to send request");
      }
    } catch (error) {
      // Console statement removed
      toast({
        title: copy.errorTitle,
        description: copy.errorDescription,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backdropFilter="blur(5px)" />
      <ModalContent
        bg="rgba(15, 23, 42, 0.95)"
        backdropFilter="blur(20px)"
        borderRadius="24px"
        border="1px solid rgba(255,255,255,0.1)"
      >
        <ModalCloseButton color="white" />
        <ModalHeader>
          <HStack spacing={3}>
            <Icon as={currentForm.icon} color="#F5D076" boxSize={6} />
            <Text fontSize="2xl" fontWeight="bold">
              {currentForm.title}
            </Text>
          </HStack>
        </ModalHeader>
        <ModalBody pb={8}>
          {property && (
            <Stack spacing={1} mb={6} p={4} bg="rgba(255,255,255,0.05)" borderRadius="12px">
              <Text fontSize="sm" color="gray.400">
                {copy.property}:
              </Text>
              <Text fontWeight="600">{property.name || property.propertyAddress}</Text>
              {property.listingPrice && (
                <Text color="#F5D076" fontWeight="bold">
                  {copy.priceLabel}: {formatPrice(property.listingPrice)}
                </Text>
              )}
            </Stack>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiUser} color="gray.400" />
                  <Text fontWeight="500">{copy.fullName} *</Text>
                </HStack>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={copy.namePlaceholder}
                  required
                  borderRadius="12px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  _focus={{
                    borderColor: "#F5D076",
                    boxShadow: "0 0 0 1px #F5D076",
                  }}
                />
              </Stack>

              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiMail} color="gray.400" />
                  <Text fontWeight="500">{copy.email} *</Text>
                </HStack>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={copy.emailPlaceholder}
                  required
                  borderRadius="12px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  _focus={{
                    borderColor: "#F5D076",
                    boxShadow: "0 0 0 1px #F5D076",
                  }}
                />
              </Stack>

              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiPhone} color="gray.400" />
                  <Text fontWeight="500">{copy.phone} *</Text>
                </HStack>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={copy.phonePlaceholder}
                  required
                  borderRadius="12px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  _focus={{
                    borderColor: "#F5D076",
                    boxShadow: "0 0 0 1px #F5D076",
                  }}
                />
              </Stack>

              {(type === "viewing" || type === "consultation") && (
                <>
                  <Stack spacing={2}>
                    <Text fontWeight="500">{copy.preferredDate}</Text>
                    <Input
                      name="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      borderRadius="12px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(255,255,255,0.1)"
                      _focus={{
                        borderColor: "#F5D076",
                        boxShadow: "0 0 0 1px #F5D076",
                      }}
                    />
                  </Stack>

                  <Stack spacing={2}>
                    <Text fontWeight="500">{copy.preferredTime}</Text>
                    <Select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      borderRadius="12px"
                      bg="rgba(255,255,255,0.05)"
                      border="1px solid rgba(255,255,255,0.1)"
                      _focus={{
                        borderColor: "#F5D076",
                        boxShadow: "0 0 0 1px #F5D076",
                      }}
                    >
                      <option value="">{copy.selectTime}</option>
                      <option value="morning">{copy.morning}</option>
                      <option value="afternoon">{copy.afternoon}</option>
                      <option value="evening">{copy.evening}</option>
                    </Select>
                  </Stack>
                </>
              )}

              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiMessageSquare} color="gray.400" />
                  <Text fontWeight="500">{copy.message}</Text>
                </HStack>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={copy.messagePlaceholder}
                  rows={4}
                  borderRadius="12px"
                  bg="rgba(255,255,255,0.05)"
                  border="1px solid rgba(255,255,255,0.1)"
                  _focus={{
                    borderColor: "#F5D076",
                    boxShadow: "0 0 0 1px #F5D076",
                  }}
                />
              </Stack>

              <Button
                type="submit"
                colorScheme="green"
                size="lg"
                borderRadius="12px"
                isLoading={loading}
                mt={4}
              >
                {currentForm.submitText}
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LeadCaptureForm;
