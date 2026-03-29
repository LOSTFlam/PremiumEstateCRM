export const selectPropertyState = (state) => state?.propertyData || {};
export const selectPropertyList = (state) => selectPropertyState(state)?.data || [];
export const selectPropertyLoading = (state) => Boolean(selectPropertyState(state)?.isLoading);
export const selectPropertyById = (id) => (state) =>
  selectPropertyList(state).find((item) => item?._id === id) || null;

export const selectContactState = (state) => state?.contactData || {};
export const selectContactList = (state) => selectContactState(state)?.data || [];
export const selectContactLoading = (state) => Boolean(selectContactState(state)?.isLoading);
export const selectContactById = (id) => (state) =>
  selectContactList(state).find((item) => item?._id === id) || null;

export const selectLeadState = (state) => state?.leadData || {};
export const selectLeadList = (state) => selectLeadState(state)?.data || [];
export const selectLeadLoading = (state) => Boolean(selectLeadState(state)?.isLoading);
export const selectLeadById = (id) => (state) =>
  selectLeadList(state).find((item) => item?._id === id) || null;

export const selectUserState = (state) => state?.user || {};
export const selectCurrentUser = (state) => selectUserState(state)?.userData || null;
