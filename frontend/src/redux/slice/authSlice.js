import { createSlice } from "@reduxjs/toolkit";

const initialState={
    user:null
}
const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{

         setAuthUsers:(state,action)=>{
            state.user=action.payload;
         }
    }
})
export const {setAuthUsers}=authSlice.actions;
export default authSlice.reducer;