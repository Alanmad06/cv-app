"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addSkill, updateSkill, deleteSkill } from "@/store/skillsSlice";
import { Skill } from "@/interfaces/skills";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

interface SkillsFormProps {
  /** Visibilidad del modal, controlada por el padre. */
  open: boolean;
  onClose: () => void;
}

export default function SkillsForm({ open, onClose }: SkillsFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);

  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillLevel, setSkillLevel] = useState(50);

  const resetForm = () => {
    setSkillName("");
    setSkillLevel(50);
    setFormMode("add");
    setCurrentSkill(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formMode === "add") {
      dispatch(addSkill({ name: skillName, level: skillLevel }));
    } else if (formMode === "edit" && currentSkill) {
      dispatch(
        updateSkill({ ...currentSkill, name: skillName, level: skillLevel }),
      );
    }

    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormMode("edit");
    setCurrentSkill(skill);
    setSkillName(skill.name);
    setSkillLevel(skill.level);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta habilidad?")
    ) {
      dispatch(deleteSkill(id));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={formMode === "add" ? "Add New Skill" : "Edit Skill"}
      panelClassName="bg-background bg-surface-gradient"
      titleClassName="gradient-text"
      closeClassName="text-foreground hover:text-gray-700"
      closeLabel="Close"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="skill-name"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Skill name
          </label>
          <input
            id="skill-name"
            type="text"
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="text-foreground focus:ring-main w-full rounded-md border border-gray-500 px-3 py-2 focus:ring-1 focus:outline-none dark:border-gray-400"
            placeholder="Enter skill name"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="skill-level"
            className="text-foreground mb-1 block text-sm font-medium"
          >
            Skill range: {skillLevel}%
          </label>
          <input
            id="skill-level"
            type="range"
            min="0"
            max="100"
            value={skillLevel}
            onChange={(e) => setSkillLevel(parseInt(e.target.value))}
            className="focus:ring-main h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 focus:ring-2 focus:outline-none dark:bg-gray-600"
          />
          <div className="mt-1 flex justify-between text-xs text-gray-600 dark:text-gray-300">
            <span>Beginner</span>
            <span>Proficient</span>
            <span>Expert</span>
            <span>Master</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-main hover:bg-main/90 w-full rounded-md py-2 text-white disabled:opacity-50 dark:text-gray-900"
        >
          {loading
            ? "Processing..."
            : formMode === "add"
              ? "Add skill"
              : "Update skill"}
        </Button>
      </form>

      {skills.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-medium">Manage Skills</h3>
          <div className="scrollbar-thumb-main scrollbar-track-scrollbar max-h-60 scrollbar-thin overflow-y-auto pr-2">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {skill.level}%
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(skill)}
                    aria-label={`Edit ${skill.name}`}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <FontAwesomeIcon icon={faEdit} aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(skill.id)}
                    aria-label={`Delete ${skill.name}`}
                    className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                  >
                    <FontAwesomeIcon icon={faTrash} aria-hidden />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}
