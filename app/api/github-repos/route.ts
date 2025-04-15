import { NextResponse } from 'next/server';
import type { Portfolio } from '@/interfaces/portfolio';

// GitHub username
const GITHUB_USERNAME = "Alanmad06";

export async function GET() {
  try {
    // Fetch repositories from GitHub API
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    
    const repos = await response.json();
    
    // Filter repos with the specific description format
    const regex = /^[\w\s]+ \| [\w\s.,+-]+ \| .{5,}$/;
    
    const filteredRepos = repos.filter((repo: any) => {
      return repo.description && regex.test(repo.description);
    });
    
    // Transform GitHub repos to Portfolio format with README images
    const portfolioProjects: Portfolio[] = await Promise.all(filteredRepos.map(async (repo: any) => {
      // Parse description: Tipo | Tecnologías | Descripción corta
      const descriptionParts = repo.description.split('|').map((part: string) => part.trim());
      const category = descriptionParts[0].trim();
      const technologies = descriptionParts[1].trim();
      const shortDescription = descriptionParts[2].trim();
      
      // Try to fetch README content to extract image
      let imageUrl = `/assets/portfolio_img_${Math.floor(Math.random() * 2) + 1}.png`; // Default fallback
      
      try {
        // Fetch README content
        const readmeResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/readme`);
        
        if (readmeResponse.ok) {
          const readmeData = await readmeResponse.json();
          // Decode content from base64
          const content = Buffer.from(readmeData.content, 'base64').toString('utf-8');
          
          // Extract image URL using regex
          const imageMatch = content.match(/!\[.*?\]\((https:\/\/.*?)\)/);
          if (imageMatch && imageMatch[1]) {
            imageUrl = imageMatch[1];
          }
        }
      } catch (readmeError) {
        console.error(`Error fetching README for ${repo.name}:`, readmeError);
        // Continue with default image if README fetch fails
      }
      
      return {
        title: repo.name,
        img: imageUrl,
        description: `${shortDescription} (${technologies})`,
        link: repo.html_url,
        category: category
      };
    }));
    
    return NextResponse.json({ projects: portfolioProjects });
  } catch (error) {
    console.error('Error fetching GitHub repositories:', error);
    return NextResponse.json({ error: 'Failed to fetch repositories' }, { status: 500 });
  }
}