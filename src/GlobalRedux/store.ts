

import {configureStore } from "@reduxjs/toolkit";
import modalSlice from "./Features/showModalSlice"
import commentModalSlice from "./Features/commentModalSlice";

export const store = configureStore({
  reducer:{
    modalSlice:modalSlice,
    commentModalSlice:commentModalSlice

  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch