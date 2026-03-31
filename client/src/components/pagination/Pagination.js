import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { translateCrmText } from "i18n/crmDictionary";

const Pagination = (props) => {
  const {
    gotoPage,
    gopageValue,
    setGopageValue,
    pageCount,
    canPreviousPage,
    previousPage,
    canNextPage,
    pageOptions,
    setPageSize,
    nextPage,
    pageSize,
    pageIndex,
  } = props;
  const { t, i18n } = useTranslation();
  const textOptions = { t, language: i18n.language };

  useEffect(() => {
    setGopageValue(1);
  }, [setGopageValue]);

  return (
    <Flex
      justifyContent={pageOptions?.length !== 1 ? "space-between" : "end"}
      mt={2}
      alignItems="center"
      gap={4}
      flexWrap="wrap"
      className="admin-pagination"
    >
      {pageOptions?.length !== 1 && (
        <Flex gap={2}>
          <Tooltip label={translateCrmText("First Page", textOptions)}>
            <IconButton
              aria-label={translateCrmText("First Page", textOptions)}
              onClick={() => {
                gotoPage(0);
                setGopageValue(1);
              }}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
              variant="light"
              size="sm"
            />
          </Tooltip>
          <Tooltip label={translateCrmText("Previous Page", textOptions)}>
            <IconButton
              aria-label={translateCrmText("Previous Page", textOptions)}
              onClick={() => {
                previousPage();
                setGopageValue((pre) => pre - 1);
              }}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
              variant="light"
              size="sm"
            />
          </Tooltip>
        </Flex>
      )}

      <Flex alignItems="center" gap={3} flexWrap="wrap">
        {pageOptions?.length !== 1 && (
          <>
            <Text flexShrink="0" color="secondaryGray.700" fontWeight="600">
              {translateCrmText("Page", textOptions)}{" "}
              <Text fontWeight="bold" as="span">
                {pageIndex + 1}
              </Text>{" "}
              {isNaN(pageOptions?.length) ? "" : " / "}
              <Text fontWeight="bold" as="span">
                {pageOptions?.length}
              </Text>
            </Text>
            <Text flexShrink="0" color="secondaryGray.700" fontWeight="600">
              {translateCrmText("Go to page", textOptions)}:
            </Text>
            <NumberInput
              w={28}
              min={1}
              max={pageOptions?.length}
              value={gopageValue}
              onChange={(value) => {
                const page = value ? value - 1 : 0;
                gotoPage(page);
                setGopageValue(value);
              }}
              defaultValue={pageIndex + 1}
              variant="main"
              size="sm"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </>
        )}
        <Select
          w={32}
          value={pageSize}
          variant="main"
          size="sm"
          onChange={(e) => {
            setPageSize(Number(e?.target?.value));
          }}
        >
          {[5, 10, 20, 30, 40, 50]?.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {translateCrmText("Show", textOptions)} {pageSize}
            </option>
          ))}
        </Select>
      </Flex>

      {pageOptions?.length !== 1 && (
        <Flex gap={2}>
          <Tooltip label={translateCrmText("Next Page", textOptions)}>
            <IconButton
              aria-label={translateCrmText("Next Page", textOptions)}
              onClick={() => {
                nextPage();
                setGopageValue((pre) => pre + 1);
              }}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
              variant="light"
              size="sm"
            />
          </Tooltip>
          <Tooltip label={translateCrmText("Last Page", textOptions)}>
            <IconButton
              aria-label={translateCrmText("Last Page", textOptions)}
              onClick={() => {
                gotoPage(pageCount - 1);
                setGopageValue(pageCount);
              }}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
              variant="light"
              size="sm"
            />
          </Tooltip>
        </Flex>
      )}
    </Flex>
  );
};

export default Pagination;
