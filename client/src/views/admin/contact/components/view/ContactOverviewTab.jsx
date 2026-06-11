import { Box, Button, Flex, Grid, GridItem, Heading, useColorModeValue } from "@chakra-ui/react";
import Card from "components/card/Card";
import CommonCheckTable from "components/reactTable/checktable";
import { LuBuilding2 } from "react-icons/lu";
import CustomView from "utils/customView";

const ContactOverviewTab = ({
  contactData,
  data,
  toCamelCase,
  fetchData,
  allData,
  isLoding,
  columns,
  propertyData,
  setPropertyModel,
}) => {
  const buttonbg = useColorModeValue("gray.200", "white");

  return (
    <>
      <CustomView
        data={contactData?.[0]}
        fieldData={data}
        toCamelCase={toCamelCase}
        moduleId={contactData?.[0]?._id}
        fetchData={fetchData}
        id="reports"
      />

      <GridItem colSpan={{ base: 12 }} mt={4}>
        <Card>
          <Grid templateColumns={{ base: "1fr" }} gap={4}>
            <GridItem colSpan={2}>
              <Box>
                <Flex alignItems={"center"} mb={2} justifyContent={"space-between"}>
                  <Heading size="md">
                    Property of Interest ({allData?.interestProperty?.interestProperty?.length})
                  </Heading>
                  <Button
                    onClick={() => setPropertyModel(true)}
                    leftIcon={<LuBuilding2 />}
                    size="sm"
                    colorScheme="gray"
                    bg={buttonbg}
                  >
                    Select Interested Property{" "}
                  </Button>
                </Flex>
              </Box>

              <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
                <GridItem colSpan={{ base: 2 }}>
                  <CommonCheckTable
                    isLoding={isLoding}
                    columnData={columns ?? []}
                    dataColumn={columns ?? []}
                    allData={allData?.interestProperty?.interestProperty || []}
                    tableData={allData?.interestProperty?.interestProperty || []}
                    tableCustomFields={
                      propertyData?.[0]?.fields?.filter((field) => field?.isTableField === true) ||
                      []
                    }
                    AdvanceSearch={() => ""}
                    ManageGrid={false}
                    deleteMany={false}
                    selectType="multiple"
                    customSearch={false}
                    checkBox={false}
                  />
                </GridItem>
              </Grid>
            </GridItem>
          </Grid>
        </Card>
      </GridItem>
    </>
  );
};

export default ContactOverviewTab;
