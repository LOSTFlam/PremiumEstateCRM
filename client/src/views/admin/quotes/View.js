import { Grid, GridItem, Heading, useDisclosure } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import Card from "components/card/Card";
import CabinetRecordActions from "components/cabinet/CabinetRecordActions";
import { HasAccess } from "../../../redux/accessUtils";
import AddEdit from "./AddEdit";
import CommonDeleteModel from "components/commonDeleteModel";
import { deleteManyApi, putApi, getApi } from "../../../services/api";
import html2pdf from "html2pdf.js";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { quoteSchema } from "../../../schema/quoteSchema";
import QuoteDetailsCard from "./components/view/QuoteDetailsCard";
import QuoteInvoicesSection from "./components/view/QuoteInvoicesSection";
import { getQuoteInvoicesColumns } from "./components/view/quoteInvoicesColumns";

const View = (_props) => {
  const params = useParams();
  const { id } = params;
  const user = JSON.parse(localStorage.getItem("user"));

  const [quotesAccess, accountAccess, contactAccess, opportunityAccess, invoicesAccess] = HasAccess(
    ["Quotes", "Account", "Contacts", "Opportunities", "Invoices"]
  );

  const [data, setData] = useState();
  const [invoiceData, setInvoiceData] = useState([]);
  const { onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [deleteManyModel, setDeleteManyModel] = useState(false);
  const [_loading, setLoading] = useState(false);
  const [isLoding, _setIsLoding] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [editableField, setEditableField] = useState(null);
  const [editableFieldName, setEditableFieldName] = useState(null);

  const invoicesColumns = getQuoteInvoicesColumns({
    navigate,
    user,
    contactAccess,
    accountAccess,
  });

  const fetchViewData = async () => {
    if (id) {
      let result = await getApi("api/quotes/view/", id);
      setData(result?.data?.result);
      setInvoiceData(result?.data?.invoiceDetails);
    }
  };
  const generatePDF = () => {
    setLoading(true);
    const element = document.getElementById("reports");
    const hideBtn = document.getElementById("hide-btn");

    if (element) {
      hideBtn.style.display = "none";
      html2pdf()
        .from(element)
        .set({
          margin: [0, 0, 0, 0],
          filename: `Quotes_Details_${moment().format("DD-MM-YYYY")}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, allowTaint: true },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        })
        .save()
        .then(() => {
          setLoading(false);
          hideBtn.style.display = "";
        });
      // }, 500);
    } else {
      setLoading(false);
    }
  };
  const handleDeleteAccount = async (ids) => {
    try {
      let response = await deleteManyApi("api/quotes/deleteMany", ids);
      if (response?.status === 200) {
        navigate("/quotes");
        toast.success(`Quotes Delete successfully`);
        setDeleteManyModel(false);
      }
    } catch (error) {
      toast.error(`server error`);
    }
  };

  const initialValues = {
    title: data?.title,
    oppotunity: data?.oppotunity,
    quoteStage: data?.quoteStage,
    invoiceStatus: data?.invoiceStatus,
    validUntil: data?.validUntil,
    assignedTo: data?.assignedTo,
    paymentTerms: data?.paymentTerms,
    approvalStatus: data?.approvalStatus,
    nonPrimaryEmail: data?.nonPrimaryEmail,
    approvalIssues: data?.approvalIssues,
    terms: data?.terms,
    description: data?.description,
    account: data?.account,
    contact: data?.contact,
    billingStreet: data?.billingStreet,
    shippingStreet: data?.shippingStreet,
    billingCity: data?.billingCity,
    shippingCity: data?.shippingCity,
    billingState: data?.billingState,
    shippingState: data?.shippingState,
    billingPostalCode: data?.billingPostalCode,
    shippingPostalCode: data?.shippingPostalCode,
    billingCountry: data?.billingCountry,
    shippingCountry: data?.shippingCountry,
    isCheck: data?.isCheck,
    currency: data?.currency,
    total: data?.total,
    discount: data?.discount,
    subtotal: data?.subtotal,
    shipping: data?.shipping,
    shippingTax: data?.shippingTax,
    ptax: data?.ptax,
    tax: data?.tax,
    grandTotal: data?.grandTotal,
    modifiedBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: quoteSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm: _resetForm }) => {
      const payload = {
        ...values,
        modifiedDate: new Date(),
      };
      let response = await putApi(`api/quotes/edit/${id}`, payload);
      if (response?.status === 200) {
        setEditableField(null);
        fetchViewData();
        toast.success(`${editableFieldName} Update successfully`);
      } else {
        toast.error(`${editableFieldName} not Update`);
      }
    },
  });
  const handleDoubleClick = (fieldName, value, name) => {
    formik.setFieldValue(fieldName, value);
    setEditableField(fieldName);
    setEditableFieldName(name);
  };

  const handleBlur = (_e) => {
    formik.handleSubmit();
  };
  useEffect(() => {
    fetchViewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, edit]);
  return (
    <div>
      <Grid templateColumns="repeat(4, 1fr)" gap={3} id="reports">
        <GridItem colSpan={{ base: 4 }}>
          <Heading size="lg" m={3}>
            {data?.title || ""}
          </Heading>
        </GridItem>
        <GridItem colSpan={{ base: 4 }}>
          <QuoteDetailsCard
            data={data}
            formik={formik}
            editableField={editableField}
            handleDoubleClick={handleDoubleClick}
            handleBlur={handleBlur}
            quotesAccess={quotesAccess}
            user={user}
            opportunityAccess={opportunityAccess}
            contactAccess={contactAccess}
            accountAccess={accountAccess}
            navigate={navigate}
            setEdit={setEdit}
            setType={setType}
            setDeleteManyModel={setDeleteManyModel}
            generatePDF={generatePDF}
          />
        </GridItem>
      </Grid>
      {invoicesAccess?.view && (
        <QuoteInvoicesSection
          invoiceData={invoiceData}
          isLoding={isLoding}
          invoicesColumns={invoicesColumns}
        />
      )}
      {(quotesAccess?.update || quotesAccess?.delete || user?.role === "superAdmin") && (
        <Card mt={3}>
          <CabinetRecordActions
            showEdit={Boolean(quotesAccess?.update || user?.role === "superAdmin")}
            showDelete={Boolean(quotesAccess?.delete || user?.role === "superAdmin")}
            onEdit={() => {
              setEdit(true);
              setType("edit");
            }}
            onDelete={() => setDeleteManyModel(true)}
          />
        </Card>
      )}
      <AddEdit
        isOpen={edit}
        size="lg"
        onClose={() => setEdit(false)}
        viewClose={onClose}
        selectedId={id?.event ? id?.event?._def?.extendedProps?._id : id}
        type={type}
      />

      <CommonDeleteModel
        isOpen={deleteManyModel}
        onClose={() => setDeleteManyModel(false)}
        type="Account"
        handleDeleteData={handleDeleteAccount}
        ids={[id]}
      />
    </div>
  );
};

export default View;
