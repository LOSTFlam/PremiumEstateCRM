import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer, PersistConfig } from "redux-persist";
import storage from "redux-persist/lib/storage";
import roleReducer from "./slices/roleSlice";
import imageReducer from "./slices/imageSlice";
import userReducer from "./slices/localSlice";
import routeReducer from "./slices/routeSlice";
import advanceSearchSlice from "./slices/advanceSearchSlice";
import leadSlice from "./slices/leadSlice";
import propertyCustomFiledSlice from "./slices/propertyCustomFiledSlice";
import propertySlice from "./slices/propertySlice";
import contactSlice from "./slices/contactSlice";
import contactCustomFiledSlice from "./slices/contactCustomFiledSlice";
import leadCustomFiledSlice from "./slices/leadCustomFiledSlice";
import taskSlice from "./slices/taskSlice";
import meetingSlice from "./slices/meetingSlice";
import emailsSlice from "./slices/emailsSlice";
import emailTempSlice from "./slices/emailTempSlice";
import opportunitySlice from "./slices/opportunitySlice";
import moduleSlice from "./slices/moduleSlice";
import accountSlice from "./slices/accountSlice";
import quotesSlice from "./slices/quotesSlice";
import invoicesSlice from "./slices/invoicesSlice";
import opportunityProjectSlice from "./slices/opportunityprojectSlice";
import getBankSlice from "./slices/bankDetailsSlice";
import languageSlice from "./slices/languageSlice";

const middleware = (getDefaultMiddleware: any) =>
  getDefaultMiddleware({
    serializableCheck: false,
  });

const rolePersistConfig: PersistConfig<ReturnType<typeof roleReducer>> = {
  key: "userDetails",
  storage,
};

const routePersistConfig: PersistConfig<ReturnType<typeof routeReducer>> = {
  key: "route",
  storage,
};

const imagesPersistConfig: PersistConfig<ReturnType<typeof imageReducer>> = {
  key: "image",
  storage,
};

const leadPersistConfig: PersistConfig<ReturnType<typeof leadSlice>> = {
  key: "lead",
  storage,
};

const contactPersistConfig: PersistConfig<ReturnType<typeof contactSlice>> = {
  key: "contact",
  storage,
};

const persistedReducers = {
  roles: persistReducer(rolePersistConfig, roleReducer),
  images: persistReducer(imagesPersistConfig, imageReducer),
  route: persistReducer(routePersistConfig, routeReducer),
  leadData: persistReducer(leadPersistConfig, leadSlice),
  contactData: persistReducer(contactPersistConfig, contactSlice),
};

const reducers = {
  ...persistedReducers,
  modules: moduleSlice,
  user: userReducer,
  language: languageSlice,
  advanceSearchData: advanceSearchSlice,
  propertyCustomFiled: propertyCustomFiledSlice,
  contactCustomFiled: contactCustomFiledSlice,
  leadCustomFiled: leadCustomFiledSlice,
  propertyData: propertySlice,
  taskData: taskSlice,
  meetingData: meetingSlice,
  emailsData: emailsSlice,
  emailTempData: emailTempSlice,
  opportunityData: opportunitySlice,
  accountData: accountSlice,
  quotesData: quotesSlice,
  invoicesData: invoicesSlice,
  opportunityProjectData: opportunityProjectSlice,
  bankData: getBankSlice,
};

export const store = configureStore({
  reducer: reducers,
  middleware,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
