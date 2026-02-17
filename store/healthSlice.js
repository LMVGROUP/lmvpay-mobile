import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,   // this will hold your user payload
  selectedPlanData: null,
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setUserPayload: (state, action) => {
      state.user = action.payload;
    },

    clearUserPayload: (state) => {
      state.user = null;
    },
    setSelectedPlanData: (state, action) => {
      state.selectedPlanData = action.payload
    },
    clearSelectedPlanData: (state) => {
      state.selectedPlanData = null;
    }
  },
});

export const { setUserPayload, clearUserPayload, setSelectedPlanData, clearSelectedPlanData } = healthSlice.actions;

export default healthSlice.reducer;
