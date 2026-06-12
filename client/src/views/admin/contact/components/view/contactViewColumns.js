import { Text } from "@chakra-ui/react";
import moment from "moment";
import { Link } from "react-router-dom";

export const createColumnsDataColumns = ({ textColor }) => [
  { Header: "sender", accessor: "senderName" },
  {
    Header: "recipient",
    accessor: "createByName",
    cell: (cell) => (
      <Link to={`/Email/${cell?.row?.original?._id}`}>
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
  {
    Header: "time stamp",
    accessor: "timestamp",
    cell: (cell) => (
      <div className="selectOpt">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(cell?.value)?.fromNow()}
        </Text>
      </div>
    ),
  },
  {
    Header: "Created",
    accessor: "createBy",
    cell: (cell) => (
      <div className="selectOpt">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(cell?.row?.values?.timestamp)?.format("h:mma (DD/MM)")}
        </Text>
      </div>
    ),
  },
];

export const createCallColumns = ({ textColor }) => [
  { Header: "sender", accessor: "senderName" },
  {
    Header: "recipient",
    accessor: "createByName",
    cell: (cell) => (
      <Link to={`/phone-call/${cell?.row?.original?._id}`}>
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
  {
    Header: "time stamp",
    accessor: "timestamp",
    cell: (cell) => (
      <div className="selectOpt">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(cell?.value)?.fromNow()}
        </Text>
      </div>
    ),
  },
  {
    Header: "Created",
    accessor: "createBy",
    cell: (cell) => (
      <div className="selectOpt">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(cell?.row?.values?.timestamp)?.format("h:mma (DD/MM)")}
        </Text>
      </div>
    ),
  },
];

export const createMeetingColumns = ({ textColor }) => [
  {
    Header: "agenda",
    accessor: "agenda",
    cell: (cell) => (
      <Link to={`/metting/${cell?.row?.original?._id}`}>
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
  { Header: "date Time", accessor: "dateTime" },
  {
    Header: "times tamp",
    accessor: "timestamp",
    cell: (cell) => (
      <div className="selectOpt">
        <Text color={textColor} fontSize="sm" fontWeight="700">
          {moment(cell?.value)?.fromNow()}
        </Text>
      </div>
    ),
  },
  { Header: "create By", accessor: "createdByName" },
];

export const createQuotesColumns = ({ navigate, user, accountAccess }) => [
  {
    Header: "Quote Number",
    accessor: "quoteNumber",
    isSortable: false,
    width: 10,
  },
  {
    Header: "Title",
    accessor: "title",
    cell: (cell) => (
      <div className="selectOpt">
        <Text
          onClick={() => navigate(`/quotesView/${cell?.row?.original._id}`)}
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
  { Header: "Quote Stage", accessor: "quoteStage" },
  {
    Header: "Contact",
    accessor: "contact",
    cell: (cell) => (
      <Text>{cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}</Text>
    ),
  },
  {
    Header: "Account",
    accessor: "account",
    cell: (cell) =>
      user?.role === "superAdmin" || accountAccess?.view ? (
        <div className="selectOpt">
          <Text
            onClick={() =>
              navigate(
                cell?.row?.original?.account !== null &&
                  `/accountView/${cell?.row?.original?.account}`
              )
            }
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
              cursor: "pointer",
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
          </Text>
        </div>
      ) : (
        <Text>{cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}</Text>
      ),
  },
  {
    Header: "Grand Total",
    accessor: "grandTotal",
    cell: (cell) => (
      <div className="selectOpt">
        <Text>{cell?.row?.original?.grandTotal ? `$${cell?.row?.original?.grandTotal}` : "-"}</Text>
      </div>
    ),
  },
  { Header: "valid Until", accessor: "validUntil" },
];

export const createInvoicesColumns = ({ navigate, user, accountAccess }) => [
  {
    Header: "Invoice Number",
    accessor: "invoiceNumber",
    isSortable: false,
    width: 10,
  },
  {
    Header: "Title",
    accessor: "title",
    cell: (cell) => (
      <div className="selectOpt">
        <Text
          onClick={() => navigate(`/invoicesView/${cell?.row?.original?._id}`)}
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
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Contact",
    accessor: "contact",
    cell: (cell) => (
      <Text>{cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}</Text>
    ),
  },
  {
    Header: "Account",
    accessor: "account",
    cell: (cell) =>
      user?.role === "superAdmin" || accountAccess?.view ? (
        <div className="selectOpt">
          <Text
            onClick={() =>
              navigate(
                cell?.row?.original?.account !== null &&
                  `/accountView/${cell?.row?.original?.account}`
              )
            }
            me="10px"
            sx={{
              "&:hover": { color: "blue.500", textDecoration: "underline" },
              cursor: "pointer",
            }}
            color="brand.600"
            fontSize="sm"
            fontWeight="700"
          >
            {cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}
          </Text>
        </div>
      ) : (
        <Text>{cell?.row?.original?.accountName ? cell?.row?.original?.accountName : "-"}</Text>
      ),
  },
  {
    Header: "Grand Total",
    accessor: "grandTotal",
    cell: (cell) => (
      <div className="selectOpt">
        <Text>{cell?.row?.original?.grandTotal ? `$${cell?.row?.original?.grandTotal}` : "-"}</Text>
      </div>
    ),
  },
];

export const createTaskColumns = () => [
  {
    Header: "Title",
    accessor: "title",
    cell: (cell) => (
      <Link to={`/view/${cell?.row?.original?._id}`}>
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
  { Header: "Category", accessor: "category" },
  { Header: "Assign To", accessor: "assignToName" },
  { Header: "Start Date", accessor: "start" },
  { Header: "End Date", accessor: "end" },
];
