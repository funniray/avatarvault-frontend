import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    loggedIn: false,
    account: {
        grants: {
            upload: false,
            admin: false
        }
    }
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLogin(state, action) {
            state.loggedIn = true;
            state.account = action.payload;
        },

        setLogout(state ,action) {
            state = initialState
        }
    }
})

export const { setLogin, setLogout } = loginSlice.actions

export default loginSlice.reducer