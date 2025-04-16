import { fetchProject } from "@/lib/action";
import { Suspense } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectSkeleton from "@/components/ProjectSkeleton";

export default async function Page({params}: {params : Promise<{name:string}> }) {
   const {name} = await params;
   
   return (
    <main className="container mx-auto py-8 px-4">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent name={name} />
      </Suspense>
    </main>
  );
}

async function ProjectContent({ name }: { name: string }) {
  const project = await fetchProject(name);
  
  return <ProjectDetail projectData={project} />;
}