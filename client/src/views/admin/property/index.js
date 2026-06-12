import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HasAccess } from "../../../redux/accessUtils";
import {
  Flex,
  Grid,
  GridItem,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, ViewIcon, EditIcon } from "@chakra-ui/icons";
import { CiMenuKebab } from "react-icons/ci";
import CommonCheckTable from "../../../components/reactTable/checktable";
import Add from "./Add";
import Edit from "./Edit";
import ImportModal from "./components/ImportModal";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteManyApi } from "services/api";
import { fetchPropertyCustomFiled } from "../../../redux/slices/propertyCustomFiledSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyData } from "../../../redux/slices/propertySlice";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();

  // Safe translation function
  const safeT = (key, fallback) => {
    try {
      return t(key) || fallback;
    } catch (e) {
      return fallback;
    }
  };

  const _user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [permission] = HasAccess(["Properties"]);
  const [isLoding, setIsLoding] = useState(false);
  const [columns, setColumns] = useState([]);
  const [action, setAction] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [propertyData, setPropertyData] = useState([]);
  const [edit, setEdit] = useState(false);
  const [deleteModel, setDelete] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [selectedValues, setSelectedValues] = useState([]);
  const [isImportProperty, setIsImportProperty] = useState(false);

  // Action header for table
  const actionHeader = {
    Header: safeT("modules.property.actions.action", safeT("common.actions", "Actions")),
    accessor: "action",
    isSortable: false,
    center: true,
    cell: ({ row }) => (
      <Flex fontSize="md" fontWeight="900" justifyContent="center">
        <Menu isLazy>
          <MenuButton>
            <CiMenuKebab />
          </MenuButton>
          <MenuList minW={"fit-content"}>
            {permission?.update && (
              <MenuItem
                py={2.5}
                icon={<EditIcon fontSize={15} mb={1} />}
                onClick={() => {
                  setEdit(true);
                  setSelectedId(row?.values?._id);
                }}
              >
                {safeT("modules.property.actions.edit", "Edit")}
              </MenuItem>
            )}
            {permission?.view && (
              <MenuItem
                py={2.5}
                color={"green"}
                icon={<ViewIcon mb={1} fontSize={15} />}
                onClick={() => {
                  const slug = row?.values?.publicSlug || row?.values?._id;
                  navigate(`/propertyView/${slug}`);
                }}
              >
                {safeT("modules.property.actions.view", "View")}
              </MenuItem>
            )}
            {permission?.delete && (
              <MenuItem
                py={2.5}
                color={"red"}
                icon={<DeleteIcon fontSize={15} mb={1} />}
                onClick={() => {
                  setDelete(true);
                  setSelectedValues([row?.values?._id]);
                  setSelectedId(row?.values?._id);
                }}
              >
                {safeT("modules.property.actions.delete", "Delete")}
              </MenuItem>
            )}
          </MenuList>
        </Menu>
      </Flex>
    ),
  };

  const data = useSelector((state) => state?.propertyData?.data);

  const fetchCustomDataFields = async () => {
    setIsLoding(true);
    try {
      const result = await dispatch(fetchPropertyCustomFiled());
      // fetchPropertyCustomFiled returns array directly
      const customFieldsData = Array.isArray(result?.payload)
        ? result.payload
        : Array.isArray(result?.payload?.data)
          ? result.payload.data
          : [];

      if (customFieldsData.length > 0) {
        setPropertyData(customFieldsData);

        // Build table columns from custom fields
        const tempTableColumns = [
          { Header: "#", accessor: "_id", isSortable: false, width: 10 },
          ...(customFieldsData[0]?.fields
            ?.filter((field) => field?.isTableField === true && field?.isView)
            ?.map((field) => ({
              Header: safeT(`fields.${field?.name}`, field?.label),
              accessor: field?.name,
              cell: (cell) => (
                <div className="selectOpt">
                  <Text
                    onClick={() => {
                      const slug = cell?.row?.original?.publicSlug || cell?.row?.original?._id;
                      navigate(`/propertyView/${slug}`);
                    }}
                    me="10px"
                    sx={{
                      "&:hover": {
                        color: "blue.500",
                        textDecoration: "underline",
                      },
                      cursor: "pointer",
                    }}
                    color="brand.600"
                    fontSize="sm"
                    fontWeight="700"
                  >
                    {cell?.value || "-"}
                  </Text>
                </div>
              ),
            })) || []),
          ...(customFieldsData[0]?.fields || [])
            .filter((field) => field?.isTableField === true && !field?.isView)
            .map((field) => ({
              Header: safeT(`fields.${field?.name}`, field?.label),
              accessor: field?.name,
            })),
          ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
        ];

        setColumns(tempTableColumns);
      } else {
        setColumns([
          { Header: "#", accessor: "_id", isSortable: false, width: 10 },
          ...(permission?.update || permission?.view || permission?.delete ? [actionHeader] : []),
        ]);
      }
    } catch (error) {
      toast.error("Failed to fetch data", "error");
    } finally {
      setIsLoding(false);
    }
  };

  const handleDeleteProperties = async (ids) => {
    try {
      setIsLoding(true);
      let response = await deleteManyApi("api/property/deleteMany", ids);
      if (response?.status === 200) {
        setSelectedValues([]);
        setDelete(false);
        setAction((pre) => !pre);
      }
    } catch (error) {
      // Error handling
    } finally {
      setIsLoding(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(fetchPropertyData());
    fetchCustomDataFields();
  }, [action]);

  // useEffect(() => {
  //     setDataColumn(tableColumns?.filter(item => selectedColumns?.find(colum => colum?.Header === item.Header)));
  // }, [tableColumns, selectedColumns])

  return (
    <div>
      <Grid templateColumns="repeat(6, 1fr)" mb={3} gap={4}>
        <GridItem colSpan={6}>
          <CommonCheckTable
            title="Properties"
            isLoding={isLoding}
            columnData={columns ?? []}
            // dataColumn={dataColumn ?? []}
            allData={data ?? []}
            tableData={data}
            tableCustomFields={
              propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) || []
            }
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
            setIsImport={setIsImportProperty}
          />
        </GridItem>
      </Grid>
      {isOpen && (
        <Add
          propertyData={propertyData[0]}
          isOpen={isOpen}
          size={"lg"}
          onClose={onClose}
          setAction={setAction}
        />
      )}
      {edit && (
        <Edit
          isOpen={edit}
          size={"lg"}
          propertyData={propertyData[0]}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          onClose={setEdit}
          setAction={setAction}
        />
      )}
      {deleteModel && (
        <CommonDeleteModel
          isOpen={deleteModel}
          onClose={() => setDelete(false)}
          type="Properties"
          handleDeleteData={handleDeleteProperties}
          ids={selectedValues}
        />
      )}
      {isImportProperty && (
        <ImportModal
          text="Property file"
          isOpen={isImportProperty}
          onClose={setIsImportProperty}
          customFields={propertyData?.[0]?.fields || []}
        />
      )}
    </div>
  );
};

export default Index;
