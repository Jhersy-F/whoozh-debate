import {createSlice} from '@reduxjs/toolkit';
export interface showState {
    loading:boolean,
    reload:boolean
}
const initialState: showState = {
    loading:false,
    reload:false

}
export const commentModalSlice = createSlice({
    name:'commentReload',
    initialState,
    reducers:{
        setLoading:(state, action)=>{
            state.loading= action.payload
        },
        setReload:(state, action)=>{
            state.reload = action.payload
    },
}
})
export const {setLoading, setReload} = commentModalSlice.actions;
export default commentModalSlice.reducer;

