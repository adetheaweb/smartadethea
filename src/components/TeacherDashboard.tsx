import React, { useState } from 'react';
import { Plus, BookOpen, Users, LogOut, ChevronRight, Clock, ClipboardList, Search, GraduationCap } from 'lucide-react';
import { Button, Card, Badge, Input } from './UI';
import { Quiz, QuizAttempt, Question } from '../types';
import { cn } from '../lib/utils';

interface TeacherDashboardProps {
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  onCreateNew: () => void;
  onLogout: () => void;
}

type Tab = 'quizzes' | 'bank' | 'students' | 'results';

export function TeacherDashboard({ quizzes, attempts, onCreateNew, onLogout }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('quizzes');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived Data
  const allQuestions: { quizTitle: string, question: Question }[] = quizzes.flatMap(quiz => 
    quiz.questions.map(q => ({ quizTitle: quiz.title, question: q }))
  );

  const uniqueStudents = Array.from(new Set(attempts.map(a => a.studentName))).map(name => {
    const studentAttempts = attempts.filter(a => a.studentName === name);
    return {
      name,
      totalExams: studentAttempts.length,
      avgScore: Math.round(studentAttempts.reduce((acc, curr) => acc + curr.score, 0) / studentAttempts.length),
      lastExam: studentAttempts[0].startTime
    };
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'quizzes':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-50 rounded-none">
                    <ClipboardList className="h-6 w-6 text-indigo-500" />
                  </div>
                  <Badge variant="success">Aktif</Badge>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{quizzes.length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Total Paket Ujian</div>
              </div>
              
              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-50 rounded-none">
                    <Users className="h-6 w-6 text-emerald-500" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">{uniqueStudents.length}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Siswa Terdaftar</div>
              </div>

              <div className="bg-white p-6 rounded-none border border-slate-200 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-50 rounded-none">
                    <GraduationCap className="h-6 w-6 text-amber-500" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {attempts.length > 0 
                    ? Math.round(attempts.reduce((acc, curr) => acc + curr.score, 0) / attempts.length) 
                    : '--'}
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Rata-rata Nilai</div>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-indigo-500"></div>
                  Daftar Ujian Tersedia
                </h2>
                <div className="relative w-64 uppercase">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
                  <Input 
                    placeholder="Cari ujian..." 
                    className="pl-9 h-9 text-[10px] font-black tracking-widest placeholder:text-slate-300"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {quizzes.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase())).map(quiz => (
                  <Card key={quiz.id} className="hover:border-indigo-400 transition-all cursor-pointer group shadow-xs">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant={quiz.status === 'published' ? 'success' : 'info'}>
                          {quiz.status === 'published' ? 'AKtif' : 'Draft'}
                        </Badge>
                        <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock className="w-3 h-3 mr-1.5 text-indigo-400" />
                          {quiz.durationMinutes} Menit
                        </div>
                      </div>
                      <h3 className="text-sm font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{quiz.title}</h3>
                      <p className="text-[11px] font-bold text-slate-500 mb-5 line-clamp-2 h-8 leading-relaxed uppercase tracking-tight">{quiz.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <div className="text-[10px] font-black text-indigo-600 tracking-widest uppercase">
                          {quiz.questions.length} Butir Soal
                        </div>
                        <div className="text-[9px] text-slate-300 font-black uppercase tracking-wider">
                          {new Date(quiz.createdAt).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'bank':
        return (
          <div className="space-y-6">
            <header className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-4 h-[2px] bg-indigo-500"></div>
                Koleksi Bank Soal
              </h2>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Total: {allQuestions.length} Pertanyaan
              </div>
            </header>
            <div className="space-y-3">
              {allQuestions.filter(q => q.question.text.toLowerCase().includes(searchQuery.toLowerCase())).map((item, idx) => (
                <div key={idx} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex items-start gap-5 group hover:border-indigo-400 transition-all">
                  <div className="w-10 h-10 shrink-0 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-lg">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="info">{item.quizTitle}</Badge>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.question.points} Poin</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed uppercase tracking-tight">{item.question.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <header className="flex items-center justify-between text-slate-400 uppercase tracking-widest text-[10px] font-black">
              <span>Daftar Siswa Terdaftar</span>
              <span>Total: {uniqueStudents.length} Siswa</span>
            </header>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Siswa</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ujian Diikuti</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Rata-rata Nilai</th>
                      <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Aktivitas Terakhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {uniqueStudents.map(student => (
                      <tr key={student.name} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xs">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge variant="info">{student.totalExams} EXAMS</Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn(
                            "text-sm font-black tracking-tight",
                            student.avgScore >= 75 ? "text-emerald-600" : "text-amber-600"
                          )}>{student.avgScore}/100</span>
                        </td>
                        <td className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(student.lastExam).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        );

      case 'results':
        return (
          <div className="space-y-6">
            <header className="flex items-center justify-between text-slate-400 uppercase tracking-widest text-[10px] font-black">
              <span>Rekapitulasi Hasil Ujian</span>
              <span>Total: {attempts.length} Record</span>
            </header>
            <div className="space-y-3">
              {attempts.map(attempt => {
                const quiz = quizzes.find(q => q.id === attempt.quizId);
                return (
                  <Card key={attempt.id} className="p-4 border-l-4 border-l-indigo-500">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{attempt.studentName}</h4>
                          <div className="h-3 w-px bg-slate-200"></div>
                          <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{quiz?.title || 'Unknown Quiz'}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Selesai pada: {new Date(attempt.startTime).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900 tracking-tighter">{attempt.score}<span className="text-xs text-slate-400 font-bold tracking-normal ml-1">/{attempt.maxScore}</span></div>
                        <Badge variant={attempt.score / (attempt.maxScore || 1) >= 0.7 ? 'success' : 'warning'}>
                          {attempt.score / (attempt.maxScore || 1) >= 0.7 ? 'PASS' : 'FAIL'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0">
        <div className="p-8 pb-10 flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-none flex items-center justify-center font-black text-xl shadow-lg rotate-3">S</div>
          <div>
            <span className="font-black tracking-tighter text-2xl uppercase block leading-none">Smartadethea</span>
            <span className="text-[8px] font-black text-white/30 uppercase tracking-[0.3em]">Administrator</span>
          </div>
        </div>
        <nav className="flex-1 px-5 space-y-1">
          <div className="p-3 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-2 border-b border-white/5">Utama</div>
          
          <button 
            onClick={() => setActiveTab('quizzes')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === 'quizzes' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <ClipboardList className={cn("h-4 w-4", activeTab === 'quizzes' ? "text-white" : "text-white/20")} />
            <span>Semua Ujian</span>
          </button>

          <button 
            onClick={() => setActiveTab('bank')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === 'bank' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <BookOpen className={cn("h-4 w-4", activeTab === 'bank' ? "text-white" : "text-white/20")} />
            <span>Bank Soal</span>
          </button>

          <button 
            onClick={() => setActiveTab('students')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === 'students' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <Users className={cn("h-4 w-4", activeTab === 'students' ? "text-white" : "text-white/20")} />
            <span>Daftar Siswa</span>
          </button>

          <div className="p-3 text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mt-8 mb-2 border-b border-white/5">Laporan</div>
          
          <button 
            onClick={() => setActiveTab('results')}
            className={cn(
              "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
              activeTab === 'results' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            <ClipboardList className={cn("h-4 w-4", activeTab === 'results' ? "text-white" : "text-white/20")} />
            <span>Hasil Ulangan</span>
          </button>
        </nav>
        
        <div className="p-6 border-t border-white/5">
          <Button variant="ghost" className="w-full justify-start text-white/40 hover:text-white hover:bg-white/5 border-none font-black text-[10px] tracking-widest uppercase" size="sm" icon={LogOut} onClick={onLogout}>
            KELUAR SISTEM
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-10 shrink-0 shadow-sm relative z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              {activeTab === 'quizzes' && 'Manajemen Ujian'}
              {activeTab === 'bank' && 'Repository Bank Soal'}
              {activeTab === 'students' && 'Manajemen Data Siswa'}
              {activeTab === 'results' && 'Laporan Hasil Ujian'}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button size="md" icon={Plus} onClick={onCreateNew} className="h-9 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20">
              BUAT UJIAN BARU
            </Button>
            <div className="h-8 w-px bg-slate-100 mx-1"></div>
            <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Administrator</span>
               <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-200 flex items-center justify-center font-black text-white text-[10px]">G</div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
