import {createSlice} from '@reduxjs/toolkit';
export interface showState {
    showRegister:boolean,
}
const initialState: showState = {
    showRegister:false

}
export const registerModalSlice = createSlice({
    name:'showRegister',
    initialState,
    reducers:{
        showRegister:(state)=>{
            state.showRegister=true
        },
        closeRegister:(state)=>{
            state.showRegister = false
        }
    }
})
export const {showRegister,closeRegister} = registerModalSlice.actions;
export default registerModalSlice.reducer;

