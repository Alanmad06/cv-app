"use server";

import { Skill } from "@/interfaces/skills";
import { z } from "zod";
import prisma from "./prisma";


const skillSchema = z.object({
  skill: z.string(),
  level: z.number().gt(0, {
    message: "El nivel debe ser mayor a 0",
  }),
});

const loginSchema = z.object({
  user: z.string(),
  password: z.string(),
});

export const fetchSkills = async () => {
  try {
    const skills: Skill[] = await prisma.skill.findMany();

    return { skills };
  } catch (error) {
    return { error };
  }
};

export const addSkill = async (skill: Omit<Skill, "id">) => {
  const result = skillSchema.safeParse(skill);
  if (!result.success) {
    return { error: result.error };
  }
  const { skill: skillName, level } = result.data;

  try {
    const newSkill = await prisma.skill.create({
      data: {
        name: skillName,
        level,
      },
    });
    return { newSkill };
  } catch (error) {
    return { error };
  }
};

export const updateSkill = async (skill: Skill) => {
  const result = skillSchema.safeParse(skill);
  if (!result.success) {
    return { error: result.error };
} 

  const { skill: skillName, level } = result.data;
  try {
    const updatedSkill = await prisma.skill.update({
      where: {
        id: skill.id,
      },
      data: {
        name: skillName,
        level,
      },
    }); 
    return { updatedSkill };

  }
  catch (error) {
    return { error }; 
  }
}

export const deleteSkill = async (id: string) => {
  try {
    const deletedSkill = await prisma.skill.delete({
      where: {
        id,
      },
    });
    return { deletedSkill };
  } catch (error) {
    return { error };
  }
};

export const login = async ({
  user,
  password,
}: {
  user: string;
  password: string;
}) => {
  const result = loginSchema.safeParse({ user, password });
  if (!result.success) {
    return { access: false };
  }

  const { user: userV, password: passwordV } = result.data;

  if (userV === process.env.USER && passwordV === process.env.PASSWORD) {
    return { access: true };
  }
  return { access: false };
};
