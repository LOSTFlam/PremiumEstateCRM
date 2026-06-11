import React from "react";
import { GridItem } from "@chakra-ui/react";
import Card from "components/card/Card";
import CommonCheckTable from "components/reactTable/checktable";

const QuoteInvoicesSection = ({ invoiceData, isLoding, invoicesColumns }) => {
  return (
    <GridItem colSpan={{ base: 12 }} mt={5}>
      <Card overflow={"scroll"}>
        <CommonCheckTable
          title={"Invoices"}
          isLoding={isLoding}
          columnData={invoicesColumns ?? []}
          allData={invoiceData ?? []}
          tableData={invoiceData ?? []}
          AdvanceSearch={false}
          tableCustomFields={[]}
          checkBox={false}
          deleteMany={true}
          ManageGrid={false}
          access={false}
        />
      </Card>
    </GridItem>
  );
};

export default QuoteInvoicesSection;
