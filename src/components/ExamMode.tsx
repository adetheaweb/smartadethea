import React, { useState, useEffect } from 'react';
import { Clock, Send, ChevronRight, ChevronLeft, AlertCircle, ClipboardList } from 'lucide-react';
import { Button, Card, Badge } from './UI';
import { Quiz, QuizAttempt } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

interface ExamModeProps {
  quiz: Quiz;
  studentName: string;
  onComplete: (attempt: QuizAttempt) => void;
}

export function ExamMode({ quiz, studentName, onComplete }: ExamModeProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.durationMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [isConfirming, setIsConfirming] = useState(false);

  const handleFinish = () => {
    if (isFinished) return;
    setIsFinished(true);
    setIsConfirming(false);

    let score = 0;
    let maxScore = 0;

    quiz.questions.forEach(q => {
      maxScore += q.points;
      if (answers[q.id] === q.correctAnswer) {
        score += q.points;
      }
    });

    const attempt: QuizAttempt = {
      id: Math.random().toString(36).substr(2, 9),
      quizId: quiz.id,
      studentId: 'guest-' + studentName,
      studentName,
      answers,
      score,
      maxScore,
      startTime: Date.now() - (quiz.durationMinutes * 60 - timeLeft) * 1000,
      endTime: Date.now(),
      status: 'submitted'
    };

    onComplete(attempt);
    toast.success('Ujian telah selesai dikerjakan!');
  };

  const currentQ = quiz.questions[currentIdx];

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Top Header */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-8 shrink-0 z-10 shadow-sm leading-none">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
            {studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight">{quiz.title}</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Siswa: {studentName}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md font-mono font-black text-xl border",
            timeLeft < 300 ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-700"
          )}>
            <Clock className="w-5 h-5 mr-3" />
            {formatTime(timeLeft)}
          </div>
          {isConfirming ? (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-1 rounded-lg">
              <span className="text-[9px] font-black text-amber-700 uppercase px-2">Yakin?</span>
              <Button variant="danger" size="sm" onClick={handleFinish} className="h-8 text-[10px] font-black">YA, KUMPULKAN</Button>
              <Button variant="ghost" size="sm" onClick={() => setIsConfirming(false)} className="h-8 text-[10px] font-black text-slate-400">BATAL</Button>
            </div>
          ) : (
            <Button variant="danger" size="md" icon={Send} onClick={() => setIsConfirming(true)}>
              KUMPULKAN
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 gap-0">
        {/* Left: Question View */}
        <section className="col-span-8 flex flex-col border-r bg-white overflow-hidden p-10">
          <div className="max-w-2xl mx-auto w-full flex flex-col h-full">
            <div className="flex items-center justify-between mb-10 shrink-0">
              <Badge variant="info">Pertanyaan {currentIdx + 1} dari {quiz.questions.length}</Badge>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">Bobot: {currentQ.points} POIN</div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              <h3 className="text-xl font-bold text-slate-800 mb-10 leading-relaxed tracking-tight">
                {currentQ.text}
              </h3>

              <div className="space-y-3">
                {currentQ.options?.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({ ...answers, [currentQ.id]: opt })}
                    className={cn(
                      "w-full text-left px-5 py-4 rounded-md border-2 transition-all duration-150 flex items-center group",
                      answers[currentQ.id] === opt 
                        ? "border-indigo-600 bg-indigo-50 shadow-sm" 
                        : "border-slate-100 bg-slate-50 hover:border-slate-300 hover:bg-slate-100 shadow-xs"
                    )}
                  >
                    <span className={cn(
                      "w-7 h-7 rounded flex items-center justify-center font-black text-xs mr-4 border-2 transition-colors",
                      answers[currentQ.id] === opt 
                        ? "bg-indigo-600 border-indigo-600 text-white" 
                        : "bg-white border-slate-200 text-slate-400"
                    )}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className={cn(
                      "text-sm font-bold tracking-tight",
                      answers[currentQ.id] === opt ? "text-indigo-900" : "text-slate-600"
                    )}>
                      {opt}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-between shrink-0">
              <Button 
                variant="outline" 
                size="md"
                icon={ChevronLeft} 
                disabled={currentIdx === 0} 
                onClick={() => setCurrentIdx(i => i - 1)}
              >
                KEMBALI
              </Button>
              <div className="flex gap-1.5">
                {quiz.questions.map((_, i) => (
                  <div key={i} className={cn(
                    "h-1 w-6 rounded-full transition-all",
                    i === currentIdx ? "bg-indigo-600" : answers[quiz.questions[i].id] ? "bg-emerald-500" : "bg-slate-200"
                  )} />
                ))}
              </div>
              <Button 
                variant="outline"
                size="md"
                className="flex-row-reverse gap-2"
                disabled={currentIdx === quiz.questions.length - 1} 
                onClick={() => setCurrentIdx(i => i + 1)}
              >
                <ChevronRight className="h-4 w-4" />
                <span>LANJUT</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Right: Navigation Grid */}
        <section className="col-span-4 bg-slate-50 overflow-y-auto p-8 space-y-8">
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                <ClipboardList className="w-3.5 h-3.5 mr-2" />
                Matriks Navigasi
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={cn(
                      "h-9 w-full rounded flex items-center justify-center text-[10px] font-black transition-all border-2",
                      i === currentIdx 
                        ? "border-indigo-600 bg-white text-indigo-600 ring-4 ring-indigo-50" 
                        : answers[q.id] 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "bg-slate-50 border-slate-100 text-slate-400"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest mb-1">Status Progres</p>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  {Object.keys(answers).length} dari {quiz.questions.length} soal telah terjawab. Segera kumpulkan jika sudah selesai.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
