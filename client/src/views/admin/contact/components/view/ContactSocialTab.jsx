import {
  Box,
  Grid,
  GridItem,
  Heading,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Card from "components/card/Card";
import DataNotFound from "components/notFoundData";
import { HSeparator } from "components/separator/Separator";
import { BiLink, BiLogoLinkedin } from "react-icons/bi";
import { BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

const ContactSocialTab = ({ data }) => {
  const textColor = useColorModeValue("gray.500", "white");

  return (
    <GridItem colSpan={{ base: 12 }}>
      <Card>
        <Grid templateColumns={{ base: "1fr" }} gap={4}>
          <GridItem colSpan={2}>
            <Box>
              <Heading size="md" mb={3}>
                Social Media Profiles
              </Heading>
              <HSeparator />
            </Box>
          </GridItem>
          {data?.linkedInProfile ||
          data?.facebookProfile ||
          data?.twitterHandle ||
          data?.otherProfiles ? (
            <Grid
              templateColumns={"repeat(12, 1fr)"}
              gap={4}
              my={3}
              flexWrap={"wrap"}
              display={"flex"}
              justifyContent={"center"}
            >
              {data?.linkedInProfile && (
                <GridItem textAlign={"center"} colSpan={{ base: 2, md: 1 }}>
                  <a target="_blank" href={data?.linkedInProfile} rel="noreferrer">
                    <IconButton
                      colorScheme="brand"
                      aria-label="Call Fred"
                      borderRadius="10px"
                      size="md"
                      icon={<BiLogoLinkedin />}
                    />
                  </a>
                  <Text fontSize="sm" mt={2} fontWeight="bold" color={"blackAlpha.900"}>
                    {" "}
                    LinkedIn Profile{" "}
                  </Text>
                </GridItem>
              )}
              {data?.facebookProfile && (
                <GridItem textAlign={"center"} colSpan={{ base: 2, md: 1 }}>
                  <a
                    target="_blank"
                    href={`https://www.facebook.com/${data?.facebookProfile}`}
                    rel="noreferrer"
                  >
                    <IconButton
                      colorScheme="brand"
                      aria-label="Call Fred"
                      borderRadius="10px"
                      size="md"
                      icon={<FaFacebook />}
                    />
                  </a>
                  <Text fontSize="sm" mt={2} fontWeight="bold" color={"blackAlpha.900"}>
                    {" "}
                    Facebook Profile{" "}
                  </Text>
                </GridItem>
              )}
              {data?.linkedInProfile && (
                <GridItem textAlign={"center"} colSpan={{ base: 2, md: 1 }}>
                  <a
                    target="_blank"
                    href={`https://www.facebook.com/${data?.facebookProfile}`}
                    rel="noreferrer"
                  >
                    <IconButton
                      colorScheme="brand"
                      aria-label="Call Fred"
                      borderRadius="10px"
                      size="md"
                      icon={<BsTwitter />}
                    />
                  </a>
                  <Text fontSize="sm" mt={2} px={2} fontWeight="bold" color={"blackAlpha.900"}>
                    Twitter Handle{" "}
                  </Text>
                </GridItem>
              )}

              {data?.linkedInProfile && (
                <GridItem textAlign={"center"} colSpan={{ base: 2, md: 1 }}>
                  <a target="_blank" href={data?.otherProfiles} rel="noreferrer">
                    <IconButton
                      colorScheme="brand"
                      aria-label="Call Fred"
                      borderRadius="10px"
                      size="md"
                      icon={<BiLink />}
                    />
                  </a>
                  <Text fontSize="sm" mt={2} fontWeight="bold" color={"blackAlpha.900"}>
                    {" "}
                    Other Profiles{" "}
                  </Text>
                </GridItem>
              )}
            </Grid>
          ) : (
            <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
              <GridItem colSpan={{ base: 2 }} textAlign={"center"}>
                <Text
                  textAlign={"center"}
                  width="100%"
                  color={textColor}
                  fontSize="sm"
                  fontWeight="700"
                >
                  {" "}
                  <DataNotFound />
                </Text>
              </GridItem>
            </Grid>
          )}
        </Grid>
      </Card>
    </GridItem>
  );
};

export default ContactSocialTab;
