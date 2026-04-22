import { Button, Grid, GridItem, Heading, Flex, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApi } from "services/api";
import Card from "components/card/Card";
import { IoIosArrowBack } from "react-icons/io";
import { HSeparator } from "components/separator/Separator";
import { EmailEditor } from "react-email-editor";

const View = () => {
  const { id } = useParams();
  const emailEditorRef = useRef(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchData = useCallback(async () => {
    const result = await getApi(`api/email-temp/view/${id}`);
    if (result && result?.status === 200) {
      setName(result?.data?.templateName);
      setDescription(result?.data?.description);
      emailEditorRef?.current?.editor?.loadDesign(result?.data?.design);
      emailEditorRef?.current?.editor?.showPreview("desktop");
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <GridItem colSpan={{ base: 4 }}>
        <Heading size="lg" m={3}>
          {name || ""}
        </Heading>
      </GridItem>
      <Card>
        <Grid
          templateColumns="repeat(12, 1fr)"
          mb={3}
          gap={1}
          justifyContent={"space-between"}
          alignItem={"center"}
        >
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Text fontSize="xl" fontWeight="bold" color={"blackAlpha.900"}>
              View Template{" "}
            </Text>
          </GridItem>

          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Flex justifyContent={"right"}>
              <Link to="/email-template" style={{ marginLeft: "10px" }}>
                <Button size="sm" leftIcon={<IoIosArrowBack />} variant="brand">
                  Back
                </Button>
              </Link>
            </Flex>
          </GridItem>
        </Grid>
        <HSeparator />
        <div>
          <Grid templateColumns="repeat(12, 1fr)" gap={3} mt={2}>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                {" "}
                Template Name{" "}
              </Text>
              <Text>{name ? name : " - "}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 6 }}>
              <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
                {" "}
                Description{" "}
              </Text>
              <Text>{description ? description : " - "}</Text>
            </GridItem>
            <GridItem colSpan={{ base: 12, md: 12 }} mt={2}>
              <EmailEditor ref={emailEditorRef} />
            </GridItem>
          </Grid>
        </div>
      </Card>
    </div>
  );
};

export default View;
