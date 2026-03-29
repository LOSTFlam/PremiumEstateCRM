import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  HStack,
  Stack,
  Text,
  Badge,
  Button,
  Input,
  Select,
  SimpleGrid,
  useColorModeValue,
  Icon,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { FiMoreVertical, FiCalendar, FiMail, FiPhone, FiUser, FiMessageSquare } from "react-icons/fi";
import { getApi, postApi, putApi } from "services/api";
import { useTranslation } from "react-i18next";
import GlassCard from "components/GlassCard";

const statusColors = {
  new: { bg: "blue.100", color: "blue.600" },
  contacted: { bg: "yellow.100", color: "yellow.600" },
  qualified: { bg: "purple.100", color: "purple.600" },
  viewing: { bg: "orange.100", color: "orange.600" },
  offer: { bg: "pink.100", color: "pink.600" },
  closed: { bg: "green.100", color: "green.600" },
  lost: { bg: "gray.100", color: "gray.600" },
};

const LeadKanban = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState("");

  const statuses = ["new", "contacted", "qualified", "viewing", "offer", "closed", "lost"];

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await getApi("api/lead/");
      if (response && response.data) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      await putApi(`api/lead/${leadId}`, { status: newStatus });
      setLeads(leads.map((lead) => (lead._id === leadId ? { ...lead, status: newStatus } : lead)));
      toast({
        title: "Status updated",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      console.error("Error updating lead:", error);
      toast({
        title: "Error updating status",
        status: "error",
        duration: 3000,
      });
    }
  };

  const addNote = async () => {
    try {
      await postApi(`api/lead/${selectedLead._id}/note`, { note });
      toast({
        title: "Note added",
        status: "success",
        duration: 2000,
      });
      setNote("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Error adding note",
        status: "error",
        duration: 3000,
      });
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.property?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getLeadsByStatus = (status) => filteredLeads.filter((lead) => lead.status === status);

  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Container maxW="8xl" py={8}>
      <Stack spacing={6}>
        {/* Header */}
        <HStack justify="space-between" flexWrap="wrap" gap={4}>
          <Stack spacing={1}>
            <Heading size="xl">Lead Management</Heading>
            <Text color="gray.500">Track and manage your leads through the sales pipeline</Text>
          </Stack>
          <HStack spacing={3}>
            <Input
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              maxW="300px"
              borderRadius="12px"
              bg="white"
            />
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              maxW="200px"
              borderRadius="12px"
            >
              <option value="all">All Status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </Select>
          </HStack>
        </HStack>

        {/* Kanban Board */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} spacing={4} minH="600px">
          {statuses.map((status) => {
            const statusLeads = getLeadsByStatus(status);
            const colors = statusColors[status];

            return (
              <Box key={status} bg={bgColor} borderRadius="16px" p={4}>
                <HStack justify="space-between" mb={4}>
                  <HStack>
                    <Badge px={3} py={1} borderRadius="full" bg={colors.bg} color={colors.color}>
                      {statusLeads.length}
                    </Badge>
                    <Text fontWeight="600" textTransform="capitalize">
                      {status}
                    </Text>
                  </HStack>
                </HStack>

                <Stack spacing={3}>
                  {statusLeads.map((lead) => (
                    <GlassCard key={lead._id} p={4} borderRadius="16px" _hover={{ transform: "translateY(-2px)" }}>
                      <Stack spacing={3}>
                        <HStack justify="space-between">
                          <HStack>
                            <Avatar size="sm" name={lead.name} bg={colors.color} />
                            <Stack spacing={0}>
                              <Text fontWeight="600" fontSize="sm">
                                {lead.name || "Anonymous"}
                              </Text>
                              <Text color="gray.500" fontSize="xs" noOfLines={1}>
                                {lead.property || "No property"}
                              </Text>
                            </Stack>
                          </HStack>
                          <Menu>
                            <MenuButton as={Button} size="sm" variant="ghost" minW="auto" p={2}>
                              <Icon as={FiMoreVertical} boxSize={4} />
                            </MenuButton>
                            <MenuList>
                              {statuses.map((s) => (
                                <MenuItem
                                  key={s}
                                  onClick={() => updateLeadStatus(lead._id, s)}
                                  isDisabled={s === status}
                                >
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </MenuItem>
                              ))}
                              <MenuItem onClick={() => { setSelectedLead(lead); setIsModalOpen(true); }}>
                                Add Note
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>

                        <Stack spacing={2}>
                          {lead.email && (
                            <HStack spacing={2}>
                              <Icon as={FiMail} boxSize={4} color="gray.400" />
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {lead.email}
                              </Text>
                            </HStack>
                          )}
                          {lead.phone && (
                            <HStack spacing={2}>
                              <Icon as={FiPhone} boxSize={4} color="gray.400" />
                              <Text fontSize="xs" color="gray.500">
                                {lead.phone}
                              </Text>
                            </HStack>
                          )}
                          {lead.preferredDate && (
                            <HStack spacing={2}>
                              <Icon as={FiCalendar} boxSize={4} color="gray.400" />
                              <Text fontSize="xs" color="gray.500">
                                {new Date(lead.preferredDate).toLocaleDateString()}
                              </Text>
                            </HStack>
                          )}
                        </Stack>

                        <HStack justify="space-between">
                          <Text fontSize="xs" color="gray.400">
                            {new Date(lead.createdAt).toLocaleDateString()}
                          </Text>
                          <Badge fontSize="xs" colorScheme={lead.type === "viewing" ? "green" : "blue"}>
                            {lead.type}
                          </Badge>
                        </HStack>
                      </Stack>
                    </GlassCard>
                  ))}

                  {statusLeads.length === 0 && (
                    <Text textAlign="center" color="gray.400" py={8}>
                      No leads
                    </Text>
                  )}
                </Stack>
              </Box>
            );
          })}
        </SimpleGrid>
      </Stack>

      {/* Add Note Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} isCentered>
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent bg="rgba(15, 23, 42, 0.95)" backdropFilter="blur(20px)" borderRadius="24px">
          <ModalCloseButton color="white" />
          <ModalHeader>
            <HStack spacing={3}>
              <Icon as={FiMessageSquare} color="#F5D076" boxSize={6} />
              <Text fontSize="2xl" fontWeight="bold">
                Add Note
              </Text>
            </HStack>
          </ModalHeader>
          <ModalBody pb={8}>
            {selectedLead && (
              <Stack spacing={4} mb={6}>
                <Text fontWeight="600">{selectedLead.name}</Text>
                <Text color="gray.400" fontSize="sm">
                  {selectedLead.email}
                </Text>
              </Stack>
            )}
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this lead..."
              rows={6}
              borderRadius="12px"
              bg="rgba(255,255,255,0.05)"
              border="1px solid rgba(255,255,255,0.1)"
              _focus={{
                borderColor: "#F5D076",
                boxShadow: "0 0 0 1px #F5D076",
              }}
            />
            <Button
              onClick={addNote}
              colorScheme="green"
              size="lg"
              borderRadius="12px"
              mt={4}
              isDisabled={!note.trim()}
            >
              Add Note
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default LeadKanban;
