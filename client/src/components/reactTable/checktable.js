import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Flex,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Button,
  HStack,
  Tag,
  TagLabel,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Grid,
  GridItem,
  Checkbox,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  TagCloseButton,
} from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/system";
import { BsColumnsGap } from "react-icons/bs";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import { SearchIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Card from "components/card/Card";
import CountUpComponent from "components/countUpComponent/countUpComponent";
import Pagination from "components/pagination/Pagination";
import Spinner from "components/spinner/Spinner";
import { useUsdRubRate } from "hooks/useUsdRubRate";
import CustomSearchInput from "../search/search";
import AdvanceSearchUsingCustomFields from "../search/advanceSearch";
import DataNotFound from "../notFoundData";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import {
  getSearchData,
  setGetTagValues,
  setSearchValue,
} from "../../redux/slices/advanceSearchSlice";
import { commonUtils } from "utils/utils";
import { useTranslation } from "react-i18next";
import {
  buildDateRangeSummary,
  buildImportLabel,
  translateCrmText,
} from "i18n/crmDictionary";
import { formatPropertyPrice } from "utils/pricing";

const CommonCheckTable = (props) => {
  const {
    isLoding,
    title,
    columnData,
    size,
    // dataColumn,
    setSearchedDataOut,
    state,
    allData,
    ManageGrid,
    deleteMany,
    tableCustomFields,
    access,
    // selectedColumns,
    // setSelectedColumns,
    onOpen,
    setDelete,
    selectedValues,
    setSelectedValues,
    setIsImport,
    checkBox,
    AdvanceSearch,
    searchDisplay,
    setSearchDisplay,
    BackButton,
    searchboxOutside,
    setGetTagValuesOutside,
    setSearchboxOutside,
    selectType,
    customSearch,
    addBtn,
    exportColumn,
  } = props;
  const { dataLength } = props;
  const { handleSearchType } = props;
  const { t, i18n } = useTranslation();
  const { data: rateData } = useUsdRubRate();
  const isRu = i18n.language?.startsWith("ru");
  const textOptions = { t, language: i18n.language };
  const selectedItems = Array.isArray(selectedValues)
    ? selectedValues
    : selectedValues
      ? [selectedValues]
      : [];
  const hasSelectedItems = selectedItems.length > 0;
  const totalRecords = dataLength || allData?.length || 0;

  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

  const [displaySearchData, setDisplaySearchData] = useState(false);
  const [searchedData, setSearchedData] = useState([]);

  const translatedColumnData = useMemo(
    () =>
      (columnData || []).map((column) => ({
        ...column,
        Header: translateCrmText(column?.Header, textOptions),
      })),
    [columnData, t, i18n.language],
  );

  const [columns, setColumns] = useState(translatedColumnData || []);
  const [tempSelectedColumns, setTempSelectedColumns] = useState(columns || []);
  const displayTitle = translateCrmText(title, textOptions);
  const columnConfigByAccessor = useMemo(
    () =>
      Object.fromEntries(
        (columnData || [])
          .filter((column) => column?.accessor)
          .map((column) => [column.accessor, column]),
      ),
    [columnData],
  );

  const searchedDataOut = useSelector(
    (state) => state?.advanceSearchData?.searchResult
  );
  const searchValue = useSelector(
    (state) => state?.advanceSearchData?.searchValue
  );
  const getTagValues = useSelector(
    (state) => state?.advanceSearchData?.getTagValues
  );
  const data = useMemo(
    () =>
      (AdvanceSearch ? searchDisplay : displaySearchData)
        ? AdvanceSearch
          ? searchedDataOut
          : searchedData
        : allData,
    [
      searchDisplay,
      displaySearchData,
      AdvanceSearch,
      searchedDataOut,
      searchedData,
      allData,
    ]
  );
  const visibleRecords = Array.isArray(data) ? data.length : 0;
  const activeFilterCount = Array.isArray(getTagValues) ? getTagValues.length : 0;

  const [manageColumnsModel, setManageColumnsModel] = useState(false);
  const [csvColumns, setCsvColumns] = useState([]);
  const [searchbox, setSearchbox] = useState("");
  const [advaceSearch, setAdvaceSearch] = useState(false);
  // const [column, setColumn] = useState('');
  const [gopageValue, setGopageValue] = useState();

  const dispatch = useDispatch();

  const tableInstance = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  if (
    pageOptions &&
    pageOptions?.length > 0 &&
    pageOptions?.length < gopageValue
  ) {
    setGopageValue(pageOptions?.length);
  }

  const handleSearch = (results) => {
    AdvanceSearch &&
      dispatch(
        getSearchData({ searchData: results || [], type: handleSearchType })
      );
    AdvanceSearch
      ? setSearchedDataOut(results || [])
      : setSearchedData(results || []);
  };

  const handleAdvanceSearch = (values) => {
    dispatch(setSearchValue(values));
    const searchResult = AdvanceSearch
      ? dispatch(
          getSearchData({ values: values, allData: allData, type: title })
        )
      : allData?.filter((item) => {
          return tableCustomFields?.every((field) => {
            const fieldValue = values[field?.name];
            const itemValue = item[field?.name];

            if (field?.type === "select") {
              return !fieldValue || itemValue === fieldValue;
            } else if (field?.type === "number") {
              return (
                [null, undefined, ""]?.includes(fieldValue) ||
                (itemValue !== undefined &&
                  itemValue.toString()?.includes(fieldValue?.toString()))
              );
            } else if (field?.type === "date") {
              const fromDate = values[`from${field?.name}`];
              const toDate = values[`to${field?.name}`];

              if (!fromDate && !toDate) {
                return true; // No date range specified
              }

              const timeItemDate = new Date(itemValue);
              const timeMomentDate = moment(timeItemDate)?.format("YYYY-MM-DD");

              return (
                (!fromDate || timeMomentDate >= fromDate) &&
                (!toDate || timeMomentDate <= toDate)
              );
            } else {
              // Default case for text, email
              return (
                !fieldValue ||
                itemValue?.toLowerCase()?.includes(fieldValue?.toLowerCase())
              );
            }
          });
        });

    const getValue = tableCustomFields?.reduce((result, field) => {
      if (field?.type === "date") {
        const fromDate = values[`from${field?.name}`];
        const toDate = values[`to${field?.name}`];

        if (fromDate || toDate) {
          result?.push({
            name: [`from${field?.name}`, `to${field?.name}`],
            value: buildDateRangeSummary({
              from: fromDate,
              to: toDate,
              language: i18n.language,
            }),
          });
        }
      } else if (values[field?.name]) {
        result?.push({
          name: [field?.name],
          value: values[field?.name],
        });
      }

      return result;
    }, []);
    dispatch(setGetTagValues(getValue));
    setSearchedData(searchResult);
    setDisplaySearchData(true);
    setAdvaceSearch(false);
    if (setSearchbox) {
      setSearchbox("");
    }
  };

  const handleClear = () => {
    setSearchDisplay && setSearchDisplay(false);
    setDisplaySearchData && setDisplaySearchData(false);
    if (searchboxOutside) {
      setSearchboxOutside("");
    } else {
      setSearchbox("");
    }
    dispatch(setGetTagValues([]));
    if (props?.getTagValuesOutSide) {
      setGetTagValuesOutside([]);
    }
    setGopageValue(1);
  };

  const handleClick = () => {
    onOpen();
  };

  const findStatus = () => {
    const searchResult = allData?.filter(
      (item) =>
        !state ||
        (item?.status &&
          item?.status?.toLowerCase()?.includes(state?.toLowerCase()))
    );
    let getValue = [state || undefined]?.filter((value) => value);

    dispatch(setGetTagValues(getValue));
    AdvanceSearch
      ? setSearchedDataOut && setSearchedDataOut(searchResult)
      : setSearchedData && setSearchedData(searchResult);
    AdvanceSearch
      ? setSearchDisplay && setSearchDisplay(true)
      : setDisplaySearchData && setDisplaySearchData(searchResult);
    setDisplaySearchData(true);
    setAdvaceSearch(false);
  };

  useEffect(() => {
    state && findStatus();
  }, [state, allData]);

  const toggleColumnVisibility = (columnKey) => {
    let updatedColumns;

    if (tempSelectedColumns?.some((column) => column?.accessor === columnKey)) {
      updatedColumns = tempSelectedColumns?.filter(
        (column) => column?.accessor !== columnKey
      );
    } else {
      const columnToAdd = columnData?.find(
        (column) => column?.accessor === columnKey
      );
      updatedColumns = [...tempSelectedColumns, columnToAdd];
    }

    const orderedColumns = columnData?.filter((column) =>
      updatedColumns.some(
        (updatedColumn) => updatedColumn?.accessor === column?.accessor
      )
    );
    setTempSelectedColumns(orderedColumns);
  };

  const handleCheckboxChange = (event, value) => {
    if (selectType === "single") {
      if (event?.target?.checked) {
        setSelectedValues && setSelectedValues(value);
      } else {
        setSelectedValues();
      }
    } else if (event?.target?.checked) {
      setSelectedValues &&
        setSelectedValues((prevSelectedValues) => [
          ...prevSelectedValues,
          value,
        ]);
    } else {
      setSelectedValues &&
        setSelectedValues((prevSelectedValues) =>
          prevSelectedValues?.filter((selectedValue) => selectedValue !== value)
        );
    }
  };

  const handleColumnClose = () => {
    setManageColumnsModel(!manageColumnsModel);
  };

  const handleExportLeads = (extension) => {
    hasSelectedItems
      ? downloadCsvOrExcel(extension, selectedItems)
      : downloadCsvOrExcel(extension);
  };

  const downloadCsvOrExcel = async (extension, selectedIds) => {
    try {
      if (selectedIds && selectedIds?.length > 0) {
        const selectedRecordsWithSpecificFileds = allData
          ?.filter((rec) => selectedIds?.includes(rec?._id))
          ?.map((rec) => {
            const selectedFieldsData = {};
            csvColumns?.forEach((property) => {
              selectedFieldsData[property?.accessor] = rec[property?.accessor];
            });
            return selectedFieldsData;
          });
        commonUtils?.convertJsonToCsvOrExcel({
          jsonArray: selectedRecordsWithSpecificFileds,
          csvColumns: csvColumns,
          fileName: displayTitle || title || "data",
          extension: extension,
        });
      } else {
        const AllRecordsWithSpecificFileds = allData?.map((rec) => {
          const selectedFieldsData = {};
          csvColumns?.forEach((property) => {
            selectedFieldsData[property?.accessor] = rec[property?.accessor];
          });
          return selectedFieldsData;
        });
        commonUtils?.convertJsonToCsvOrExcel({
          jsonArray: AllRecordsWithSpecificFileds,
          csvColumns: csvColumns,
          fileName: displayTitle || title || "data",
          extension: extension,
        });
      }
      if (typeof setSelectedValues === "function") {
        setSelectedValues(selectType === "single" ? undefined : []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFromTag = (name) => {
    const filter = (getTagValues || []).filter((item) => {
      if (Array?.isArray(name?.name)) {
        return name?.name?.toString() !== item.name?.toString();
      }
    });

    let updatedSearchValue = { ...searchValue };
    for (let key in updatedSearchValue) {
      if (updatedSearchValue?.hasOwnProperty(key)) {
        if (name?.name?.includes(key)) {
          delete updatedSearchValue[key];
        }
        if (updatedSearchValue[key] === "") {
          delete updatedSearchValue[key];
        }
      }
    }

    handleAdvanceSearch(updatedSearchValue);

    dispatch(setGetTagValues(filter));
    if (filter?.length === 0) {
      handleClear();
    }
  };

  useEffect(() => {
    AdvanceSearch
      ? setSearchedDataOut && setSearchedDataOut(data)
      : setSearchedData && setSearchedData(data);
  }, []);

  useEffect(() => {
    setColumns(translatedColumnData);
    setTempSelectedColumns(translatedColumnData);
  }, [translatedColumnData]);

  useEffect(() => {
    if (columns) {
      let tempCsvColumns = columns
        ?.filter(
          (col) =>
            col?.Header !== "#" &&
            col?.Header !== translateCrmText("Action", textOptions),
        )
        ?.map((field) => ({
          Header: field?.Header,
          accessor: field?.accessor,
        }));
      setCsvColumns([...tempCsvColumns]);
    }
  }, [columns, t, i18n.language]);

  return (
    <>
      <Card
        direction="column"
        w="100%"
        overflow="hidden"
        px={{ base: 4, md: 5 }}
        py={{ base: 4, md: 5 }}
        className="admin-check-table"
      >
        <Grid
          templateColumns="repeat(12, 1fr)"
          gap={4}
          className="admin-check-table__toolbar"
        >
          <GridItem
            colSpan={{ base: 12, md: 8 }}
            display={"flex"}
            alignItems={"center"}
          >
            <Flex direction="column" alignItems="flex-start" width="100%" gap={4}>
              {title && (
                <Flex direction="column" gap={2}>
                  <Text
                    color="secondaryGray.900"
                    fontSize={{ base: "xl", md: "2xl" }}
                    fontWeight="700"
                    lineHeight="1.15"
                    className="admin-check-table__title"
                  >
                    {displayTitle} (
                    <CountUpComponent
                      key={visibleRecords}
                      targetNumber={totalRecords}
                    />
                    )
                  </Text>
                  <Flex className="admin-check-table__meta">
                    <Tag size="md" className="admin-check-table__summary">
                      <TagLabel>
                        {translateCrmText("Visible", textOptions)}: {visibleRecords}
                      </TagLabel>
                    </Tag>
                    {activeFilterCount > 0 && (
                      <Tag size="md" className="admin-check-table__summary">
                        <TagLabel>
                          {translateCrmText("Filters", textOptions)}: {activeFilterCount}
                        </TagLabel>
                      </Tag>
                    )}
                    {hasSelectedItems && (
                      <Tag size="md" className="admin-check-table__summary">
                        <TagLabel>
                          {translateCrmText("Selected", textOptions)}: {selectedItems.length}
                        </TagLabel>
                      </Tag>
                    )}
                  </Flex>
                </Flex>
              )}
              <Flex
                alignItems="center"
                flexWrap="wrap"
                gap={2}
                className="admin-check-table__filters"
              >
                {customSearch !== false && (
                  <CustomSearchInput
                    setSearchbox={
                      setSearchboxOutside ? setSearchboxOutside : setSearchbox
                    }
                    setDisplaySearchData={
                      setSearchboxOutside
                        ? props?.setSearchDisplay
                        : setDisplaySearchData
                    }
                    searchbox={searchboxOutside ? searchboxOutside : searchbox}
                    allData={allData}
                    dataColumn={columns}
                    onSearch={handleSearch}
                    setGetTagValues={
                      props?.setGetTagValuesOutside
                        ? props?.setGetTagValuesOutside
                        : setGetTagValues
                    }
                    setGopageValue={setGopageValue}
                  />
                )}
                {AdvanceSearch
                  ? AdvanceSearch
                  : AdvanceSearch !== false && (
                      <Button
                        variant="light"
                        leftIcon={<SearchIcon />}
                        mt={{ sm: "5px", md: "0" }}
                        size="sm"
                        onClick={() => setAdvaceSearch(true)}
                      >
                        {translateCrmText("Advance Search", textOptions)}
                      </Button>
                    )}
                {searchDisplay || displaySearchData ? (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="sm"
                    onClick={() => handleClear()}
                  >
                    {t("common.clear")}
                  </Button>
                ) : null}
                {hasSelectedItems && access?.delete && !deleteMany && (
                  <Button
                    variant="outline"
                    colorScheme="red"
                    size="sm"
                    leftIcon={<DeleteIcon />}
                    onClick={() => setDelete(true)}
                  >
                    {translateCrmText("Delete Selected", textOptions)}
                  </Button>
                )}
              </Flex>
            </Flex>
          </GridItem>
          {/* Advance filter */}
          <AdvanceSearchUsingCustomFields
            setAdvaceSearch={setAdvaceSearch}
            setGetTagValues={setGetTagValues}
            isLoding={isLoding}
            allData={allData}
            setDisplaySearchData={setDisplaySearchData}
            setSearchedData={setSearchedData}
            advaceSearch={advaceSearch}
            tableCustomFields={tableCustomFields}
            setSearchbox={setSearchbox}
            handleAdvanceSearch={handleAdvanceSearch}
          />
          <GridItem
            colSpan={{ base: 12, md: 4 }}
            display={"flex"}
            justifyContent={"end"}
            alignItems={"center"}
            textAlign={"right"}
          >
            <Flex
              alignItems="center"
              justifyContent="flex-end"
              gap={2}
              flexWrap="wrap"
              className="admin-check-table__actions"
            >
              {ManageGrid !== false && (
                <Menu isLazy>
                  <MenuButton
                    as={Button}
                    size="sm"
                    variant="light"
                    leftIcon={<BsColumnsGap />}
                  >
                    {translateCrmText("Table Tools", textOptions)}
                  </MenuButton>
                  <MenuList minW="fit-content" zIndex={2}>
                    <MenuItem
                      onClick={() => setManageColumnsModel(true)}
                      width={"185px"}
                    >
                      {translateCrmText("Manage Columns", textOptions)}
                    </MenuItem>
                    {typeof setIsImport === "function" && (
                      <MenuItem width={"185px"} onClick={() => setIsImport(true)}>
                        {buildImportLabel(displayTitle || title, textOptions)}
                      </MenuItem>
                    )}
                    {exportColumn !== false && allData && allData?.length > 0 && (
                      <>
                        <MenuDivider />
                        <MenuItem
                          width={"185px"}
                          onClick={() => handleExportLeads("csv")}
                        >
                          {hasSelectedItems
                            ? (isRu
                                ? "Экспорт выбранных данных в CSV"
                                : "Export selected data as CSV")
                            : (isRu ? "Экспорт в CSV" : "Export as CSV")}
                        </MenuItem>
                        <MenuItem
                          width={"185px"}
                          onClick={() => handleExportLeads("xlsx")}
                        >
                          {hasSelectedItems
                            ? (isRu
                                ? "Экспорт выбранных данных в Excel"
                                : "Export selected data as Excel")
                            : (isRu ? "Экспорт в Excel" : "Export as Excel")}
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
              )}
              {addBtn !== false && (access?.create || access === true) && (
                <Button
                  onClick={() => handleClick()}
                  size="sm"
                  variant="brand"
                  leftIcon={<AddIcon />}
                >
                  {t("common.addNew")}
                </Button>
              )}
              {BackButton && BackButton}
            </Flex>
          </GridItem>
          <HStack spacing={3} mb={2} className="admin-check-table__chips">
            {(getTagValues || [])?.map((item) => (
              <Tag
                size={"md"}
                p={2}
                key={item?.value}
                borderRadius="full"
                variant="subtle"
                colorScheme="blue"
              >
                <TagLabel>{item?.value}</TagLabel>
                <TagCloseButton onClick={() => handleRemoveFromTag(item)} />
              </Tag>
            ))}
          </HStack>
        </Grid>
        <Box
          overflowY={"auto"}
          className={`admin-check-table__scroll ${
            size ? "small-table-fix-container" : "table-fix-container"
          }`}
        >
          <Table
            {...getTableProps()}
            variant="simple"
            color="gray.500"
            mb="24px"
            className="admin-check-table__table"
          >
            <Thead zIndex={1}>
              {headerGroups?.map((headerGroup, index) => (
                <Tr {...headerGroup?.getHeaderGroupProps()} key={index}>
                  {headerGroup?.headers?.map((column, index) => (
                    <Th
                      {...column?.getHeaderProps(
                        column?.isSortable !== false &&
                          column?.getSortByToggleProps()
                      )}
                      pe="10px"
                      key={index}
                      borderColor={borderColor}
                      bg="rgba(248, 250, 252, 0.94)"
                      position="sticky"
                      top={0}
                      zIndex={1}
                      py={4}
                    >
                      <Flex
                        align="center"
                        justifyContent={column?.center ? "center" : "start"}
                        fontSize={{ base: "11px", md: "12px" }}
                        color="secondaryGray.700"
                        textTransform="uppercase"
                        letterSpacing="0.08em"
                        fontWeight="700"
                      >
                        <span
                          style={{
                            marginRight: "8px",
                          }}
                        >
                          {column?.render("Header")}
                        </span>
                        {column?.isSortable !== false && (
                          <span>
                            {column?.isSorted ? (
                              column?.isSortedDesc ? (
                                <FaSortDown />
                              ) : (
                                <FaSortUp />
                              )
                            ) : (
                              <FaSort />
                            )}
                          </span>
                        )}
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {isLoding ? (
                <Tr>
                  <Td colSpan={columns?.length}>
                    <Flex
                      justifyContent={"center"}
                      alignItems={"center"}
                      width="100%"
                      color={textColor}
                      fontSize="sm"
                      fontWeight="700"
                    >
                      <Spinner />
                    </Flex>
                  </Td>
                </Tr>
              ) : (data && data?.length === 0) || data === undefined ? (
                <Tr>
                  <Td colSpan={columns?.length}>
                    <DataNotFound />
                  </Td>
                </Tr>
              ) : (
                page?.map((row, i) => {
                  prepareRow(row);
                  return (
                    <Tr
                      {...row?.getRowProps()}
                      key={row.id}
                      bg={i % 2 === 0 ? "rgba(255, 255, 255, 0.92)" : "rgba(248, 250, 252, 0.72)"}
                      _hover={{ bg: "rgba(10, 132, 255, 0.06)" }}
                      className="admin-check-table__row"
                    >
                      {row?.cells?.map((cell, index) => {
                        let data = "";
                        const item =
                          columnConfigByAccessor[cell?.column?.accessor] ||
                          columnData?.find(
                            (column) =>
                              translateCrmText(column?.Header, textOptions) ===
                              cell?.column?.Header,
                          );

                        if (item?.cell && typeof item?.cell === "function") {
                          data = (
                            <Flex
                              align="center"
                              justifyContent={item?.accessor === "action" && "center"}
                            >
                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="600"
                              >
                                {item?.cell(cell) === " " ? "-" : item?.cell(cell)}
                              </Text>
                            </Flex>
                          );
                        } else {
                          const displayValue =
                            item?.accessor === "listingPrice"
                              ? formatPropertyPrice(cell?.row?.original, {
                                  language: i18n.language,
                                  t,
                                  rateData,
                                })
                              : item?.accessor === "listingPriceRub"
                                ? formatPropertyPrice(cell?.row?.original, {
                                    language: i18n.language,
                                    t,
                                    rateData,
                                    preferredCurrency: "RUB",
                                  })
                                : cell?.value;

                          data = (
                            <Flex align="center">
                              {item?.Header === "#" &&
                                (checkBox || checkBox === undefined) && (
                                  <Checkbox
                                    colorScheme="brandScheme"
                                    value={selectedValues}
                                    isChecked={selectedItems.includes(cell?.value)}
                                    onChange={(event) =>
                                      handleCheckboxChange(event, cell?.value)
                                    }
                                    me="10px"
                                  />
                                )}

                              <Text
                                color={textColor}
                                fontSize="sm"
                                fontWeight="600"
                              >
                                {item?.Header === "#"
                                  ? cell?.row?.index + 1
                                  : displayValue
                                    ? displayValue
                                    : "-"}
                              </Text>
                            </Flex>
                          );
                        }
                        return (
                          <Td
                            {...cell?.getCellProps()}
                            key={index}
                            fontSize={{ sm: "14px" }}
                            minW={{ sm: "150px", md: "200px", lg: "auto" }}
                            borderColor="rgba(226, 232, 240, 0.72)"
                            py={4}
                            px={4}
                          >
                            {data}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })
              )}
            </Tbody>
          </Table>
        </Box>
        {data?.length > 5 && (
          <Pagination
            gotoPage={gotoPage}
            gopageValue={gopageValue}
            setGopageValue={setGopageValue}
            pageCount={pageCount}
            canPreviousPage={canPreviousPage}
            previousPage={previousPage}
            canNextPage={canNextPage}
            pageOptions={pageOptions}
            setPageSize={setPageSize}
            nextPage={nextPage}
            pageSize={pageSize}
            pageIndex={pageIndex}
            dataLength={15}
          />
        )}

        {/* Manage Columns */}
        <Modal
          onClose={() => {
            setManageColumnsModel(false);
          }}
          isOpen={manageColumnsModel}
          isCentered
        >
          <ModalOverlay />
          <ModalContent className="admin-density-shell">
            <ModalHeader className="admin-density-shell__header">
              {translateCrmText("Manage Columns", textOptions)}
            </ModalHeader>
            <ModalCloseButton
              onClick={() => {
                setManageColumnsModel(false);
              }}
            />
            <ModalBody className="admin-density-shell__body">
              <div>
                {columnData?.map((column) => (
                  <Text display={"flex"} key={column?.accessor} py={2}>
                    <Checkbox
                      defaultChecked={columns?.some(
                        (item) => item?.accessor === column?.accessor
                      )}
                      onChange={() => toggleColumnVisibility(column?.accessor)}
                      pe={2}
                    />
                    {translateCrmText(column?.Header, textOptions)}
                  </Text>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="admin-density-shell__footer">
              <Button
                variant="brand"
                mr={2}
                onClick={() => {
                  setColumns([...tempSelectedColumns]);
                  setManageColumnsModel(false);
                }}
                disabled={isLoding ? true : false}
                size="sm"
              >
                {isLoding ? <Spinner /> : t("common.save")}
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                size="sm"
                onClick={() => handleColumnClose()}
              >
                {t("common.close")}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Card>
    </>
  );
};

export default CommonCheckTable;
