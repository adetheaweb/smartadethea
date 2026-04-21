import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { Quiz, QuizAttempt } from '../types';

export const dataStore = {
  // Listen to quizzes in real-time
  subscribeToQuizzes: (callback: (quizzes: Quiz[]) => void) => {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const quizzes = snapshot.docs.map(doc => doc.data() as Quiz);
      callback(quizzes);
    });
  },

  getQuizzes: async (): Promise<Quiz[]> => {
    const q = query(collection(db, 'quizzes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as Quiz);
  },
  
  saveQuiz: async (quiz: Quiz) => {
    await setDoc(doc(db, 'quizzes', quiz.id), quiz);
  },

  deleteQuiz: async (id: string) => {
    await deleteDoc(doc(db, 'quizzes', id));
  },

  getAttempts: async (studentName?: string): Promise<QuizAttempt[]> => {
    let q = query(collection(db, 'attempts'), orderBy('startTime', 'desc'));
    if (studentName) {
      q = query(collection(db, 'attempts'), where('studentName', '==', studentName), orderBy('startTime', 'desc'));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as QuizAttempt);
  },

  saveAttempt: async (attempt: QuizAttempt) => {
    await setDoc(doc(db, 'attempts', attempt.id), attempt);
  },

  subscribeToAllAttempts: (callback: (attempts: QuizAttempt[]) => void) => {
    const q = query(collection(db, 'attempts'), orderBy('startTime', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const attempts = snapshot.docs.map(doc => doc.data() as QuizAttempt);
      callback(attempts);
    });
  }
};
