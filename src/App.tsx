/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { GraduationCap, BookOpen, ChevronRight, LogOut } from 'lucide-react';
import { Button, Card, Input } from './components/UI';
import { TeacherDashboard } from './components/TeacherDashboard';
import { QuizCreator } from './components/QuizCreator';
import { StudentDashboard } from './components/StudentDashboard';
import { ExamMode } from './components/ExamMode';
import { ResultView } from './components/ResultView';
import { Quiz, QuizAttempt } from './types';
import { dataStore } from './services/store';
import { auth } from './services/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

type View = 'login' | 'teacher_dash' | 'quiz_creator' | 'student_dash' | 'exam_mode' | 'result_view';

export default function App() {
  const [view, setView] = useState<View>('login');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [latestAttempt, setLatestAttempt] = useState<QuizAttempt | null>(null);
  const [userName, setUserName] = useState('');
  const [user, setUser] = useState<User | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Quizzes
  useEffect(() => {
    const unsubscribe = dataStore.subscribeToQuizzes((updatedQuizzes) => {
      setQuizzes(updatedQuizzes);
    });
    return () => unsubscribe();
  }, []);

  // Real-time All Attempts (for teacher)
  useEffect(() => {
    const unsubscribe = dataStore.subscribeToAllAttempts((updatedAttempts) => {
      setAllAttempts(updatedAttempts);
    });
    return () => unsubscribe();
  }, []);

  // Load attempts when student name changes
  useEffect(() => {
    if (userName) {
      dataStore.getAttempts(userName).then(setAttempts);
    } else {
      setAttempts([]);
    }
  }, [userName]);

  const handleTeacherLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setView('teacher_dash');
    } catch (error) {
      console.error(error);
      toast.error('Gagal login. Pastikan Anda memiliki koneksi internet.');
    }
  };

  const handleSaveQuiz = async (quizData: Partial<Quiz>) => {
    const newQuiz: Quiz = {
      id: Math.random().toString(36).substr(2, 9),
      teacherId: user?.uid || 'anonymous-teacher',
      title: quizData.title || 'Untitled',
      description: quizData.description || '',
      durationMinutes: quizData.durationMinutes || 60,
      questions: quizData.questions || [],
      status: 'published',
      createdAt: Date.now(),
      startTime: null,
      endTime: null
    };
    
    try {
      await dataStore.saveQuiz(newQuiz);
      setView('teacher_dash');
      toast.success('Ujian berhasil diterbitkan!');
    } catch (error) {
      toast.error('Gagal menyimpan ujian. Periksa izin akses.');
    }
  };

  const handleCompleteExam = async (attempt: QuizAttempt) => {
    try {
      await dataStore.saveAttempt(attempt);
      setLatestAttempt(attempt);
      // Re-fetch attempts for this student
      const updatedAttempts = await dataStore.getAttempts(userName);
      setAttempts(updatedAttempts);
      setView('result_view');
    } catch (error) {
      toast.error('Gagal menyimpan hasil ujian.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setView('login');
  };

  const renderView = () => {
    switch (view) {
      case 'login':
        return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
            
            <div className="max-w-md w-full z-10">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-xl shadow-xl mb-6 ring-4 ring-white">
                  <GraduationCap className="h-8 w-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-2">Smartadethea</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sistem Ujian Online Modern & Cerdas</p>
              </div>

              <div className="space-y-4">
                <Card className="p-6 border-slate-200 shadow-xl hover:shadow-2xl transition-all cursor-pointer group bg-white" onClick={handleTeacherLogin}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-white group-hover:bg-indigo-600 transition-colors shadow-lg">
                        <BookOpen className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Masuk sebagai Guru</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kelola Bank Soal & Ujian</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </Card>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xl space-y-6">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Akses Siswa</label>
                    <Input 
                      className="h-12 text-base font-bold text-slate-800 placeholder:font-medium placeholder:text-slate-300"
                      placeholder="Masukkan nama lengkap Anda..." 
                      value={userName}
                      onChange={e => setUserName(e.target.value)}
                    />
                  </div>
                  <Button 
                    className="w-full h-12 text-sm font-black uppercase tracking-widest shadow-indigo-500/20 shadow-lg" 
                    disabled={!userName}
                    onClick={() => setView('student_dash')}
                  >
                    Mulai Kerjakan Ujian
                  </Button>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-center gap-6 opacity-40">
                <div className="h-[1px] flex-1 bg-slate-300"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                  Integrated with Gemini AI
                </p>
                <div className="h-[1px] flex-1 bg-slate-300"></div>
              </div>
            </div>
          </div>
        );

      case 'teacher_dash':
        if (!user) { setView('login'); return null; }
        return (
          <TeacherDashboard 
            quizzes={quizzes} 
            attempts={allAttempts}
            onCreateNew={() => setView('quiz_creator')} 
            onLogout={handleLogout}
          />
        );

      case 'quiz_creator':
        return <QuizCreator onSave={handleSaveQuiz} onCancel={() => setView('teacher_dash')} />;

      case 'student_dash':
        return (
          <StudentDashboard 
            quizzes={quizzes}
            attempts={attempts}
            studentName={userName}
            onLogout={() => setView('login')}
            onStartQuiz={(q) => {
              setActiveQuiz(q);
              setView('exam_mode');
            }}
          />
        );

      case 'exam_mode':
        if (!activeQuiz) return null;
        return (
          <ExamMode 
            quiz={activeQuiz}
            studentName={userName}
            onComplete={handleCompleteExam}
          />
        );

      case 'result_view':
        if (!latestAttempt) return null;
        return (
          <ResultView 
            attempt={latestAttempt}
            onRetry={() => setView('exam_mode')}
            onHome={() => setView('student_dash')}
          />
        );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="antialiased text-gray-900 font-sans">
      {renderView()}
      <Toaster position="top-right" />
    </div>
  );
}

