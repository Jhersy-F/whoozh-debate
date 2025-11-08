import {createSlice} from '@reduxjs/toolkit';
export interface showState {
    showmodal:boolean,
    modalname:string
}
const initialState: showState = {
    showmodal:false,
    modalname:""

}
export const modalSlice = createSlice({
    name:'showLogin',
    initialState,
    reducers:{
        showModal:(state,action)=>{
            const {modalname}  = action.payload
            state.showmodal=true
            state.modalname = modalname
        },
        closeModal:(state)=>{
            state.showmodal = false
        },
        changemodalname:(state,action)=>{
            const {modalname}  = action.payload
            state.modalname = modalname
        }
    }
})
export const {showModal,closeModal,changemodalname} = modalSlice.actions;
export default modalSlice.reducer;

