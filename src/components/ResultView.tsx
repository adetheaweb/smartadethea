import React from 'react';
import { Trophy, Award, RefreshCcw, Home, Star } from 'lucide-react';
import { Button, Card } from './UI';
import { QuizAttempt } from '../types';
import { motion } from 'motion/react';

interface ResultViewProps {
  attempt: QuizAttempt;
  onRetry: () => void;
  onHome: () => void;
}

export function ResultView({ attempt, onRetry, onHome }: ResultViewProps) {
  const isPerfect = attempt.score === attempt.maxScore && attempt.maxScore > 0;
  const percentage = (attempt.score / (attempt.maxScore || 1)) * 100;

  const getMessage = () => {
    if (isPerfect) {
      return {
        title: "PENCAPAIAN SEMPURNA!",
        desc: "Luar biasa! Penghormatan setinggi-tingginya atas dedikasi dan kecerdasan Anda. Anda telah menaklukkan seluruh tantangan dengan sempurna!",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-200"
      };
    } else if (percentage >= 70) {
      return {
        title: "KERJA BAGUS!",
        desc: "Selamat! Anda telah menyelesaikan tugas dengan hasil yang sangat baik. Terus pertahankan semangat belajar Anda untuk mencapai puncak tertinggi!",
        color: "text-indigo-600",
        bg: "bg-indigo-50",
        border: "border-indigo-200"
      };
    } else {
      return {
        title: "USAHA YANG HEBAT!",
        desc: "Terima kasih atas perjuangan Anda. Setiap langkah dalam belajar adalah kemenangan. Jangan berkecil hati, mari coba lagi untuk hasil yang lebih maksimal!",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200"
      };
    }
  };

  const msg = getMessage();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <Card className="overflow-hidden shadow-2xl border-none">
          <div className={padding("p-0")}>
            {/* Header with Icon */}
            <div className={`py-12 flex flex-col items-center justify-center ${msg.bg} border-b ${msg.border} relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 0.5px, transparent 0.5px)', backgroundSize: '16px 16px' }}></div>
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className={`w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center mb-6 z-10`}
              >
                {isPerfect ? (
                  <Trophy className="w-12 h-12 text-amber-500" />
                ) : percentage >= 70 ? (
                  <Star className="w-12 h-12 text-indigo-500" />
                ) : (
                  <Award className="w-12 h-12 text-slate-400" />
                )}
              </motion.div>
              
              <h2 className={`text-xl font-black tracking-[0.2em] uppercase ${msg.color} z-10`}>{msg.title}</h2>
            </div>

            {/* Score Stats */}
            <div className="px-8 pt-8 pb-4 text-center">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Skor Pencapaian</div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-6xl font-black text-slate-900 tracking-tighter">{Math.round(attempt.score)}</span>
                <span className="text-xl font-black text-slate-300 tracking-tighter uppercase">/ {attempt.maxScore}</span>
              </div>
            </div>

            {/* Respectful Message */}
            <div className="px-8 pb-10">
              <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-4 border border-slate-100 rounded-full text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none py-2">Pesan Untuk Anda</div>
                <p className="text-xs leading-relaxed font-bold text-slate-600 uppercase tracking-tight line-clamp-4">
                  "{msg.desc}"
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-8 pb-8 space-y-3">
              <Button 
                variant="primary" 
                className="w-full h-12 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20"
                icon={RefreshCcw}
                onClick={onRetry}
              >
                COBA KEMBALI SEKARANG
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-12 text-[11px] font-black uppercase tracking-widest border-slate-200 text-slate-500"
                icon={Home}
                onClick={onHome}
              >
                KEMBALI KE BERANDA
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

// Helper because I was making a lot of padding mistakes
function padding(cls: string) { return cls; }
