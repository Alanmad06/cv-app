"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchSkills } from "@/store/skillsSlice";
import { Skill } from "@/interfaces/skills";
import { logout } from "@/store/authSlice";
import Button from "./ui/Button";
import Disclaimer from "./Disclaimer";

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
      {/* Chip de nombre con el gradiente de acento (mismo par de contraste
          que bg-main: blanco en claro, gray-900 en oscuro). */}
      <div className="bg-accent-gradient mb-1 inline-block rounded-sm px-2 py-1 text-white dark:text-gray-900">
        {skill.name}
      </div>
      {/* El ancho del relleno no es texto: progressbar lo hace legible para
            lectores de pantalla (valor, mínimo, máximo y nombre). El relleno
            usa el gradiente de acento; la pista sigue en gris para que se
            distinga el recorrido. */}
      <div
        className="relative h-6 w-full rounded-sm bg-gray-200 dark:bg-gray-600"
        role="progressbar"
        aria-label={skill.name}
        aria-valuenow={skill.level}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="bg-accent-gradient h-6 rounded-sm"
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
        <h2 className="gradient-text py-4 font-sans text-xl font-semibold md:text-3xl">
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
              className="bg-accent-gradient rounded-sm px-3 py-1 text-white hover:brightness-110 dark:text-gray-900"
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
          <div className="scrollbar-thumb-main scrollbar-track-scrollbar max-h-[50dvh] scrollbar-thin overflow-y-scroll pr-2">
            {skills.length > 0 &&
              skills.map((skill) => <SkillBar key={skill.id} skill={skill} />)}
          </div>
          <div className="mt-2 flex justify-between text-sm text-gray-600 dark:text-gray-300">
            <span>Beginner</span>
            <span>Proficient</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
        </>
      )}

      {/* Fuera del ternario de loading a propósito: el aviso debe verse
          también mientras las skills cargan. */}
      <Disclaimer className="mt-4">
        These skills may not be 100% up to date — download the CV to see the
        full list.
      </Disclaimer>
    </div>
  );
}
