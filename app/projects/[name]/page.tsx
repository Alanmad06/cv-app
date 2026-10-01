import { fetchProject, fetchReadme } from "@/lib/github";
import { Suspense } from "react";
import ProjectDetail from "@/components/ProjectDetail";
import ProjectSkeleton from "@/components/ProjectSkeleton";
import { ProjectData } from "@/interfaces/repos";

/** Las páginas de proyecto se regeneran como mucho cada hora (ISR). */
export const revalidate = 3600;

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <main className="container h-full min-w-[100vw] bg-[#313131] px-5 py-8">
      <Suspense fallback={<ProjectSkeleton />}>
        <ProjectContent name={name} />
      </Suspense>
    </main>
  );
}

async function ProjectContent({ name }: { name: string }) {
  const project: ProjectData = await fetchProject(name);
  if (!project.data) {
    return <div>Project not found</div>;
  }

  // El README se lee aquí (servidor) y llega a ProjectDetail como props;
  // antes lo fetcheaba el propio componente en un useEffect, es decir, en
  // el navegador y después del primer pintado.
  const readme = await fetchReadme(project.data.owner.login, project.data.name);
  return <ProjectDetail projectData={project.data} readme={readme} />;
}
