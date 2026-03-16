import { combineReducers, createSlice } from '@reduxjs/toolkit';
import voterRegisterReducer from './voter-register.reducer';
import masterCountryReducer from './masters/masterCountry.reducer';
import masterStateReducer from './masters/masterState.reducer';
import masterPCReducer from './masters/masterPC.reducer';
import masterACReducer from './masters/masterAC.reducer';

// Auth slice defined inline to avoid module resolution issues with separate file
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null as any, loading: false, error: null as string | null },
    reducers: {},
});

export const rootReducer = combineReducers({
    auth: authSlice.reducer,
    voterRegistration: voterRegisterReducer,
    masterCountry: masterCountryReducer,
    masterState: masterStateReducer,
    masterPC: masterPCReducer,
    masterAC: masterACReducer,
});