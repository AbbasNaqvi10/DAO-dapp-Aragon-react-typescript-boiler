import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { StateInterface } from "./types";
import { DAO } from "src/interface/interfaces";

const initialState: StateInterface = {};

const daoSlice = createSlice({
  name: "dao",
  initialState: initialState,
  reducers: {
    setDao: (state, action: PayloadAction<DAO>) => {
      state.dao = action.payload;
    },
  },
});

export const { setDao } = daoSlice.actions;

export default daoSlice.reducer;

