"use client";

export default function ProjectSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse rounded-lg bg-white p-6 shadow-lg">
      {/* Título y descripción */}
      <div className="mb-6">
        <div className="mb-4 h-8 w-3/4 rounded bg-gray-200"></div>
        <div className="mb-2 h-4 w-full rounded bg-gray-200"></div>
        <div className="mb-4 h-4 w-5/6 rounded bg-gray-200"></div>

        {/* Topics */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 rounded-full bg-gray-200"></div>
          ))}
        </div>

        {/* Stats y botón */}
        <div className="mb-6 flex gap-4">
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="h-8 w-16 rounded bg-gray-200"></div>
          <div className="h-10 w-32 rounded-md bg-gray-200"></div>
        </div>
      </div>

      {/* Imágenes */}
      <div className="mb-6">
        <div className="mb-4 h-8 w-1/3 rounded bg-gray-200"></div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 rounded-lg bg-gray-200"></div>
          ))}
        </div>
      </div>

      {/* README */}
      <div className="mb-6">
        <div className="mb-4 h-8 w-1/4 rounded bg-gray-200"></div>
        <div className="h-64 rounded-lg bg-gray-200"></div>
      </div>
    </div>
  );
}
