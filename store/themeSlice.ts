"use client"

import { createSlice } from "@reduxjs/toolkit"


interface ThemeState {
    theme: string
}

const initialState : ThemeState = {
    theme: localStorage.getItem('theme') || 'dark' // Valor inicial basado en el almacenamiento local o 'light' por defecto
}
const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers :{
        toggleTheme : (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark'
        }
    }
})

export const {toggleTheme} = themeSlice.actions
export default themeSlice.reducer