import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login as loginAction } from '@/lib/action';

// Estado inicial
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Thunk para login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { user: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await loginAction(credentials);
      return response.access;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return rejectWithValue('Error al iniciar sesión');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<boolean>) => {
        state.loading = false;
        state.isAuthenticated = action.payload;
        if (!action.payload) {
          state.error = 'Credenciales incorrectas';
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;