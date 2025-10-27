import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "../reducers/userSlice";
import loaderReducer from "../reducers/loaderSlice";
import successMessageSlice from "../reducers/successMessageSlice";
import networkStatusSlice from "../reducers/networkStatusSlice";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["loader"],
};

const rootReducer = combineReducers({
  user: userReducer,
  loader: loaderReducer,
  success: successMessageSlice,
  networkStatus: networkStatusSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export const persistor = persistStore(store);

export default store;
