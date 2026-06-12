import React from "react";
import {
  Button,
  Grid,
  GridItem,
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Box,
  Heading,
  Input,
  Select,
  Textarea,
} from "@chakra-ui/react";
import { AddIcon, ChevronDownIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import { IoIosArrowBack } from "react-icons/io";
import { HSeparator } from "components/separator/Separator";
import { FaFilePdf } from "react-icons/fa";
import dayjs from "dayjs";

const QuoteDetailsCard = ({
  data,
  formik,
  editableField,
  handleDoubleClick,
  handleBlur,
  quotesAccess,
  user,
  opportunityAccess,
  contactAccess,
  accountAccess,
  navigate,
  setEdit,
  setType,
  setDeleteManyModel,
  generatePDF,
}) => {
  return (
    <Card>
      <Grid gap={4}>
        <GridItem colSpan={2}>
          <Box>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Heading size="md" mb={3}>
                Quotes Details
              </Heading>
              <Flex id="hide-btn">
                <Menu>
                  {(user?.role === "superAdmin" ||
                    quotesAccess?.create ||
                    quotesAccess?.update ||
                    quotesAccess?.delete) && (
                    <MenuButton
                      variant="outline"
                      colorScheme="blackAlpha"
                      size="sm"
                      va
                      mr={2.5}
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                    >
                      Actions
                    </MenuButton>
                  )}
                  <MenuDivider />
                  <MenuList minWidth={2}>
                    {(user?.role === "superAdmin" || quotesAccess?.create) && (
                      <MenuItem
                        onClick={() => {
                          setEdit(true);
                          setType("add");
                          formik.resetForm();
                        }}
                        alignItems={"start"}
                        color={"blue"}
                        icon={<AddIcon />}
                      >
                        Add
                      </MenuItem>
                    )}
                    {(user?.role === "superAdmin" || quotesAccess?.update) && (
                      <MenuItem
                        onClick={() => {
                          setEdit(true);
                          setType("edit");
                        }}
                        alignItems={"start"}
                        icon={<EditIcon />}
                      >
                        Edit
                      </MenuItem>
                    )}
                    <MenuItem
                      onClick={generatePDF}
                      alignItems={"start"}
                      icon={<FaFilePdf />}
                      display={"flex"}
                      style={{ alignItems: "center" }}
                    >
                      Print as PDF
                    </MenuItem>

                    {(user?.role === "superAdmin" || quotesAccess?.delete) && (
                      <>
                        <MenuDivider />
                        <MenuItem
                          alignItems={"start"}
                          onClick={() => setDeleteManyModel(true)}
                          color={"red"}
                          icon={<DeleteIcon />}
                        >
                          Delete
                        </MenuItem>
                      </>
                    )}
                  </MenuList>
                </Menu>
                <Button
                  leftIcon={<IoIosArrowBack />}
                  size="sm"
                  variant="brand"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </Flex>
            </Box>
            <HSeparator />
          </Box>
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Quotes Number{" "}
          </Text>
          <Text>{data?.quoteNumber ? data?.quoteNumber : " - "}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Title{" "}
          </Text>
          {editableField === "title" ? (
            <>
              <Input
                id="text"
                name="title"
                type="text"
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.title}
                borderColor={formik?.errors?.title && formik?.touched?.title ? "red.300" : null}
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.title && formik?.touched?.title && formik?.errors?.title}
              </Text>
            </>
          ) : (
            <Text onDoubleClick={() => handleDoubleClick("title", data?.title, "Title")}>
              {data?.title ? data?.title : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Opportunity
          </Text>
          {data?.oppotunity ? (
            <Link to={opportunityAccess?.view && `/opportunitiesView/${data?.oppotunity}`}>
              <Text
                color={opportunityAccess?.view ? "blue.500" : "blackAlpha.900"}
                sx={{
                  "&:hover": {
                    color: opportunityAccess?.view ? "blue.500" : "blackAlpha.900",
                    textDecoration: opportunityAccess?.view ? "underline" : "none",
                  },
                }}
                style={{ cursor: "pointer" }}
              >
                {data?.oppotunityName ? data?.oppotunityName : " - "}
              </Text>
            </Link>
          ) : (
            <Text
              color={opportunityAccess?.view ? "blue.500" : "blackAlpha.900"}
              sx={{
                "&:hover": {
                  color: opportunityAccess?.view ? "blue.500" : "blackAlpha.900",
                  textDecoration: opportunityAccess?.view ? "underline" : "none",
                },
              }}
            >
              {data?.oppotunityName ? data?.oppotunityName : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Quote Stage{" "}
          </Text>
          {editableField === "quoteStage" ? (
            <>
              <Select
                value={formik?.values?.quoteStage}
                name="quoteStage"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                mb={formik?.errors?.quoteStage && formik?.touched?.quoteStage ? undefined : "10px"}
                fontWeight="500"
                placeholder={"Quote Stage"}
                borderColor={
                  formik?.errors?.quoteStage && formik?.touched?.quoteStage ? "red.300" : null
                }
              >
                <option value="Draft">Draft</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Delivered">Delivered</option>
                <option value="On Hold">On Hold</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Closed Accepted">Closed Accepted</option>
                <option value="Closed Lost">Closed Lost</option>
                <option value="Closed Dead">Closed Dead</option>
              </Select>
              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.quoteStage &&
                  formik?.touched?.quoteStage &&
                  formik?.errors?.quoteStage}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() => handleDoubleClick("quoteStage", data?.quoteStage, "Quote Stage")}
            >
              {data?.quoteStage ? data?.quoteStage : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Invoice Status{" "}
          </Text>
          {editableField === "invoiceStatus" ? (
            <>
              <Select
                value={formik?.values?.invoiceStatus}
                name="invoiceStatus"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                mb={
                  formik?.errors?.invoiceStatus && formik?.touched?.invoiceStatus
                    ? undefined
                    : "10px"
                }
                fontWeight="500"
                placeholder={"Invoice Status"}
                borderColor={
                  formik?.errors?.invoiceStatus && formik?.touched?.invoiceStatus ? "red.300" : null
                }
              >
                <option value="Not Invoiced">Not Invoiced</option>
                <option value="Invoiced">Invoiced</option>
              </Select>
              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.invoiceStatus &&
                  formik?.touched?.invoiceStatus &&
                  formik?.errors?.invoiceStatus}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("invoiceStatus", data?.invoiceStatus, "Invoice Status")
              }
            >
              {data?.invoiceStatus ? data?.invoiceStatus : " - "}
            </Text>
          )}
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Valid Until
          </Text>
          {editableField === "validUntil" ? (
            <>
              <Input
                name="validUntil"
                type="date"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={dayjs(formik?.values?.validUntil)?.format("YYYY-MM-DD")}
                borderColor={
                  formik?.errors?.validUntil && formik?.touched?.validUntil ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.validUntil &&
                  formik?.touched?.validUntil &&
                  formik?.errors?.validUntil}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() => handleDoubleClick("validUntil", data?.validUntil, "Valid Until")}
            >
              {data?.validUntil ? data?.validUntil : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Payment Terms
          </Text>
          {editableField === "paymentTerms" ? (
            <>
              <Select
                value={formik?.values?.paymentTerms}
                name="paymentTerms"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                mb={
                  formik?.errors?.paymentTerms && formik?.touched?.paymentTerms ? undefined : "10px"
                }
                fontWeight="500"
                placeholder={"Payment Terms"}
                borderColor={
                  formik?.errors?.paymentTerms && formik?.touched?.paymentTerms ? "red.300" : null
                }
              >
                <option value="Nett 15">Nett 15</option>
                <option value="Nett 30">Nett 30</option>
              </Select>
              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.paymentTerms &&
                  formik?.touched?.paymentTerms &&
                  formik?.errors?.paymentTerms}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("paymentTerms", data?.paymentTerms, "Payment Terms")
              }
            >
              {data?.paymentTerms ? data?.paymentTerms : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Approval Status
          </Text>
          {editableField === "approvalStatus" ? (
            <>
              <Select
                value={formik?.values?.approvalStatus}
                name="approvalStatus"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                mb={
                  formik?.errors?.approvalStatus && formik?.touched?.approvalStatus
                    ? undefined
                    : "10px"
                }
                fontWeight="500"
                placeholder={"Approval Status"}
                borderColor={
                  formik?.errors?.approvalStatus && formik?.touched?.approvalStatus
                    ? "red.300"
                    : null
                }
              >
                <option value="Approved">Approved</option>
              </Select>
              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.approvalStatus &&
                  formik?.touched?.approvalStatus &&
                  formik?.errors?.approvalStatus}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("approvalStatus", data?.approvalStatus, "Approval Status")
              }
            >
              {data?.approvalStatus ? data?.approvalStatus : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Approval Issues
          </Text>
          {editableField === "approvalIssues" ? (
            <>
              <Textarea
                fontSize="sm"
                value={formik?.values?.approvalIssues}
                name="approvalIssues"
                resize={"none"}
                onBlur={handleBlur}
                onChange={formik?.handleChange}
                placeholder="Approval Issues"
                fontWeight="500"
                borderColor={
                  formik?.errors?.approvalIssues && formik?.touched?.approvalIssues
                    ? "red.300"
                    : null
                }
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.approvalIssues &&
                  formik?.touched?.approvalIssues &&
                  formik?.errors?.approvalIssues}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("approvalIssues", data?.approvalIssues, "Approval Issues")
              }
              style={{ width: "300px" }}
            >
              {data?.approvalIssues ? data?.approvalIssues : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Terms
          </Text>
          {editableField === "terms" ? (
            <>
              <Textarea
                fontSize="sm"
                value={formik?.values?.terms}
                name="terms"
                resize={"none"}
                onBlur={handleBlur}
                onChange={formik?.handleChange}
                placeholder="Terms"
                fontWeight="500"
                borderColor={formik?.errors?.terms && formik?.touched?.terms ? "red.300" : null}
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.terms && formik?.touched?.terms && formik?.errors?.terms}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() => handleDoubleClick("terms", data?.terms, "Terms")}
              style={{ width: "300px" }}
            >
              {data?.terms ? data?.terms : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Description
          </Text>
          {editableField === "description" ? (
            <>
              <Textarea
                fontSize="sm"
                value={formik?.values?.description}
                name="description"
                resize={"none"}
                onBlur={handleBlur}
                onChange={formik?.handleChange}
                placeholder="Description"
                fontWeight="500"
                borderColor={
                  formik?.errors?.description && formik?.touched?.description ? "red.300" : null
                }
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.description &&
                  formik?.touched?.description &&
                  formik?.errors?.description}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("description", data?.description, "Description")
              }
              style={{ width: "300px" }}
            >
              {data?.description ? data?.description : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Account
          </Text>
          {data?.account ? (
            <Link to={accountAccess?.view && `/accountView/${data?.account}`}>
              <Text
                color={accountAccess?.view ? "blue.500" : "blackAlpha.900"}
                sx={{
                  "&:hover": {
                    color: accountAccess?.view ? "blue.500" : "blackAlpha.900",
                    textDecoration: accountAccess?.view ? "underline" : "none",
                  },
                }}
                style={{ cursor: "pointer" }}
              >
                {data?.accountName ? data?.accountName : " - "}
              </Text>
            </Link>
          ) : (
            <Text
              color={accountAccess?.view ? "blue.500" : "blackAlpha.900"}
              sx={{
                "&:hover": {
                  color: accountAccess?.view ? "blue.500" : "blackAlpha.900",
                  textDecoration: accountAccess?.view ? "underline" : "none",
                },
              }}
            >
              {data?.accountName ? data?.accountName : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Contact
          </Text>
          {data?.contact ? (
            <Link to={contactAccess?.view && `/contactView/${data?.contact}`}>
              <Text
                color={contactAccess?.view ? "blue.500" : "blackAlpha.900"}
                sx={{
                  "&:hover": {
                    color: contactAccess?.view ? "blue.500" : "blackAlpha.900",
                    textDecoration: contactAccess?.view ? "underline" : "none",
                  },
                }}
                style={{ cursor: "pointer" }}
              >
                {data?.contactName ? data?.contactName : " - "}
              </Text>
            </Link>
          ) : (
            <Text
              color={contactAccess?.view ? "blue.500" : "blackAlpha.900"}
              sx={{
                "&:hover": {
                  color: contactAccess?.view ? "blue.500" : "blackAlpha.900",
                  textDecoration: contactAccess?.view ? "underline" : "none",
                },
              }}
            >
              {data?.contactName ? data?.contactName : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Billing Street
          </Text>
          {editableField === "billingStreet" ? (
            <>
              <Input
                name="billingStreet"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.billingStreet}
                borderColor={
                  formik?.errors?.billingStreet && formik?.touched?.billingStreet ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.billingStreet &&
                  formik?.touched?.billingStreet &&
                  formik?.errors?.billingStreet}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("billingStreet", data?.billingStreet, "Billing Street")
              }
            >
              {data?.billingStreet ? data?.billingStreet : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping Street
          </Text>
          {editableField === "shippingStreet" ? (
            <>
              <Input
                name="shippingStreet"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.shippingStreet}
                borderColor={
                  formik?.errors?.shippingStreet && formik?.touched?.shippingStreet
                    ? "red.300"
                    : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.shippingStreet &&
                  formik?.touched?.shippingStreet &&
                  formik?.errors?.shippingStreet}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("shippingStreet", data?.shippingStreet, "Shipping Street")
              }
            >
              {data?.shippingStreet ? data?.shippingStreet : " - "}
            </Text>
          )}
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Billing City
          </Text>
          {editableField === "billingCity" ? (
            <>
              <Input
                name="billingCity"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.billingCity}
                borderColor={
                  formik?.errors?.billingCity && formik?.touched?.billingCity ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors.billingCity &&
                  formik?.touched?.billingCity &&
                  formik?.errors?.billingCity}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("billingCity", data?.billingCity, "Billing City")
              }
            >
              {data?.billingCity ? data?.billingCity : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping City
          </Text>
          {editableField === "shippingCity" ? (
            <>
              <Input
                name="shippingCity"
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.shippingCity}
                borderColor={
                  formik?.errors?.shippingCity && formik?.touched?.shippingCity ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.shippingCity &&
                  formik?.touched?.shippingCity &&
                  formik?.errors?.shippingCity}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("shippingCity", data?.shippingCity, "Shipping City")
              }
            >
              {data?.shippingCity ? data?.shippingCity : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Billing State
          </Text>
          {editableField === "billingState" ? (
            <>
              <Input
                name="billingState"
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.billingState}
                borderColor={
                  formik?.errors?.billingState && formik?.touched?.billingState ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.billingState &&
                  formik?.touched?.billingState &&
                  formik?.errors?.billingState}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("billingState", data?.billingState, "Billing State")
              }
            >
              {data?.billingState ? data?.billingState : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping State
          </Text>
          {editableField === "shippingState" ? (
            <>
              <Input
                name="shippingState"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.shippingState}
                borderColor={
                  formik?.errors?.shippingState && formik?.touched?.shippingState ? "red.300" : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors.shippingState &&
                  formik?.touched?.shippingState &&
                  formik?.errors?.shippingState}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("shippingState", data?.shippingState, "Shipping State")
              }
            >
              {data?.shippingState ? data?.shippingState : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Billing Postal Code
          </Text>
          {editableField === "billingPostalCode" ? (
            <>
              <Input
                name="billingPostalCode"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.billingPostalCode}
                borderColor={
                  formik?.errors?.billingPostalCode && formik?.touched?.billingPostalCode
                    ? "red.300"
                    : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.billingPostalCode &&
                  formik?.touched?.billingPostalCode &&
                  formik?.errors?.billingPostalCode}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick(
                  "billingPostalCode",
                  data?.billingPostalCode,
                  "Billing Postal Code"
                )
              }
            >
              {data?.billingPostalCode ? data?.billingPostalCode : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping Postal Code
          </Text>
          {editableField === "shippingPostalCode" ? (
            <>
              <Input
                name="shippingPostalCode"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.shippingPostalCode}
                borderColor={
                  formik?.errors?.shippingPostalCode && formik?.touched?.shippingPostalCode
                    ? "red.300"
                    : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.shippingPostalCode &&
                  formik?.touched?.shippingPostalCode &&
                  formik?.errors?.shippingPostalCode}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick(
                  "shippingPostalCode",
                  data?.shippingPostalCode,
                  "Shipping Postal Code"
                )
              }
            >
              {data?.shippingPostalCode ? data?.shippingPostalCode : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Billing Country
          </Text>
          {editableField === "billingCountry" ? (
            <>
              <Input
                name="billingCountry"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.billingCountry}
                borderColor={
                  formik?.errors?.billingCountry && formik?.touched?.billingCountry
                    ? "red.300"
                    : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.billingCountry &&
                  formik?.touched?.billingCountry &&
                  formik?.errors?.billingCountry}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("billingCountry", data?.billingCountry, "Billing Country")
              }
            >
              {data?.billingCountry ? data?.billingCountry : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping Country
          </Text>
          {editableField === "shippingCountry" ? (
            <>
              <Input
                name="shippingCountry"
                onChange={formik?.handleChange}
                onBlur={handleBlur}
                value={formik?.values?.shippingCountry}
                borderColor={
                  formik?.errors?.shippingCountry && formik?.touched?.shippingCountry
                    ? "red.300"
                    : null
                }
                autoFocus
              />

              <Text mb="10px" color={"red"}>
                {" "}
                {formik?.errors?.shippingCountry &&
                  formik?.touched?.shippingCountry &&
                  formik?.errors?.shippingCountry}
              </Text>
            </>
          ) : (
            <Text
              onDoubleClick={() =>
                handleDoubleClick("shippingCountry", data?.shippingCountry, "Shipping Country")
              }
            >
              {data?.shippingCountry ? data?.shippingCountry : " - "}
            </Text>
          )}
        </GridItem>

        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            {" "}
            Assigned To
          </Text>
          {data?.assignedTo ? (
            <Link to={user?.role === "superAdmin" && `/userView/${data?.assignedTo}`}>
              <Text
                color={user?.role === "superAdmin" ? "blue.500" : "blackAlpha.900"}
                sx={{
                  "&:hover": {
                    color: user?.role === "superAdmin" ? "blue.500" : "blackAlpha.900",
                    textDecoration: user?.role === "superAdmin" ? "underline" : "none",
                  },
                }}
                style={{ cursor: "pointer" }}
              >
                {data?.assignUserName ? data?.assignUserName : " - "}
              </Text>
            </Link>
          ) : (
            <Text
              color={user?.role === "superAdmin" ? "blue.500" : "blackAlpha.900"}
              sx={{
                "&:hover": {
                  color: user?.role === "superAdmin" ? "blue.500" : "blackAlpha.900",
                  textDecoration: user?.role === "superAdmin" ? "underline" : "none",
                },
              }}
            >
              {data?.assignUserName ? data?.assignUserName : " - "}
            </Text>
          )}
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Total
          </Text>
          <Text>{`${data?.currency}${data?.total ? data?.total : "0"}`}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Discount
          </Text>
          <Text>{`${data?.currency}${data?.discount || "0"}`}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Subtotal
          </Text>
          <Text>{`${data?.currency}${data?.subtotal ? data?.subtotal : "0"}`}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping
          </Text>
          <>{`${data?.currency}${data?.shipping ? data?.shipping : "0"}`}</>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Shipping Tax
          </Text>
          <Text>{`${data?.currency}${data?.shippingTax ? data?.shippingTax : "0"}`}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Tax
          </Text>
          <Text>{`${data?.currency}${data?.tax ? data?.tax : "0"}`}</Text>
        </GridItem>
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Text fontSize="sm" fontWeight="bold" color={"blackAlpha.900"}>
            Grand Total
          </Text>
          <Text>{`${data?.currency}${data?.grandTotal ? data?.grandTotal : "0"}`}</Text>
        </GridItem>
      </Grid>
    </Card>
  );
};

export default QuoteDetailsCard;
