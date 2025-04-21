import { fetchProject } from "@/lib/action";
import { Suspense } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectSkeleton from "@/components/ProjectSkeleton";
import { ProjectData } from "@/interfaces/repos";

export default async function Page({params}: {params : Promise<{name:string}> }) {
   const {name} = await params;
   
   return (
    <main className="container min-w-[100vw] h-full py-8 px-5 bg-[#313131]">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent name={name} />
      </Suspense>
    </main>
  );
}

async function ProjectContent({ name }: { name: string }) {
  const project : ProjectData= await fetchProject(name);
  if(project.data !== null) {
    return <ProjectDetail projectData={project.data!} />;
  }
  else {
    return <div>Project not found</div>; 
  }

  
}