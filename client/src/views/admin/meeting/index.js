import { useEffect, useState } from "react";
import { DeleteIcon, ViewIcon, SearchIcon } from "@chakra-ui/icons";
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
import { getApi as _getApi, deleteManyApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CommonCheckTable from "../../../components/reactTable/checktable";
import { CiMenuKebab } from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import MeetingAdvanceSearch from "./components/MeetingAdvanceSearch";
import AddMeeting from "./components/Addmeeting";
import CommonDeleteModel from "components/commonDeleteModel";
import { toast } from "react-toastify";
import { fetchMeetingData } from "../../../redux/slices/meetingSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const title = t("modules.meeting.title");
  const navigate = useNavigate();
  const [action, setAction] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedValues, setSelectedValues] = useState([]);
  const [advanceSearch, setAdvanceSearch] = useState(false);
  const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
  const [searchboxOutside, setSearchboxOutside] = useState("");
  const _user = JSON.parse(localStorage.getItem("user"));
  const [deleteMany, setDeleteMany] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [permission] = HasAccess(["Meetings"]);
  const dispatch = useDispatch();

  const actionHeader = {
    Header: t("modules.meeting.actions"),
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Flex justify="center">
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW={"fit-content"}>
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                onClick={() => navigate(`/metting/${row?.values?._id}`)}
                icon={<ViewIcon fontSize={15} />}
              >
                {t("modules.meeting.view")}
              </MenuItem>
            )}
            {permission?.delete && (
              <MenuItem
                py={2.5}
                color={"red"}
                onClick={() => {
                  setDeleteMany(true);
                  setSelectedValues([row?.values?._id]);
                }}
                icon={<DeleteIcon fontSize={15} />}
              >
                {t("modules.meeting.delete")}
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    ),
  };
  const tableColumns = [
    {
      Header: "#",
      accessor: "_id",
      isSortable: false,
      width: 10,
    },
    {
      Header: t?.("fields.agenda") || "Agenda",
      accessor: "agenda",
      cell: (cell) => (
        <Link to={`/metting/${cell?.row?.values?._id}`}>
          {" "}
          <Text
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value || " - "}
          </Text>
        </Link>
      ),
    },
    { Header: t?.("fields.dateTime") || "Date & Time", accessor: "dateTime" },
    { Header: t?.("fields.timeStamp") || "Time Stamp", accessor: "timestamp" },
    { Header: t?.("fields.createBy") || "Create By", accessor: "createdByName" },
    ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
  ];

  const fetchData = async () => {
    setIsLoding(true);
    const result = await dispatch(fetchMeetingData());
    const data = Array.isArray(result?.payload)
      ? result.payload
      : Array.isArray(result?.payload?.data)
        ? result.payload.data
        : [];
    if (fetchMeetingData.rejected.match(result)) {
      toast.error("Failed to fetch data", "error");
      setData([]);
    } else {
      setData(data);
    }
    setIsLoding(false);
  };

  const handleDeleteMeeting = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/meeting/deleteMany", ids);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDeleteMany(false);
        setAction((pre) => !pre);
      }
    } catch (error) {
      // Console statement removed
    } finally {
      setIsLoding(false);
    }
  };

  // const [selectedColumns, setSelectedColumns] = useState([...tableColumns]);
  // const dataColumn = tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header))

  useEffect(() => {
    fetchData();
  }, [action]);

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
        // onClose={onClose}
        onOpen={onOpen}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        setDelete={setDeleteMany}
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
        handleSearchType="MeetingSearch"
      />

      <MeetingAdvanceSearch
        advanceSearch={advanceSearch}
        setAdvanceSearch={setAdvanceSearch}
        setSearchedData={setSearchedData}
        setDisplaySearchData={setDisplaySearchData}
        allData={data ?? []}
        setAction={setAction}
        setGetTagValues={setGetTagValuesOutside}
        setSearchbox={setSearchboxOutside}
      />

      <AddMeeting setAction={setAction} isOpen={isOpen} onClose={onClose} />

      {/* Delete model */}
      <CommonDeleteModel
        isOpen={deleteMany}
        onClose={() => setDeleteMany(false)}
        type="Meetings"
        handleDeleteData={handleDeleteMeeting}
        ids={selectedValues}
      />
    </div>
  );
};

export default Index;
