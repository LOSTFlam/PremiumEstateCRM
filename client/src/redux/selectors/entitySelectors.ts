import { useSelector } from "react-redux";
import { IProperty, IContact, ILead, IUser } from "types/models";

export const selectPropertyState = (state: {
  propertyData: { data: IProperty[]; isLoading: boolean; error: string };
}) => state?.propertyData || {};
export const selectPropertyList = (state: {
  propertyData: { data: IProperty[]; isLoading: boolean; error: string };
}) => selectPropertyState(state)?.data || [];
export const selectPropertyLoading = (state: {
  propertyData: { data: IProperty[]; isLoading: boolean; error: string };
}) => Boolean(selectPropertyState(state)?.isLoading);
export const selectPropertyById =
  (id: string) =>
  (state: { propertyData: { data: IProperty[]; isLoading: boolean; error: string } }) =>
    selectPropertyList(state).find((item: IProperty) => item?._id === id) || null;

export const selectContactState = (state: {
  contactData: { data: IContact[]; isLoading: boolean; error: string };
}) => state?.contactData || {};
export const selectContactList = (state: {
  contactData: { data: IContact[]; isLoading: boolean; error: string };
}) => selectContactState(state)?.data || [];
export const selectContactLoading = (state: {
  contactData: { data: IContact[]; isLoading: boolean; error: string };
}) => Boolean(selectContactState(state)?.isLoading);
export const selectContactById =
  (id: string) =>
  (state: { contactData: { data: IContact[]; isLoading: boolean; error: string } }) =>
    selectContactList(state).find((item: IContact) => item?._id === id) || null;

export const selectLeadState = (state: {
  leadData: { data: ILead[]; isLoading: boolean; error: string };
}) => state?.leadData || {};
export const selectLeadList = (state: {
  leadData: { data: ILead[]; isLoading: boolean; error: string };
}) => selectLeadState(state)?.data || [];
export const selectLeadLoading = (state: {
  leadData: { data: ILead[]; isLoading: boolean; error: string };
}) => Boolean(selectLeadState(state)?.isLoading);
export const selectLeadById =
  (id: string) => (state: { leadData: { data: ILead[]; isLoading: boolean; error: string } }) =>
    selectLeadList(state).find((item: ILead) => item?._id === id) || null;

export const selectUserState = (state: { user: { userData?: IUser | null } }) => state?.user || {};
export const selectCurrentUser = (state: { user: { userData?: IUser | null } }) =>
  selectUserState(state)?.userData || null;

export const useTypedSelector = <TSelected>(
  selector: (_state: unknown) => TSelected,
  equalityFn?: (_left: TSelected, _right: TSelected) => boolean
) => useSelector(selector, equalityFn);

export default {
  selectPropertyState,
  selectPropertyList,
  selectPropertyLoading,
  selectPropertyById,
  selectContactState,
  selectContactList,
  selectContactLoading,
  selectContactById,
  selectLeadState,
  selectLeadList,
  selectLeadLoading,
  selectLeadById,
  selectUserState,
  selectCurrentUser,
  useTypedSelector,
};
