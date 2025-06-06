"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "./Button";
import Navigation from "./Navigation";
import PhotoBox from "./PhotoBox";
import { faChevronLeft, faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function Panel() {
    const [isPanelVisible, setIsPanelVisible] = useState(false);

    return (
        <div className="relative text-white">
            {/* Hamburger menu button */}
            <label className="fixed top-[1%] left-[1%] z-50 cursor-pointer text-foreground  p-2 rounded-md hover:bg-opacity-80 transition-all">
                <input
                    type="checkbox"
                    className="hidden"
                    checked={isPanelVisible}
                    onChange={() => setIsPanelVisible(!isPanelVisible)}
                />
                <FontAwesomeIcon 
                    icon={isPanelVisible ? faXmark : faBars} 
                    className={` text-xl`}
                />
            </label>

            {/* Panel that slides in and out */}
            <div className={`fixed min-w-[70px] top-0 left-0 h-full max-w-[25vw]  bg-[#222935] shadow-lg transition-transform duration-300 ease-in-out z-40 ${
                isPanelVisible ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex flex-col justify-between h-full p-[1%] pt-16 ">
                    <div>
                        <PhotoBox 
                            name="Alan " 
                            title="Programmer. Creative. Innovator" 
                            description=" Software Engineer Student" 
                            avatar="https://avatars.githubusercontent.com/u/130498439?v=4" 
                            className="text-white"
                        />
                        <Navigation />
                    </div>
                    <Button
                        icon={<FontAwesomeIcon icon={faChevronLeft} size="xs" />}
                        text="Go Home"
                        className="bg-[#10141b] text-white"
                        link="/portfolio"
                    />
                </div>
            </div>
            
            {/* Overlay that appears when menu is open */}
          
        </div>
    );
}