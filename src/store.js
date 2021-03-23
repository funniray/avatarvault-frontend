import { configureStore } from '@reduxjs/toolkit'

import loginSlice from './redux_features/loginSlice'

export default configureStore({
    reducer: {
        login: loginSlice
    }
})