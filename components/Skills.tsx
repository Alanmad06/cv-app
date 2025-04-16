'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { fetchSkills } from '@/store/skillsSlice';
import { Skill } from '@/interfaces/skills';
import { logout } from '@/store/authSlice';

// Componente Skeleton para mostrar durante la carga
const SkillSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
      <div className="h-6 bg-gray-200 rounded mb-4"></div>
    </div>
  );
};

// Componente para mostrar una barra de habilidad individual
const SkillBar = ({ skill }: { skill: Skill }) => {
  return (
    <div className="mb-4">
      <div className="bg-[#26C17E] text-white py-1 px-2 rounded-sm inline-block mb-1">
        {skill.name}
      </div>
      <div className="w-full bg-gray-200 rounded-sm h-6 relative">
        <div 
          className="bg-[#26C17E] h-6 rounded-sm" 
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};

// Componente principal de Skills
export default function Skills() {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  return (
    <div className="my-6 p-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-xl md:text-3xl py-4 px-1 font-sans text-main">Skills</h2>
        <div className="flex gap-2 max-h-[80dvh] scroll-auto overflow-y-scroll">
          {isAuthenticated ? (
            <>
              <button 
                className="bg-[#222935] text-white px-3 py-1 rounded-sm hover:bg-opacity-80 transition-all"
                onClick={() => document.dispatchEvent(new CustomEvent('openSkillsForm'))}
              >
                Open edit
              </button>
              <button 
                className="bg-red-600 text-white px-3 py-1 rounded-sm hover:bg-opacity-80 transition-all"
                onClick={() => dispatch(logout())}
              >
                Logout
              </button>
            </>
          ) : (
            <button 
              className="bg-[#26C17E] text-white px-3 py-1 rounded-sm hover:bg-opacity-80 transition-all"
              onClick={() => document.dispatchEvent(new CustomEvent('openLoginForm'))}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkillSkeleton />
      ) : (
        <div>
          {skills.length> 0 && skills.map((skill) => (
            <SkillBar key={skill.id} skill={skill} />
          ))}
          
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Beginner</span>
            <span>Proficient</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
        </div>
      )}
    </div>
  );
}