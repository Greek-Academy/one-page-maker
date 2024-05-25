import {createSlice} from '@reduxjs/toolkit'
import {InitialUserState} from './userType.ts'
import {AsyncState} from "@/redux/asyncState.ts";

const initialState: AsyncState<InitialUserState> = {
    status: 'pending',
    data: {
        displayName: '',
        user: null,
    },
    error: undefined,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.data.user = action.payload
            state.status = 'success'
        },
        logout: (state) => {
            state.status = 'success'
            state.data.user = null
        },
    },
})

export const { login, logout } = userSlice.actions;
export default userSlice.reducer
