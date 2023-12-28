import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import listCartSlice from './reducers/Cart/listCartReducer';
import  roleReducer from './reducers/Role/role'
const rootReducer = combineReducers({
    listCartReducer: listCartSlice,
    roleReducer : roleReducer
});
const persistConfig = {
    key: 'root',
    storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
});
export const persistor = persistStore(store);
