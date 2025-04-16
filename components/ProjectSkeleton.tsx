'use client';

export default function ProjectSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg animate-pulse">
      {/* Título y descripción */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        
        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 w-16 bg-gray-200 rounded-full"></div>
          ))}
        </div>
        
        {/* Stats y botón */}
        <div className="flex gap-4 mb-6">
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
        </div>
      </div>
      
      {/* Imágenes */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
      
      {/* README */}
      <div className="mb-6">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}