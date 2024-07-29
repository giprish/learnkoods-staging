import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  userType: null, // Added userType to the initial state
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      console.log("Reducer received payload:", action.payload);
      state.user = action.payload;
    },
    deleteUser: (state) => {
      state.user = {};
      state.userType = null; // Clear userType when deleting user
    },
    setUserType: (state, action) => {
      state.userType = action.payload; // Set userType
    },
  },
});

export const { saveUser, deleteUser, setUserType } = userSlice.actions;
export default userSlice.reducer;
