"use client"

import { useEffect } from "react"

import {  } from "@/store/themeSlice"
import { useTheme } from "next-themes"

export default function ThemeInitializer() {
  const { theme,setTheme} = useTheme()
  
  useEffect(() => {
    // Only access localStorage after component has mounted (client-side)
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme)
  }, [setTheme, theme])
  
  return null // This component doesn't render anything
}