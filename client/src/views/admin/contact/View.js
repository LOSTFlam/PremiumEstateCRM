import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import Spinner from "components/spinner/Spinner";
import { constant } from "constant";
import { useEffect, useState } from "react";
import { FaFilePdf } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getApi, deleteApi } from "services/api";
import CabinetRecordActions from "components/cabinet/CabinetRecordActions";
import { HasAccess } from "../../../redux/accessUtils";
import { useDispatch, useSelector } from "react-redux";
import { fetchContactCustomFiled } from "../../../redux/slices/contactCustomFiledSlice";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice";
import html2pdf from "html2pdf.js";
import moment from "moment";
import ContactOverviewTab from "./components/view/ContactOverviewTab";
import ContactEngagementTab from "./components/view/ContactEngagementTab";
import ContactDocumentsTab from "./components/view/ContactDocumentsTab";
import ContactSocialTab from "./components/view/ContactSocialTab";
import ContactViewModals from "./components/view/ContactViewModals";
import {
  createCallColumns,
  createColumnsDataColumns,
  createInvoicesColumns,
  createMeetingColumns,
  createQuotesColumns,
  createTaskColumns,
} from "./components/view/contactViewColumns";

const View = () => {
  const param = useParams();
  const textColor = useColorModeValue("gray.500", "white");

  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [propertyModel, setPropertyModel] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [action, setAction] = useState(false);

  const [taskModel, setTaskModel] = useState(false);
  const [addEmailHistory, setAddEmailHistory] = useState(false);
  const [addPhoneCall, setAddPhoneCall] = useState(false);
  const [addQuotes, setAddQuotes] = useState(false);
  const [addInvoice, setAddInvoice] = useState(false);
  const [addMeeting, setMeeting] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const [showMeetings, setShowMeetings] = useState(false);
  const [showQuotes, setShowQuotes] = useState(false);
  const [showInvoices, setShowInvoices] = useState(false);
  const [addDocument, setAddDocument] = useState(false);

  const [selectedTab, setSelectedTab] = useState(0);
  const size = "lg";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const contactData = useSelector((state) => state?.contactCustomFiled?.data);

  const [propertyData, setPropertyData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [
    permission,
    callAccess,
    emailAccess,
    taskAccess,
    meetingAccess,
    quotesAccess,
    invoicesAccess,
    accountAccess,
  ] = HasAccess([
    "Contacts",
    "Calls",
    "Emails",
    "Tasks",
    "Meetings",
    "Quotes",
    "Invoices",
    "Account",
  ]);

  const columnDeps = { navigate, textColor, user, accountAccess };
  const columnsDataColumns = createColumnsDataColumns(columnDeps);
  const callColumns = createCallColumns(columnDeps);
  const MeetingColumns = createMeetingColumns(columnDeps);
  const quotesColumns = createQuotesColumns(columnDeps);
  const invoicesColumns = createInvoicesColumns(columnDeps);
  const taskColumns = createTaskColumns(columnDeps);

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchPropertyCustomFiled());
    setPropertyData(result?.payload?.data);

    const tempTableColumns = [
      { Header: "#", accessor: "_id", isSortable: false, width: 10 },
      ...(result?.payload?.data?.[0]?.fields || [])
        .filter((field) => field?.isTableField === true)
        .map((field) => ({ Header: field?.label, accessor: field?.name })),
    ];

    setColumns(tempTableColumns);
    setIsLoding(false);
  };

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  const generatePDF = () => {
    const element = document.getElementById("reports");
    if (element) {
      element.style.display = "block";
      element.style.width = "100%";
      element.style.height = "auto";
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `Contact_Details_${moment().format("DD-MM-YYYY")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          element.style.display = "";
        });
    }
  };

  const download = async (data) => {
    if (data) {
      let result = await getApi(`api/document/download/`, data);
      if (result && result?.status === 200) {
        window?.open(`${constant?.baseUrl}api/document/download/${data}`);
        toast.success("file Download successful");
      } else if (result && result?.response?.status === 404) {
        toast.error("file Not Found");
      }
    }
  };

  const fetchData = async (i) => {
    setIsLoding(true);
    let response = await getApi("api/contact/view/", param?.id);
    setData(response?.data?.contact);
    setAllData(response?.data);
    setIsLoding(false);
    setSelectedTab(i);
  };

  const handleDeleteContact = async (id) => {
    try {
      setIsLoding(true);
      let response = await deleteApi("api/contact/delete/", id);
      if (response?.status === 200) {
        setDelete(false);
        setAction((pre) => !pre);
        navigate("/contacts");
      }
    } catch (error) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [action]);

  useEffect(() => {
    fetchCustomDataFields();
  }, []);

  function toCamelCase(text) {
    return text?.replace(/([a-z])([A-Z])/g, "$1 $2");
  }

  useEffect(() => {
    dispatch(fetchContactCustomFiled());
  }, []);

  const firstValue = Object?.values(param)[0];
  const splitValue = firstValue?.split("/");

  return (
    <>
      {isLoding ? (
        <Flex justifyContent={"center"} alignItems={"center"} width="100%">
          <Spinner />
        </Flex>
      ) : (
        <>
          <Heading size="lg" mt={0} m={3}>
            {data?.fullName || ""}
          </Heading>
          <Tabs onChange={handleTabChange} index={selectedTab}>
            <Grid templateColumns="repeat(12, 1fr)" mb={3} gap={1}>
              <GridItem colSpan={{ base: 12, md: 6 }}>
                <TabList
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    border: "none",
                    "& button:focus": { boxShadow: "none" },
                    "& button": {
                      margin: { sm: "0 3px", md: "0 5px" },
                      padding: { sm: "5px", md: "8px" },
                      fontSize: { sm: "12px", md: "16px" },
                      border: "2px solid #8080803d",
                      borderTopLeftRadius: "10px",
                      borderTopRightRadius: "10px",
                      borderBottom: 0,
                    },
                    '& button[aria-selected="true"]': {
                      border: "2px solid brand.200",
                      borderBottom: 0,
                      zIndex: "0",
                    },
                  }}
                >
                  <Tab>Information</Tab>
                  {(emailAccess?.view ||
                    callAccess?.view ||
                    taskAccess?.view ||
                    meetingAccess?.view) && <Tab> Communication</Tab>}
                  <Tab>Document</Tab>
                </TabList>
              </GridItem>
              <GridItem colSpan={{ base: 12, md: 6 }} mt={{ sm: "3px", md: "5px" }}>
                <Flex justifyContent={"right"}>
                  <Menu>
                    {(user?.role === "superAdmin" ||
                      permission?.create ||
                      permission?.update ||
                      permission?.delete) && (
                      <MenuButton
                        size="sm"
                        variant="outline"
                        colorScheme="blackAlpha"
                        va
                        mr={2.5}
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                      >
                        Actions
                      </MenuButton>
                    )}
                    <MenuDivider />
                    <MenuList minWidth={2} zIndex={"99"}>
                      {(user?.role === "superAdmin" || permission?.create) && (
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => onOpen()}
                          color={"blue"}
                          icon={<AddIcon />}
                        >
                          Add
                        </MenuItem>
                      )}
                      {(user?.role === "superAdmin" || permission?.update) && (
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => setEdit(true)}
                          icon={<EditIcon />}
                        >
                          Edit
                        </MenuItem>
                      )}
                      <MenuItem
                        onClick={generatePDF}
                        alignItems={"start"}
                        icon={<FaFilePdf />}
                        display={"flex"}
                        style={{ alignItems: "center" }}
                      >
                        Print as PDF
                      </MenuItem>

                      {(user?.role === "superAdmin" || permission?.delete) && (
                        <>
                          <MenuDivider />
                          <MenuItem
                            alignItems={"start"}
                            onClick={() => setDelete(true)}
                            color={"red"}
                            icon={<DeleteIcon />}
                          >
                            Delete
                          </MenuItem>
                        </>
                      )}
                    </MenuList>
                  </Menu>
                  <Link to="/contacts">
                    <Button leftIcon={<IoIosArrowBack />} size="sm" variant="brand">
                      Back
                    </Button>
                  </Link>
                </Flex>
              </GridItem>
            </Grid>
            <TabPanels>
              <TabPanel pt={4} p={0}>
                <ContactOverviewTab
                  contactData={contactData}
                  data={data}
                  toCamelCase={toCamelCase}
                  fetchData={fetchData}
                  allData={allData}
                  isLoding={isLoding}
                  columns={columns}
                  propertyData={propertyData}
                  setPropertyModel={setPropertyModel}
                />
              </TabPanel>
              <TabPanel pt={4} p={0}>
                <ContactEngagementTab
                  allData={allData}
                  isLoding={isLoding}
                  emailAccess={emailAccess}
                  callAccess={callAccess}
                  taskAccess={taskAccess}
                  meetingAccess={meetingAccess}
                  quotesAccess={quotesAccess}
                  invoicesAccess={invoicesAccess}
                  columnsDataColumns={columnsDataColumns}
                  callColumns={callColumns}
                  taskColumns={taskColumns}
                  MeetingColumns={MeetingColumns}
                  quotesColumns={quotesColumns}
                  invoicesColumns={invoicesColumns}
                  showEmail={showEmail}
                  setShowEmail={setShowEmail}
                  showCall={showCall}
                  setShowCall={setShowCall}
                  showTasks={showTasks}
                  setShowTasks={setShowTasks}
                  showMeetings={showMeetings}
                  setShowMeetings={setShowMeetings}
                  showQuotes={showQuotes}
                  setShowQuotes={setShowQuotes}
                  showInvoices={showInvoices}
                  setShowInvoices={setShowInvoices}
                  setAddEmailHistory={setAddEmailHistory}
                  setAddPhoneCall={setAddPhoneCall}
                  setTaskModel={setTaskModel}
                  setMeeting={setMeeting}
                  setAddQuotes={setAddQuotes}
                  setAddInvoice={setAddInvoice}
                />
              </TabPanel>
              <TabPanel pt={4} p={0}>
                <ContactDocumentsTab
                  allData={allData}
                  download={download}
                  setAddDocument={setAddDocument}
                />
              </TabPanel>

              <TabPanel pt={4} p={0}>
                <ContactSocialTab data={data} />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {(user?.role === "superAdmin" || permission?.update || permission?.delete) && (
            <Card mt={3}>
              <CabinetRecordActions
                showEdit={Boolean(permission?.update)}
                showDelete={Boolean(permission?.delete)}
                onEdit={() => setEdit(true)}
                onDelete={() => setDelete(true)}
              />
            </Card>
          )}
        </>
      )}
      <ContactViewModals
        isOpen={isOpen}
        onClose={onClose}
        size={size}
        contactData={contactData}
        edit={edit}
        setEdit={setEdit}
        setAction={setAction}
        data={data}
        deleteModel={deleteModel}
        setDelete={setDelete}
        handleDeleteContact={handleDeleteContact}
        param={param}
        allData={allData}
        fetchData={fetchData}
        addEmailHistory={addEmailHistory}
        setAddEmailHistory={setAddEmailHistory}
        addDocument={addDocument}
        setAddDocument={setAddDocument}
        addMeeting={addMeeting}
        setMeeting={setMeeting}
        splitValue={splitValue}
        taskModel={taskModel}
        setTaskModel={setTaskModel}
        addPhoneCall={addPhoneCall}
        setAddPhoneCall={setAddPhoneCall}
        addQuotes={addQuotes}
        setAddQuotes={setAddQuotes}
        addInvoice={addInvoice}
        setAddInvoice={setAddInvoice}
        propertyModel={propertyModel}
        setPropertyModel={setPropertyModel}
      />
    </>
  );
};

export default View;
