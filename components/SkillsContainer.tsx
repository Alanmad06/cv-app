'use client';
import LoginForm from './LoginForm';
import Skills from './Skills';
import SkillsForm from './SkillsForm';

export default function SkillsContainer({id}:{id:string}) {
  return (
    <section id={id}>
    <LoginForm />
    <Skills />
    <SkillsForm/>
    </section>
    
  );
}