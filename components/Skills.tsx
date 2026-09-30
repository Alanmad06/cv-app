"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSkills } from "@/store/skillsSlice";
import { Skill } from "@/interfaces/skills";
import { logout } from "@/store/authSlice";
import Button from "./ui/Button";

// Componente Skeleton para mostrar durante la carga
const SkillSkeleton = () => {
  return (
    <div className="animate-pulse pr-2">
      <div className="mb-2 h-[32px] w-[57px] rounded bg-gray-200"></div>
      <div className="mb-4 h-[24px] w-full rounded bg-gray-200"></div>
      <div className="mb-2 h-[32px] w-[57px] rounded bg-gray-200"></div>
      <div className="mb-4 h-[24px] w-full rounded bg-gray-200"></div>
      <div className="mb-2 h-[32px] w-[57px] rounded bg-gray-200"></div>
      <div className="mb-4 h-[24px] w-full rounded bg-gray-200"></div>
      <div className="mb-2 h-[32px] w-[57px] rounded bg-gray-200"></div>
      <div className="mb-4 h-[24px] w-full rounded bg-gray-200"></div>
    </div>
  );
};

// Componente para mostrar una barra de habilidad individual
const SkillBar = ({ skill }: { skill: Skill }) => {
  return (
    <div className="mb-4">
      <div className="mb-1 inline-block rounded-sm bg-[#26C17E] px-2 py-1 text-white">
        {skill.name}
      </div>
      <div className="relative h-6 w-full rounded-sm bg-gray-200">
        <div
          className="h-6 rounded-sm bg-[#26C17E]"
          style={{ width: `${skill.level}%` }}
        ></div>
      </div>
    </div>
  );
};

// Componente principal de Skills
interface SkillsProps {
  /** Abre el modal de login (estado en el padre, no eventos globales). */
  onOpenLogin: () => void;
  /** Abre el modal de edición de skills (estado en el padre). */
  onOpenSkillsForm: () => void;
}

export default function Skills({ onOpenLogin, onOpenSkillsForm }: SkillsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchSkills());
  }, [dispatch]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-main py-4 font-sans text-xl font-semibold md:text-3xl">
          Skills
        </h2>
        <div className="flex gap-2">
          {isAuthenticated ? (
            <>
              <Button
                className="rounded-sm bg-[#222935] px-3 py-1 text-white hover:bg-[#222935]/80"
                onClick={onOpenSkillsForm}
              >
                Open edit
              </Button>
              <Button
                className="rounded-sm bg-red-600 px-3 py-1 text-white hover:bg-red-600/80"
                onClick={() => dispatch(logout())}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              className="rounded-sm bg-[#26C17E] px-3 py-1 text-white hover:bg-[#26C17E]/80"
              onClick={onOpenLogin}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <SkillSkeleton />
      ) : (
        <>
          <div className="scrollbar-thin scrollbar-thumb-main scrollbar-track-scrollbar max-h-[50dvh] overflow-y-scroll pr-2">
            {skills.length > 0 &&
              skills.map((skill) => <SkillBar key={skill.id} skill={skill} />)}
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>Beginner</span>
            <span>Proficient</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
        </>
      )}
    </div>
  );
}
