'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Skills from './Skills';
import SkillsForm from './SkillsForm';

export default function SkillsContainer() {
  return (
    <Provider store={store}>
      <Skills />
      <SkillsForm />
    </Provider>
  );
}