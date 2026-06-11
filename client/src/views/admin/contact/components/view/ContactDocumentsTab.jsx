import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  GridItem,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import FolderTreeView from "components/FolderTreeView/folderTreeView";
import Card from "components/card/Card";
import DataNotFound from "components/notFoundData";
import { HSeparator } from "components/separator/Separator";

const ContactDocumentsTab = ({ allData, download, setAddDocument }) => {
  const textColor = useColorModeValue("gray.500", "white");

  return (
    <GridItem colSpan={{ base: 12 }}>
      <Card minH={"40vh"}>
        <Flex alignItems={"center"} justifyContent={"space-between"} mb="2">
          <Heading size="md" mb={3}>
            Documents
          </Heading>
          <Button
            leftIcon={<AddIcon />}
            size="sm"
            variant="brand"
            onClick={() => setAddDocument(true)}
          >
            Add Document
          </Button>
        </Flex>
        <HSeparator />
        <VStack mt={4} alignItems="flex-start">
          {allData?.Document?.length > 0 ? (
            allData?.Document?.map((item) => (
              <FolderTreeView
                key={item?._id || item?.folderName}
                name={item?.folderName}
                item={item}
              >
                {item?.files?.map((file) => (
                  <FolderTreeView
                    key={file?._id || file?.fileName}
                    download={download}
                    data={file}
                    name={file?.fileName}
                    isFile
                    from="contact"
                  />
                ))}
              </FolderTreeView>
            ))
          ) : (
            <Text
              textAlign={"center"}
              width="100%"
              color={textColor}
              fontSize="sm"
              fontWeight="700"
            >
              <DataNotFound />
            </Text>
          )}
        </VStack>
      </Card>
    </GridItem>
  );
};

export default ContactDocumentsTab;
