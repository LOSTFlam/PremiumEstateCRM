import { Grid, GridItem, Heading, useDisclosure } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
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
import { accountSchema } from "../../../schema/accountSchema";
import AccountDetailsCard from "./components/view/AccountDetailsCard";

const View = () => {
  const params = useParams();
  const { id } = params;
  const user = JSON.parse(localStorage.getItem("user"));

  const [permission] = HasAccess(["Account"]);

  const [data, setData] = useState();
  const { onClose } = useDisclosure();
  const [edit, setEdit] = useState(false);
  const [deleteManyModel, setDeleteManyModel] = useState(false);
  const [, setLoading] = useState(false);
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [editableField, setEditableField] = useState(null);
  const [editableFieldName, setEditableFieldName] = useState(null);

  const fetchViewData = useCallback(async () => {
    if (id) {
      let result = await getApi("api/account/view/", id);
      setData(result?.data);
    }
  }, [id]);
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
          filename: `Account_Details_${moment().format("DD-MM-YYYY")}.pdf`,
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
      // Console statement removed
      setLoading(false);
    }
  };
  const handleDeleteAccount = async (ids) => {
    try {
      let response = await deleteManyApi("api/account/deleteMany", ids);
      if (response?.status === 200) {
        navigate("/account");
        toast.success(`Account Delete successfully`);
        setDeleteManyModel(false);
      }
    } catch (error) {
      // Console statement removed
      toast.error(`server error`);
    }
  };

  const initialValues = {
    name: data?.name,
    officePhone: data?.officePhone,
    alternatePhone: data?.alternatePhone,
    assignUser: data?.assignUser,
    website: data?.website,
    fax: data?.fax,
    ownership: data?.ownership,
    emailAddress: data?.emailAddress,
    nonPrimaryEmail: data?.nonPrimaryEmail,
    billingStreet: data?.billingStreet,
    billingStreet2: data?.billingStreet2,
    billingStreet3: data?.billingStreet3,
    billingStreet4: data?.billingStreet4,
    billingPostalcode: data?.billingPostalcode,
    billingCity: data?.billingCity,
    billingState: data?.billingState,
    billingCountry: data?.billingCountry,
    shippingStreet: data?.shippingStreet,
    shippingStreet2: data?.shippingStreet2,
    shippingStreet3: data?.shippingStreet3,
    shippingStreet4: data?.shippingStreet4,
    shippingPostalcode: data?.shippingPostalcode,
    shippingCity: data?.shippingCity,
    shippingState: data?.shippingState,
    shippingCountry: data?.shippingCountry,
    description: data?.description,
    type: data?.type,
    industry: data?.industry,
    annualRevenue: data?.annualRevenue,
    rating: data?.rating,
    SICCode: data?.SICCode,
    memberOf: data?.memberOf,
    modifiedBy: JSON.parse(localStorage.getItem("user"))._id,
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: accountSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const payload = {
        ...values,
        modifiedDate: new Date(),
      };
      let response = await putApi(`api/account/edit/${id}`, payload);
      setEditableField(null);
      if (response?.status === 200) {
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

  const handleBlur = () => {
    formik.handleSubmit();
  };
  useEffect(() => {
    fetchViewData();
  }, [edit, fetchViewData]);

  return (
    <div>
      <Grid templateColumns="repeat(4, 1fr)" gap={3} id="reports">
        <GridItem colSpan={{ base: 4 }}>
          <Heading size="lg" m={3}>
            {data?.name || " "}
          </Heading>
        </GridItem>
        <GridItem colSpan={{ base: 4 }}>
          <AccountDetailsCard
            data={data}
            formik={formik}
            editableField={editableField}
            handleDoubleClick={handleDoubleClick}
            handleBlur={handleBlur}
            permission={permission}
            user={user}
            navigate={navigate}
            setEdit={setEdit}
            setType={setType}
            setDeleteManyModel={setDeleteManyModel}
            generatePDF={generatePDF}
          />
        </GridItem>
      </Grid>
      {(permission?.update || permission?.delete || user?.role === "superAdmin") && (
        <Card mt={3}>
          <CabinetRecordActions
            showEdit={Boolean(permission?.update || user?.role === "superAdmin")}
            showDelete={Boolean(permission?.delete || user?.role === "superAdmin")}
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
