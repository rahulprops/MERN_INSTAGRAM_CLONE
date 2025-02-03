import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null,
    selectedUser:null,
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{

         setAuthUsers:(state,action)=>{
            state.user=action.payload;
         },
         setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload
         }
    }
})
export const {setAuthUsers,setSelectedUser}=authSlice.actions;
export default authSlice.reducer;