import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Skill } from '@/interfaces/skills';
import { fetchSkills as fetchSkillsAction  } from '@/lib/action';

// Estado inicial
interface SkillsState {
  skills: Skill[];
  loading: boolean;
  error: string | null;
}

const initialState: SkillsState = {
  skills: [],
  loading: false,
  error: null,
};

// Thunks para operaciones asíncronas
export const fetchSkills = createAsyncThunk(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      
      const response = await fetchSkillsAction();
      console.log('Response from fetchSkillsAction:', response); // Agrega esta línea para ver la respuesta en la consola
      const skills: Skill[] = response.skills || [];
      
      return skills;
    } catch (error) {
      console.error('Error al cargar las habilidades:', error); // Agrega esta línea para ver el detalle del error en la consola
      return rejectWithValue('Error al cargar las habilidades');
    }
  }
);

export const addSkill = createAsyncThunk(
  'skills/addSkill',
  async (skill: Omit<Skill, 'id'>, { rejectWithValue }) => {
    try {
      // Simulando una llamada a API
      await new Promise(resolve => setTimeout(resolve, 6000));
      
      // Generar un ID único
      const newSkill: Skill = {
        ...skill,
        id: Date.now().toString(),
      };
      
      return newSkill;
    } catch (error) {
      console.error('Error al añadir la habilidad:', error); // Agrega esta línea para ver el detalle del error en la consola
      return rejectWithValue('Error al añadir la habilidad');
    }
  }
);

export const updateSkill = createAsyncThunk(
  'skills/updateSkill',
  async (skill: Skill, { rejectWithValue }) => {
    try {
      // Simulando una llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return skill;
    } catch (error) {
      console.error('Error al editar una skill:',error)
      return rejectWithValue('Error al actualizar la habilidad');
    }
  }
);

export const deleteSkill = createAsyncThunk(
  'skills/deleteSkill',
  async (id: string, { rejectWithValue }) => {
    try {
      // Simulando una llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return id;
    } catch (error) {
      console.error('Error al eliminar una habilidad:',error)
      return rejectWithValue('Error al eliminar la habilidad');
    }
  }
);

// Slice
const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch skills
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action: PayloadAction<Skill[]>) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Add skill
    builder
      .addCase(addSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSkill.fulfilled, (state, action: PayloadAction<Skill>) => {
        state.loading = false;
        state.skills.push(action.payload);
      })
      .addCase(addSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Update skill
    builder
      .addCase(updateSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSkill.fulfilled, (state, action: PayloadAction<Skill>) => {
        state.loading = false;
        const index = state.skills.findIndex(skill => skill.id === action.payload.id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    
    // Delete skill
    builder
      .addCase(deleteSkill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.skills = state.skills.filter(skill => skill.id !== action.payload);
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default skillsSlice.reducer;