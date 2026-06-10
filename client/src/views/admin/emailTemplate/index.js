import { useCallback, useEffect, useState } from "react";
import { DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import { Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { deleteManyApi } from "services/api";
import { HasAccess } from "../../../redux/accessUtils";
import CommonCheckTable from "../../../components/reactTable/checktable";
import { CiMenuKebab } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import CommonDeleteModel from "components/commonDeleteModel";
import { fetchEmailTempData } from "../../../redux/slices/emailTempSlice";
import { useCrmLabels } from "hooks/useCrmLabels";

const Index = () => {
  const { t, tr } = useCrmLabels();
  const [action, setAction] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  // const [advanceSearch, setAdvanceSearch] = useState(false);
  const [getTagValuesOutSide, setGetTagValuesOutside] = useState([]);
  const [searchboxOutside, setSearchboxOutside] = useState("");
  const [deleteMany, setDeleteMany] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  const [data, setData] = useState([]);
  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);
  const [permission] = HasAccess(["Email Template"]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEditOpen = (row) => {
    navigate(`/email-template/email-template-addEdit`, {
      state: { type: "edit", id: row?.values?._id },
    });
  };

  const actionHeader = {
    Header: t("modules.emailTemplate.actions") || tr("Action"),
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Flex fontSize="md" fontWeight="900" justifyContent="center">
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW={"fit-content"} transform={"translate(1520px, 173px);"}>
            {permission?.update && (
              <MenuItem
                py={2.5}
                icon={<EditIcon fontSize={15} mb={1} />}
                onClick={() => handleEditOpen(row)}
              >
                {t("modules.emailTemplate.edit") || tr("Edit")}
              </MenuItem>
            )}
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                icon={<ViewIcon fontSize={15} mb={1} />}
                onClick={() => navigate(`/email-template/${row?.values?._id}`)}
              >
                {t("modules.emailTemplate.view") || tr("View")}
              </MenuItem>
            )}
            {permission?.delete && (
              <MenuItem
                py={2.5}
                color={"red"}
                icon={<DeleteIcon fontSize={15} mb={1} />}
                onClick={() => {
                  setDeleteMany(true);
                  setSelectedValues([row?.values?._id]);
                }}
              >
                {t("modules.emailTemplate.delete") || tr("Delete")}
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
      width: 5,
    },
    {
      Header: t?.("fields.templateName"),
      accessor: "templateName",
      cell: (cell) => (
        <div className="selectOpt">
          <Text
            onClick={() => navigate(`/email-template/${cell?.row?.original?._id}`)}
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
              cursor: "pointer",
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.value}
          </Text>
        </div>
      ),
    },
    { Header: t?.("fields.description"), accessor: "description" },
    ...(permission?.update || permission?.delete ? [actionHeader] : []),
  ];

  const fetchData = useCallback(async () => {
    setIsLoding(true);
    try {
      const result = await dispatch(fetchEmailTempData());
      const data = Array.isArray(result?.payload)
        ? result.payload
        : Array.isArray(result?.payload?.data)
          ? result.payload.data
          : [];

      if (data.length > 0) {
        setData(data);
      }
    } catch (error) {
      // Console statement removed
      toast.error(t?.("messages.errorOccurred") || "Error occurred", "error");
    } finally {
      setIsLoding(false);
    }
  }, [dispatch, t]);

  const handleDeleteTask = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/email-temp/deleteMany", ids);
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

  const addBtn = () => {
    navigate(`/email-template/email-template-addEdit`, {
      state: { type: "add" },
    });
  };

  useEffect(() => {
    fetchData();
  }, [action, fetchData]);

  return (
    <div>
      <CommonCheckTable
        title="Email Template"
        isLoding={isLoding}
        columnData={tableColumns ?? []}
        // dataColumn={dataColumn ?? []}
        allData={data ?? []}
        searchDisplay={displaySearchData}
        setSearchDisplay={setDisplaySearchData}
        searchedDataOut={searchedData}
        setSearchedDataOut={setSearchedData}
        tableCustomFields={[]}
        access={permission}
        // selectedColumns={selectedColumns}
        // setSelectedColumns={setSelectedColumns}
        // state={state}
        onOpen={addBtn}
        selectedValues={selectedValues}
        setSelectedValues={setSelectedValues}
        setDelete={setDeleteMany}
        AdvanceSearch={false}
        getTagValuesOutSide={getTagValuesOutSide}
        searchboxOutside={searchboxOutside}
        setGetTagValuesOutside={setGetTagValuesOutside}
        setSearchboxOutside={setSearchboxOutside}
        handleSearchType="template"
      />
      <CommonDeleteModel
        isOpen={deleteMany}
        onClose={() => setDeleteMany(false)}
        type="Email Template"
        handleDeleteData={handleDeleteTask}
        ids={selectedValues}
      />
    </div>
  );
};

export default Index;
