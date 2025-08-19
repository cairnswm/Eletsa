export interface User {
  id: number;
  email: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  role: string | null;
  app_id: string;
  permissions: string[];
  vat_number: string | null;
}

export interface AuthResponse {
  message: string;
  id: number;
  email: string;
  username: string | null;
  firstname: string | null;
  lastname: string | null;
  avatar: string | null;
  token: string;
  role: string | null;
  app_id: string;
  permissions: string[];
  vat_number: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceid?: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm: string;
  deviceid?: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface UpdateUserRequest {
  username?: string;
  firstname?: string;
  lastname?: string;
  avatar?: string;
  vat_number?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  hasCompletedProfile: boolean;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (credentials: RegisterRequest) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateUserRequest) => Promise<void>;
  validateToken: () => Promise<void>;
  clearError: () => void;
}