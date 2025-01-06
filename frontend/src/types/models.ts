export type UserRole = "teacher" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface Classroom {
  id: string;
  name: string;
  description: string;
  teacherId: string;
  students?: User[];
  createdAt: string;
}

export interface Test {
  id: string;
  title: string;
  content: string;
  timeLimit?: number;
  classroomId: string;
  createdBy: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeSpent: number;
  createdAt: string;
}

// ! NEUE MODELLE, FÜR 16.12.2024

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateClassroomRequest {
  name: string;
  description: string;
}

export interface CreateTestRequest {
  title: string;
  content: string;
  timeLimit?: number;
  classroomId: string;
}

export interface SubmitTestResultRequest {
  testId: string;
  wpm: number;
  accuracy: number;
  mistakes: number;
  timeSpent: number;
}

// TODO: Keine ahnung ob das passt, wir lassens mal so
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
