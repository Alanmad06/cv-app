"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import type { Portfolio } from "@/interfaces/portfolio";

const projects : Portfolio[] = [
    { title: "Project 1", img: "/assets/portfolio_img_1.png", description: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dolorum quia praesentium suscipit beatae porro et? Eligendi dolorem enim animi sapiente eveniet doloribus ratione similique nam voluptatem? Sapiente similique in ducimus!", link: "URL_ADDRESS.com/yourusername/project1", category: "Web Development" },
    { title: "Project 2", img: "/assets/portfolio_img_2.png", description: "Description 2", link: "URL_ADDRESS.com/yourusername/project2", category: "Web Development" },
    { title: "Project 3", img: "/assets/portfolio_img_1.png", description: "Description 3", link: "URL_ADDRESS.com/yourusername/project3", category: "Backend Development" },
];

export default function Portfolio() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    // Memorizar la lista de categorías para evitar recálculos innecesarios
    const categories = useMemo(() => {
        const uniqueCategories = new Set(projects.map(project => project.category));
        return ["All", ...uniqueCategories];
    }, []);
    
    // Memorizar los proyectos filtrados para mejorar el rendimiento
    const filteredProjects = useMemo(() => {
        if (selectedCategory === "All") {
            return projects;
        }
        return projects.filter(project => project.category === selectedCategory);
    }, [selectedCategory]);

    // Componente de proyecto para evitar duplicación de código
    const ProjectItem = ({ project , index  }:{project : Portfolio, index: number}) => (
        <div key={index} className="relative min-h-40 mx-2 overflow-hidden group transition-all duration-300 ease-in-out">
            <div className="absolute inset-0 z-10 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <Image 
                    src={project.img}
                    alt={project.title}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="relative flex flex-col justify-between items-start p-5 h-full font-sans">
                <h2 className="text-main font-bold">{project.title}</h2>
                <p className="text-start py-2">{project.description}</p>
                <Link className="text-sm underline text-main" href={project.link}>View Project</Link>
            </div>
        </div>
    );

    return (
        <div className="pb-10">
            {/* Botones de filtrado con estado activo */}
            <div className="flex flex-wrap mb-4">
                {categories.map((category) => (
                    <button 
                        className={`p-2 m-2 transition-colors duration-300 ${selectedCategory === category ? 'bg-main text-white' : 'bg-gray-200 hover:bg-main/70'}`} 
                        key={category} 
                        onClick={() => setSelectedCategory(category)}
                        aria-pressed={selectedCategory === category}
                    >
                        {category}
                    </button>
                ))}
            </div>
            
            {/* Grid de proyectos con animación */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-center">
                {filteredProjects.map((project, index) => (
                    <ProjectItem project={project} index={index} key={index} />
                ))}
            </div>
        </div>
    );
}