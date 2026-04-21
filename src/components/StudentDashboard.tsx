import React, { useState } from 'react';
import { Search, Play, History, GraduationCap, ArrowRight, LogOut, Clock } from 'lucide-react';
import { Button, Card, Input, Badge } from './UI';
import { Quiz, QuizAttempt } from '../types';

interface StudentDashboardProps {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  onStartQuiz: (quiz: Quiz) => void;
  onLogout: () => void;
  studentName: string;
}

export function StudentDashboard({ quizzes, attempts, onStartQuiz, onLogout, studentName }: StudentDashboardProps) {
  const [search, setSearch] = useState('');

  const filteredQuizzes = quizzes.filter(q => 
    q.status === 'published' && 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-60 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-none flex items-center justify-center font-bold text-lg">S</div>
          <span className="font-bold tracking-tight text-xl uppercase">Smartadethea</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <div className="p-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Siswa</div>
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-slate-800 rounded-none text-sm border border-slate-700/50">
            <Play className="h-4 w-4 text-indigo-400" />
            <span>Cari Ujian</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-slate-400 hover:text-white transition-colors text-sm group">
            <History className="h-4 w-4 group-hover:text-indigo-400" />
            <span>Riwayat Nilai</span>
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-none bg-indigo-500 flex items-center justify-center font-bold text-white text-xs">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{studentName}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pelajar</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800 border-none" size="sm" icon={LogOut} onClick={onLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800">Ujian Tersedia</h1>
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input 
              className="pl-9 h-9" 
              placeholder="Cari judul ujian..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <section className="mb-12">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">
              Daftar Ujian Aktif
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredQuizzes.map(quiz => {
                const hasAttempted = attempts.some(a => a.quizId === quiz.id);
                return (
                  <Card key={quiz.id} className="group hover:border-indigo-300 transition-colors">
                    <div className="p-4 flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant={hasAttempted ? 'success' : 'info'}>
                            {hasAttempted ? 'Selesai' : 'Siap'}
                          </Badge>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {quiz.durationMinutes}m
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{quiz.title}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{quiz.description}</p>
                      </div>
                      
                      <Button 
                        size="sm"
                        variant={hasAttempted ? 'outline' : 'primary'}
                        className="shrink-0 font-bold"
                        onClick={() => onStartQuiz(quiz)}
                      >
                        {hasAttempted ? 'HASIL' : 'MULAI'}
                      </Button>
                    </div>
                  </Card>
                );
              })}
              {filteredQuizzes.length === 0 && (
                <div className="col-span-full py-16 text-center bg-white rounded-lg border-2 border-dashed border-slate-200">
                  <Play className="mx-auto h-10 w-10 text-slate-200 mb-3" />
                  <p className="text-sm text-slate-400 font-medium">Tidak ada ujian yang sesuai.</p>
                </div>
              )}
            </div>
          </section>

          {attempts.length > 0 && (
            <section>
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">
                Riwayat Skor Anda
              </h2>
              <div className="space-y-2">
                {attempts.map(attempt => {
                  const quiz = quizzes.find(q => q.id === attempt.quizId);
                  return (
                    <div key={attempt.id} className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-xs hover:border-slate-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-emerald-50 rounded-md flex items-center justify-center text-emerald-600 border border-emerald-100 shrink-0">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{quiz?.title || 'Ujian Terhapus'}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(attempt.endTime || 0).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0 px-4 py-2 bg-slate-50 rounded-md border border-slate-100 flex items-center gap-3">
                        <div className="text-sm font-black text-indigo-600 leading-none">{attempt.score} <span className="text-[10px] text-slate-400">/ {attempt.maxScore}</span></div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400">SKOR</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
