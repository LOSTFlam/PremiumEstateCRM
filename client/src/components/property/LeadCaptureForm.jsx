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

const LeadCaptureForm = ({ isOpen, onClose, property, type = "viewing" }) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
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
      title: "Schedule a Viewing",
      icon: FiCalendar,
      submitText: "Request Viewing",
    },
    info: {
      title: "Request Information",
      icon: FiMail,
      submitText: "Send Request",
    },
    offer: {
      title: "Make an Offer",
      icon: FiMessageSquare,
      submitText: "Submit Offer",
    },
    consultation: {
      title: "Get a Consultation",
      icon: FiUser,
      submitText: "Request Call",
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
          title: "Request sent successfully!",
          description: "Our team will contact you soon.",
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
      console.error("Error submitting lead:", error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
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
                Property:
              </Text>
              <Text fontWeight="600">{property.name || property.propertyAddress}</Text>
              {property.listingPrice && (
                <Text color="#F5D076" fontWeight="bold">
                  ${property.listingPrice.toLocaleString()}
                </Text>
              )}
            </Stack>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiUser} color="gray.400" />
                  <Text fontWeight="500">Full Name *</Text>
                </HStack>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
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
                  <Text fontWeight="500">Email *</Text>
                </HStack>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
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
                  <Text fontWeight="500">Phone Number *</Text>
                </HStack>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
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
                    <Text fontWeight="500">Preferred Date</Text>
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
                    <Text fontWeight="500">Preferred Time</Text>
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
                      <option value="">Select a time</option>
                      <option value="morning">Morning (9AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </Select>
                  </Stack>
                </>
              )}

              <Stack spacing={2}>
                <HStack>
                  <Icon as={FiMessageSquare} color="gray.400" />
                  <Text fontWeight="500">Message</Text>
                </HStack>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="I'm interested in this property..."
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
