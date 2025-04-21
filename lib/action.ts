"use server";

import { Skill } from "@/interfaces/skills";
import { z } from "zod";
import prisma from "./prisma";
import { ProjectData, Repository } from "@/interfaces/repos";


const skillSchema = z.object({
  name: z.string(),
  level: z.number().gt(0, {
    message: "El nivel debe ser mayor a 0",
  }).positive(),
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
  console.log(result)
  if (!result.success) {
    console.log(result.error);
    return { error: result.error };
  }
  const { name: skillName, level } = result.data;

  console.log(skillName, level);
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

  const { name: skillName, level } = result.data;
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
    console.log(user, password);
  const result = loginSchema.safeParse({ user, password });
  if (!result.success) {
    return { access: false };
  }

  const { user: userV, password: passwordV } = result.data;
  console.log(userV,passwordV)
  console.log(process.env.USER, process.env.PASSWORD);
  
  if (userV === process.env.USER && passwordV === process.env.PASSWORD) {
    return { access: true };
  }
  return { access: false };
};

export const fetchProject = async (title: string): Promise<ProjectData> => {

  try {
    const response = await fetch(`https://api.github.com/repos/Alanmad06/${title}`)
    const data : Repository= await response.json() 
    return { data }
  }catch(error){
    return {error}
  }

}