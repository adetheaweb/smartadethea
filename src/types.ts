export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[]; // Only for multiple_choice
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  durationMinutes: number;
  startTime: number | null;
  endTime: number | null;
  questions: Question[];
  status: 'draft' | 'published' | 'closed';
  createdAt: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, string>; // questionId -> answer
  score: number;
  maxScore: number;
  startTime: number;
  endTime: number | null;
  status: 'in_progress' | 'submitted';
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'teacher' | 'student';
}
