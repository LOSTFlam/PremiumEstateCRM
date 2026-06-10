import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { HasAccess } from "../../../redux/accessUtils";
import CommonCheckTable from "../../../components/reactTable/checktable";
import { CiMenuKebab } from "react-icons/ci";
import EmailAdvanceSearch from "./components/EmailAdvanceSearch";
import moment from "moment";
import { MdLeaderboard } from "react-icons/md";
import { IoIosContact } from "react-icons/io";
import AddEmailHistory from "./add";
import { useDispatch } from "react-redux";
import { fetchEmailsData } from "../../../redux/slices/emailsSlice";
import { toast } from "react-toastify";
import { useCrmLabels } from "hooks/useCrmLabels";

const Index = (_props) => {
  const { t, tr } = useCrmLabels();
  const title = tr("Email");
  const [action, setAction] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [_selectedId, setDelete] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
  const [searchboxOutside, setSearchboxOutside] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [permission, leadAccess, contactAccess] = HasAccess(["Emails", "Leads", "Contacts"]);
  const actionHeader = {
    Header: tr("Action"),
    accessor: "action",
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Flex justify="center">
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW={"fit-content"} transform={"translate(1520px, 173px);"}>
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                onClick={() => navigate(`/Email/${row?.values?._id}`)}
                icon={<ViewIcon mb={"2px"} fontSize={15} />}
              >
                {tr("View")}
              </MenuItem>
            )}
            {row?.original?.createByContact && contactAccess?.view ? (
              <MenuItem
                width={"165px"}
                py={2.5}
                color={"black"}
                onClick={() =>
                  navigate(
                    row?.original?.createByContact &&
                      `/contactView/${row?.original.createByContact}`
                  )
                }
                icon={row?.original?.createByContact && <IoIosContact fontSize={15} />}
              >
                {" "}
                {row?.original?.createByContact && contactAccess?.view && tr("contact")}
              </MenuItem>
            ) : (
              ""
            )}
            {row?.original?.createByLead && leadAccess?.view ? (
              <MenuItem
                width={"165px"}
                py={2.5}
                color={"black"}
                onClick={() => navigate(`/leadView/${row?.original.createByLead}`)}
                icon={
                  row?.original?.createByLead &&
                  leadAccess?.view && (
                    <MdLeaderboard style={{ marginBottom: "4px" }} fontSize={15} />
                  )
                }
              >
                {row?.original?.createByLead && leadAccess?.view && tr("lead")}
              </MenuItem>
            ) : (
              ""
            )}
          </MenuList>
        </Menu>
      </Flex>
    ),
  };
  const tableColumns = [
    { Header: "#", accessor: "_id", isSortable: false, width: 10 },
    {
      Header: t?.("fields.recipient") || "Recipient",
      accessor: "createByName",
      cell: (cell) => (
        <Link to={`/Email/${cell?.row?.values?._id}`}>
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || "-"}
          </Text>
        </Link>
      ),
    },
    { Header: t?.("fields.senderName") || "Sender Name", accessor: "senderName" },
    {
      Header: t?.("fields.realtedTo") || "Related To",
      accessor: "realeted",
      cell: ({ row }) => (
        <Flex direction="column" align="start">
          {row?.original?.createByContact && contactAccess?.view ? (
            <Link to={`/contactView/${row?.original?.createByContact}`}>
              <Text
                me="10px"
                sx={{
                  "&:hover": { color: "blue.500", textDecoration: "underline" },
                }}
                color={"brand.600"}
                fontSize="sm"
                fontWeight="700"
              >
                {row?.original?.createByContact && "Contact"}
              </Text>
            </Link>
          ) : (
            <Text me="10px" fontSize="sm" fontWeight="700">
              {row?.original?.createByContact && "Contact"}
            </Text>
          )}

          {leadAccess?.view && row?.original?.createByLead ? (
            <Link to={`/leadView/${row?.original?.createByLead}`}>
              <Text
                me="10px"
                sx={{
                  "&:hover": { color: "blue.500", textDecoration: "underline" },
                }}
                color={"brand.600"}
                fontSize="sm"
                fontWeight="700"
              >
                {row?.original?.createByLead && "Lead"}
              </Text>
            </Link>
          ) : (
            <Text me="10px" fontSize="sm" fontWeight="700">
              {row?.original?.createByLead && "Lead"}
            </Text>
          )}
        </Flex>
      ),
    },
    { Header: t?.("fields.timestamp") || "Timestamp", accessor: "timestamp" },
    {
      Header: t?.("fields.created") || "Created",
      accessor: "created",
      cell: ({ row }) => (
        <Text fontSize="sm" fontWeight="700">
          {moment(row?.values?.timestamp).format("(DD/MM) h:mma")}
        </Text>
      ),
    },
    ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
  ];

  useEffect(() => {
    let isActive = true;

    const loadEmails = async () => {
      setIsLoding(true);

      try {
        const result = await dispatch(fetchEmailsData());
        const response = (
          Array.isArray(result?.payload)
            ? result.payload
            : Array.isArray(result?.payload?.data)
              ? result.payload.data
              : []
        ).map((item) => ({
          ...item,
          realeted: item?.createByLead
            ? "Lead"
            : item?.createByContact || item?.createBy
              ? "Contact"
              : item?.realeted,
        }));

        if (isActive) {
          setData(response);
        }
      } catch (error) {
        // Console statement removed
        if (isActive) {
          toast.error(t?.("messages.errorOccurred") || "Error occurred", "error");
        }
      } finally {
        if (isActive) {
          setIsLoding(false);
        }
      }
    };

    loadEmails();

    return () => {
      isActive = false;
    };
  }, [action, dispatch, t]);

  return (
    <div>
      <CommonCheckTable
        title={title}
        isLoding={isLoding}
        columnData={tableColumns ?? []}
        // dataColumn={dataColumn ?? []}
        allData={data ?? []}
        tableData={data}
        searchDisplay={displaySearchData}
        setSearchDisplay={setDisplaySearchData}
        searchedDataOut={searchedData}
        setSearchedDataOut={setSearchedData}
        tableCustomFields={[]}
        access={permission}
        // action={action}
        // setAction={setAction}
        // selectedColumns={selectedColumns}
        // setSelectedColumns={setSelectedColumns}
        // isOpen={isOpen}
        // onClose={onclose}
        onOpen={onOpen}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        setDelete={setDelete}
        deleteMany={true}
        AdvanceSearch={
          <Button
            variant="outline"
            colorScheme="brand"
            leftIcon={<SearchIcon />}
            mt={{ sm: "5px", md: "0" }}
            size="sm"
            onClick={() => setAdvanceSearch(true)}
          >
            Advance Search
          </Button>
        }
        getTagValuesOutSide={getTagValuesOutSide}
        searchboxOutside={searchboxOutside}
        setGetTagValuesOutside={setGetTagValuesOutside}
        setSearchboxOutside={setSearchboxOutside}
        handleSearchType="EmailSearch"
      />

      <EmailAdvanceSearch
        advanceSearch={advanceSearch}
        setAdvanceSearch={setAdvanceSearch}
        setSearchedData={setSearchedData}
        setDisplaySearchData={setDisplaySearchData}
        allData={data ?? []}
        setAction={setAction}
        setGetTagValues={setGetTagValuesOutside}
        setSearchbox={setSearchboxOutside}
      />

      <AddEmailHistory isOpen={isOpen} size={"sm"} onClose={onClose} setAction={setAction} />
    </div>
  );
};

export default Index;
