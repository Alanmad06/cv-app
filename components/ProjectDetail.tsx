'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {  Repository } from '@/interfaces/repos';




export default function ProjectDetail({projectData }: {projectData : Repository}) {
  const [readmeContent, setReadmeContent] = useState<string>('');
  const [readmeImages, setReadmeImages] = useState<string[]>([]);
  
  
  useEffect(() => {
    
    if (projectData) {
      // Fetch README content
      fetchReadmeContent(projectData.owner!.login!, projectData.name!);
    }
  }, [projectData]);
  
  const fetchReadmeContent = async (owner: string, repo: string) => {
    try {
      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`);
      
      if (response.ok) {
        const readmeData = await response.json();
        
        // Decode content from base64
        const content = atob(readmeData.content);
        const contentClear = content.match(/\|\s*(.*?[\s\S]*?)(\n*?)\s*\|/);
       
        setReadmeContent(contentClear ? contentClear[1] : '');
        
        // Extract image URLs using regex
        const imageMatches = content.match(/!\[.*?\]\((https:\/\/.*?)\)/g) || [];
        const imageUrls = imageMatches.map(match => {
          const urlMatch = match.match(/!\[.*?\]\((https:\/\/.*?)\)/);
          return urlMatch ? urlMatch[1] : '';
        }).filter(url => url !== '');
        
        setReadmeImages(imageUrls);
      }
    } catch (error) {
      console.error('Error fetching README:', error);
    }
  };
  
  if (!projectData) {
    return <div>No project data available</div>;
  }
  
  const { name, description, topics , stargazers_count, forks_count , html_url} = projectData;
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-background rounded-lg shadow-lg text-foreground">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-foreground">{name}</h1>
        <p className="text-gray-600 mb-4">{description || 'No description available'}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {topics && topics.map((topic: string) => (
            <span key={topic} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {topic}
            </span>
          ))}
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex items-center">
            <span className="font-medium mr-2">⭐</span>
            <span>{stargazers_count}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium mr-2">🍴</span>
            <span>{forks_count}</span>
          </div>
          <Link 
            href={html_url!} 
            target="_blank" 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View on GitHub
          </Link>
        </div>
      </div>
      
      {readmeImages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-foregroundk">Project Images</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readmeImages.map((imageUrl, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden border-1 border-amber-200">
                <Image
                  src={imageUrl} 
                  alt={`Project image ${index + 1}`} 
                  className="object-cover w-full h-full"
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {readmeContent && (
        <div className="mb-6 text-foreground">
          <h2 className="text-2xl font-bold mb-4">README</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap bg-[#313131] p-4 rounded-lg">
              {readmeContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}