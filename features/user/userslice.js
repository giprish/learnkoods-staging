import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      console.log("Reducer received payload:", action.payload);
      state.user = action.payload;
    },
    deleteUser: (state, { payload }) => {
      state.user = {};
    },
  },
});

export const { saveUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
