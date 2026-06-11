import AddEmailHistory from "../../../emailHistory/components/AddEmail";
import AddMeeting from "../../../meeting/components/Addmeeting";
import AddPhoneCall from "../../../phoneCall/components/AddPhoneCall";
import AddEdit from "../../../task/components/AddEdit";
import AddEditQuotes from "../../../quotes/AddEdit";
import AddEditInvoice from "../../../invoice/AddEdit";
import Add from "../../Add";
import Edit from "../../Edit";
import PropertyModel from "../propertyModel";
import CommonDeleteModel from "components/commonDeleteModel";
import AddDocumentModal from "utils/addDocumentModal";

const ContactViewModals = ({
  isOpen,
  onClose,
  size,
  contactData,
  edit,
  setEdit,
  setAction,
  data,
  deleteModel,
  setDelete,
  handleDeleteContact,
  param,
  allData,
  fetchData,
  addEmailHistory,
  setAddEmailHistory,
  addDocument,
  setAddDocument,
  addMeeting,
  setMeeting,
  splitValue,
  taskModel,
  setTaskModel,
  addPhoneCall,
  setAddPhoneCall,
  addQuotes,
  setAddQuotes,
  addInvoice,
  setAddInvoice,
  propertyModel,
  setPropertyModel,
}) => {
  return (
    <>
      {isOpen && (
        <Add isOpen={isOpen} size={size} onClose={onClose} contactData={contactData?.[0]} />
      )}
      <Edit
        isOpen={edit}
        contactData={contactData?.[0]}
        size={size}
        onClose={setEdit}
        setAction={setAction}
        moduleId={contactData?.[0]?._id}
        data={data}
      />

      <CommonDeleteModel
        isOpen={deleteModel}
        onClose={() => setDelete(false)}
        type="Contact"
        handleDeleteData={handleDeleteContact}
        ids={param?.id}
      />

      <AddEmailHistory
        lead="false"
        contactEmail={allData?.contact?.email}
        fetchData={fetchData}
        isOpen={addEmailHistory}
        onClose={setAddEmailHistory}
        id={param?.id}
      />

      <AddDocumentModal
        addDocument={addDocument}
        setAddDocument={setAddDocument}
        linkId={param?.id}
        from="contact"
        setAction={setAction}
        fetchData={fetchData}
      />

      <AddMeeting
        fetchData={fetchData}
        leadContect={splitValue[0]}
        isOpen={addMeeting}
        onClose={setMeeting}
        from="contact"
        id={param?.id}
        setAction={setAction}
        view={true}
      />

      <AddEdit
        isOpen={taskModel}
        fetchData={fetchData}
        leadContect={splitValue[0]}
        onClose={setTaskModel}
        id={param?.id}
        userAction={"add"}
        view={true}
      />

      <AddPhoneCall
        viewData={allData}
        fetchData={fetchData}
        setAction={setAction}
        isOpen={addPhoneCall}
        onClose={setAddPhoneCall}
        data={data?.contact}
        id={param?.id}
        cData={data}
      />

      <AddEditQuotes
        isOpen={addQuotes}
        size={"lg"}
        onClose={() => setAddQuotes(false)}
        setAction={setAction}
        type={"add"}
        contactId={param?.id}
      />

      <AddEditInvoice
        isOpen={addInvoice}
        size={"lg"}
        onClose={() => setAddInvoice(false)}
        setAction={setAction}
        type={"add"}
        contactId={param?.id}
      />

      <PropertyModel
        fetchData={fetchData}
        isOpen={propertyModel}
        onClose={setPropertyModel}
        id={param?.id}
        interestProperty={data?.interestProperty}
      />
    </>
  );
};

export default ContactViewModals;
