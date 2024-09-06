import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: false,
  chatSidebar: false,
  shortSidebar: false,
};

export const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    menuToggle: (state) => {
      state.menu = !state.menu;
    },
    chatSidebarToggle: (state) => {
      state.chatSidebar = !state.chatSidebar;
    },
    shortSidebarToggle: (state) => {
      state.shortSidebar = !state.shortSidebar;
    },
  },
});

export const { menuToggle, chatSidebarToggle, shortSidebarToggle } =
  toggleSlice.actions;
export default toggleSlice.reducer;
