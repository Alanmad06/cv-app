"use client"
import React, { useEffect , useState } from "react";
import { useTheme } from "next-themes";

export default function ToggleButton({
    iconFirst, iconLast }: { iconFirst: React.ReactNode, iconLast: React.ReactNode }) {

    const { theme, setTheme } = useTheme();

    const handleToggle = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    },[])

    if (!mounted) {
        return null;
    }

    return (
        <div className="flex justify-center items-center">
            <button 
                onClick={handleToggle}
                className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out"
            >
                <span className="sr-only">Toggle theme</span>
                <div
                    className={`${
                        theme === 'dark' ? 'translate-x-6 bg-white text-black' : 'translate-x-1 bg-gray-700 text-white'
                    } inline-flex items-center justify-center w-4 h-4 transform rounded-full transition-transform duration-300 ease-in-out`}
                >
                    {theme === 'dark' ? iconFirst : iconLast}
                </div>
            </button>
            <input 
                type="checkbox" 
                checked={theme === 'dark'}
                onChange={handleToggle} 
                className="hidden"
            />
        </div>
    );

}

