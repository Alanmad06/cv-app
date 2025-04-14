'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { addSkill, updateSkill, deleteSkill } from '@/store/skillsSlice';
import { Skill } from '@/interfaces/skills';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function SkillsForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { skills, loading } = useSelector((state: RootState) => state.skills);
  
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [currentSkill, setCurrentSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(50);

  // Escuchar el evento personalizado para abrir el formulario
  useEffect(() => {
    const handleOpenForm = () => setIsFormVisible(true);
    document.addEventListener('openSkillsForm', handleOpenForm);
    return () => document.removeEventListener('openSkillsForm', handleOpenForm);
  }, []);

  const resetForm = () => {
    setSkillName('');
    setSkillLevel(50);
    setFormMode('add');
    setCurrentSkill(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formMode === 'add') {
      dispatch(addSkill({ name: skillName, level: skillLevel }));
    } else if (formMode === 'edit' && currentSkill) {
      dispatch(updateSkill({ ...currentSkill, name: skillName, level: skillLevel }));
    }
    
    resetForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormMode('edit');
    setCurrentSkill(skill);
    setSkillName(skill.name);
    setSkillLevel(skill.level);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta habilidad?')) {
      dispatch(deleteSkill(id));
    }
  };

  if (!isFormVisible) return null;

  return (
    <div className="fixed inset-0 bg-[#0000008f] bg-opacity-50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-main">
            {formMode === 'add' ? 'Add New Skill' : 'Edit Skill'}
          </h2>
          <button 
            onClick={() => setIsFormVisible(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill name
            </label>
            <input
              type="text"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-main"
              placeholder="Enter skill name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skill range: {skillLevel}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={skillLevel}
              onChange={(e) => setSkillLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Beginner</span>
              <span>Proficient</span>
              <span>Expert</span>
              <span>Master</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-main text-white py-2 rounded-md hover:bg-opacity-90 transition-all"
          >
            {loading ? 'Processing...' : formMode === 'add' ? 'Add skill' : 'Update skill'}
          </button>
        </form>

        {skills.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Manage Skills</h3>
            <div className="max-h-60 overflow-y-auto">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{skill.name}</p>
                    <p className="text-sm text-gray-500">{skill.level}%</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}