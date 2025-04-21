import { configureStore } from '@reduxjs/toolkit'
import skillsReducer from './skillsSlice'
import authReducer from './authSlice'


export const store = configureStore({
  reducer: {
    skills: skillsReducer,
    auth: authReducer,
    
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch