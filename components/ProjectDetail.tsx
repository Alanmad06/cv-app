import Link from "next/link";
import Image from "next/image";
import { Readme, Repository } from "@/interfaces/repos";

interface ProjectDetailProps {
  projectData: Repository;
  /** README leído en el servidor (ver `app/projects/[name]/page.tsx`). */
  readme: Readme;
}

export default function ProjectDetail({
  projectData,
  readme,
}: ProjectDetailProps) {
  const { content: readmeContent, images: readmeImages } = readme;
  const { name, description, topics, stargazers_count, forks_count, html_url } =
    projectData;

  return (
    <div className="bg-background text-foreground mx-auto max-w-4xl rounded-lg p-6 shadow-lg">
      <div className="mb-6">
        <h1 className="text-foreground mb-2 text-3xl font-bold">{name}</h1>
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          {description || "No description available"}
        </p>

        <div className="mb-4 flex flex-wrap gap-2">
          {topics &&
            topics.map((topic) => (
              <span
                key={topic}
                className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
              >
                {topic}
              </span>
            ))}
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex items-center">
            <span className="mr-2 font-medium">⭐</span>
            <span>{stargazers_count}</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2 font-medium">🍴</span>
            <span>{forks_count}</span>
          </div>
          <Link
            href={html_url}
            target="_blank"
            className="rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            View on GitHub
          </Link>
        </div>
      </div>

      {readmeImages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-foreground mb-4 text-2xl font-bold">
            Project Images
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {readmeImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative h-64 overflow-hidden rounded-lg border-1 border-amber-200"
              >
                <Image
                  src={imageUrl}
                  alt={`Project image ${index + 1}`}
                  className="h-full w-full object-cover"
                  fill
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {readmeContent && (
        <div className="text-foreground mb-6">
          <h2 className="mb-4 text-2xl font-bold">README</h2>
          <div>
            <pre className="rounded-lg bg-[#313131] p-4 whitespace-pre-wrap">
              {readmeContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
