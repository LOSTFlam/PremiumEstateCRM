import React from "react";
import { Text } from "@chakra-ui/react";
import moment from "moment";

export const getQuoteInvoicesColumns = ({ navigate, user, contactAccess, accountAccess }) => [
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
    cell: (cell) =>
      user?.role === "superAdmin" || contactAccess?.view ? (
        <div className="selectOpt">
          <Text
            onClick={() =>
              navigate(
                cell?.row?.original?.contact !== null &&
                  `/contactView/${cell?.row?.original?.contact}`
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
            {cell?.row?.original?.contactName ? cell?.row?.original?.contactName : "-"}
          </Text>
        </div>
      ) : (
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
        <Text>
          {cell?.row?.original?.grandTotal ? `$${cell?.row?.original?.grandTotal}` : "-"}
        </Text>
      </div>
    ),
  },
  {
    Header: "Convert Date&Time",
    accessor: "invoiceConvertDate",
    cell: (cell) => (
      <div className="selectOpt">
        <Text>
          {cell?.row?.original?.invoiceConvertDate
            ? `${moment(cell?.row?.original?.invoiceConvertDate).format("DD-MM-YYYY HH:MM a")}`
            : "-"}
        </Text>
      </div>
    ),
  },
];
