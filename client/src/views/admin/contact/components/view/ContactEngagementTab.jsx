import { Button, Grid, GridItem } from "@chakra-ui/react";
import Card from "components/card/Card";
import CommonCheckTable from "components/reactTable/checktable";
import { useTranslation } from "react-i18next";

const ContactEngagementTab = ({
  allData,
  isLoding,
  emailAccess,
  callAccess,
  taskAccess,
  meetingAccess,
  quotesAccess,
  invoicesAccess,
  columnsDataColumns,
  callColumns,
  taskColumns,
  MeetingColumns,
  quotesColumns,
  invoicesColumns,
  showEmail,
  setShowEmail,
  showCall,
  setShowCall,
  showTasks,
  setShowTasks,
  showMeetings,
  setShowMeetings,
  showQuotes,
  setShowQuotes,
  showInvoices,
  setShowInvoices,
  setAddEmailHistory,
  setAddPhoneCall,
  setTaskModel,
  setMeeting,
  setAddQuotes,
  setAddInvoice,
}) => {
  const { t } = useTranslation();

  return (
    <GridItem colSpan={{ base: 12 }}>
      <Grid templateColumns={{ base: "1fr" }} gap={4}>
        <Grid templateColumns={"repeat(12, 1fr)"} gap={4}>
          {emailAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Email"}
                  isLoding={isLoding}
                  columnData={columnsDataColumns ?? []}
                  allData={
                    showEmail
                      ? allData?.EmailHistory
                      : allData?.EmailHistory?.length > 0
                        ? [allData?.EmailHistory[0]]
                        : []
                  }
                  tableData={
                    showEmail
                      ? allData?.EmailHistory
                      : allData?.EmailHistory?.length > 0
                        ? [allData?.EmailHistory[0]]
                        : []
                  }
                  AdvanceSearch={false}
                  dataLength={allData?.EmailHistory?.length}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setAddEmailHistory(true)}
                  access={emailAccess}
                />

                {allData?.EmailHistory?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      size="sm"
                      display="flex"
                      justifyContant="end"
                      onClick={() => (showEmail ? setShowEmail(false) : setShowEmail(true))}
                    >
                      {showEmail
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
          {callAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Call"}
                  isLoding={isLoding}
                  columnData={callColumns ?? []}
                  allData={
                    showCall
                      ? allData?.phoneCallHistory
                      : allData?.phoneCallHistory?.length > 0
                        ? [allData?.phoneCallHistory[0]]
                        : []
                  }
                  tableData={
                    showCall
                      ? allData?.phoneCallHistory
                      : allData?.phoneCallHistory?.length > 0
                        ? [allData?.phoneCallHistory[0]]
                        : []
                  }
                  AdvanceSearch={false}
                  tableCustomFields={[]}
                  dataLength={allData?.phoneCallHistory?.length}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setAddPhoneCall(true)}
                  access={callAccess}
                />

                {allData?.phoneCallHistory?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      size="sm"
                      display="flex"
                      justifyContant="end"
                      onClick={() => (showCall ? setShowCall(false) : setShowCall(true))}
                    >
                      {showCall
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
          {taskAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Task"}
                  isLoding={isLoding}
                  columnData={taskColumns ?? []}
                  allData={
                    showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []
                  }
                  tableData={
                    showTasks ? allData?.task : allData?.task?.length > 0 ? [allData?.task[0]] : []
                  }
                  AdvanceSearch={false}
                  dataLength={allData?.task?.length}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setTaskModel(true)}
                  access={taskAccess}
                />

                {allData?.task?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      variant="outline"
                      size="sm"
                      display="flex"
                      justifyContant="end"
                      onClick={() => (showTasks ? setShowTasks(false) : setShowTasks(true))}
                    >
                      {showTasks
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
          {meetingAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Meeting"}
                  isLoding={isLoding}
                  columnData={MeetingColumns ?? []}
                  dataLength={allData?.meetingHistory?.length}
                  allData={
                    showMeetings
                      ? allData?.meetingHistory
                      : allData?.meetingHistory?.length > 0
                        ? [allData?.meetingHistory[0]]
                        : []
                  }
                  tableData={
                    showMeetings
                      ? allData?.meetingHistory
                      : allData?.meetingHistory?.length > 0
                        ? [allData?.meetingHistory[0]]
                        : []
                  }
                  AdvanceSearch={false}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setMeeting(true)}
                  access={meetingAccess}
                />

                {allData?.meetingHistory?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      size="sm"
                      variant="outline"
                      display="flex"
                      justifyContant="end"
                      onClick={() =>
                        showMeetings ? setShowMeetings(false) : setShowMeetings(true)
                      }
                    >
                      {showMeetings
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
          {quotesAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Quotes"}
                  isLoding={isLoding}
                  columnData={quotesColumns ?? []}
                  dataLength={allData?.quotes?.length}
                  allData={
                    showQuotes
                      ? allData?.quotes
                      : allData?.quotes?.length > 0
                        ? [allData?.quotes[0]]
                        : []
                  }
                  tableData={
                    showQuotes
                      ? allData?.quotes
                      : allData?.quotes?.length > 0
                        ? [allData?.quotes[0]]
                        : []
                  }
                  AdvanceSearch={false}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setAddQuotes(true)}
                  access={quotesAccess}
                />

                {allData?.quotes?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      size="sm"
                      variant="outline"
                      display="flex"
                      justifyContant="end"
                      onClick={() => (showQuotes ? setShowQuotes(false) : setShowQuotes(true))}
                    >
                      {showQuotes
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
          {invoicesAccess?.view && (
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Card overflow={"scroll"}>
                <CommonCheckTable
                  title={"Invoices"}
                  isLoding={isLoding}
                  columnData={invoicesColumns ?? []}
                  dataLength={allData?.invoice?.length}
                  allData={
                    showInvoices
                      ? allData?.invoice
                      : allData?.invoice?.length > 0
                        ? [allData?.invoice[0]]
                        : []
                  }
                  tableData={
                    showInvoices
                      ? allData?.invoice
                      : allData?.invoice?.length > 0
                        ? [allData?.invoice[0]]
                        : []
                  }
                  AdvanceSearch={false}
                  tableCustomFields={[]}
                  checkBox={false}
                  deleteMany={true}
                  ManageGrid={false}
                  onOpen={() => setAddInvoice(true)}
                  access={invoicesAccess}
                />

                {allData?.invoice?.length > 1 && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <Button
                      colorScheme="brand"
                      size="sm"
                      variant="outline"
                      display="flex"
                      justifyContant="end"
                      onClick={() =>
                        showInvoices ? setShowInvoices(false) : setShowInvoices(true)
                      }
                    >
                      {showInvoices
                        ? t?.("modules.contact.view.showLess")
                        : t?.("modules.contact.view.showMore")}
                    </Button>
                  </div>
                )}
              </Card>
            </GridItem>
          )}
        </Grid>
      </Grid>
    </GridItem>
  );
};

export default ContactEngagementTab;
