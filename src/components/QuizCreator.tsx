import React, { useState } from 'react';
import { Plus, Upload, Brain, Save, ArrowLeft, Trash2, Clock, Cloud } from 'lucide-react';
import { Button, Card, Input, Badge } from './UI';
import { Question, Quiz } from '../types';
import { parseQuestionsFromText } from '../services/geminiService';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

interface QuizCreatorProps {
  onSave: (quiz: Partial<Quiz>) => void | Promise<void>;
  onCancel: () => void;
}

export function QuizCreator({ onSave, onCancel }: QuizCreatorProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [uploadText, setUploadText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Manual Question State
  const [manualQ, setManualQ] = useState<Partial<Question>>({
    text: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 10
  });

  const handleUpload = async () => {
    if (!uploadText.trim()) return;
    setIsParsing(true);
    try {
      const parsed = await parseQuestionsFromText(uploadText);
      setQuestions([...questions, ...parsed]);
      setShowUpload(false);
      setUploadText('');
      toast.success(`${parsed.length} soal berhasil diunggah!`);
    } catch (error) {
      toast.error('Gagal mengunggah soal. Pastikan teks terbaca jelas.');
    } finally {
      setIsParsing(false);
    }
  };

  const addManualQuestion = () => {
    if (!manualQ.text || !manualQ.correctAnswer) {
      return toast.error('Pertanyaan dan Jawaban benar harus diisi');
    }
    const newQ: Question = {
      id: Math.random().toString(36).substr(2, 9),
      text: manualQ.text,
      type: manualQ.type as any,
      options: manualQ.options,
      correctAnswer: manualQ.correctAnswer,
      points: manualQ.points || 10
    };
    setQuestions([...questions, newQ]);
    setManualQ({ text: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '', points: 10 });
    toast.success('Soal berhasil ditambahkan');
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const moveQuestion = (idx: number, direction: 'up' | 'down') => {
    const newQuests = [...questions];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= newQuests.length) return;
    
    const temp = newQuests[idx];
    newQuests[idx] = newQuests[targetIdx];
    newQuests[targetIdx] = temp;
    setQuestions(newQuests);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleFinalSave = async () => {
    if (!title) return toast.error('Judul kuis harus diisi');
    if (questions.length === 0) return toast.error('Minimal harus ada 1 soal');
    
    setIsSaving(true);
    try {
      await onSave({
        title,
        description,
        durationMinutes: duration,
        questions,
        status: 'published',
        createdAt: Date.now()
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* Top Header */}
      <header className="h-14 bg-white border-b flex items-center justify-between px-8 shrink-0 z-20 shadow-sm leading-none">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel} icon={ArrowLeft} className="rounded-full h-8 w-8" />
          <div className="h-4 w-px bg-slate-200"></div>
          <h1 className="text-sm font-black text-slate-700 uppercase tracking-tight">Manajemen Soal Ujian</h1>
          <Badge variant="info">Drafting</Badge>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-slate-400 font-bold" onClick={onCancel} disabled={isSaving}>BATAL</Button>
          <Button 
            size="md" 
            variant="primary"
            icon={Save} 
            loading={isSaving}
            onClick={handleFinalSave} 
            className="font-black tracking-widest text-[11px] px-6 h-9 shadow-lg shadow-indigo-600/20"
          >
            PUBLIKASIKAN UJIAN
          </Button>
        </div>
      </header>

      {/* Content Grid */}
      <div className="flex-1 overflow-hidden grid grid-cols-12 gap-0">
        {/* Left: Question List & Manual Form */}
        <section className="col-span-8 flex flex-col border-r bg-white overflow-hidden">
          <div className="p-3 border-b flex items-center justify-between bg-slate-50 shrink-0">
            <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">
              Question Catalog ({questions.length})
            </h3>
            <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border-b-2 border-indigo-500 pb-0.5">
              Cumulative Points: {questions.reduce((acc, q) => acc + (q.points || 0), 0)}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30">
            {/* Manual Add Form */}
            <div className="p-6 bg-white border-2 border-dashed border-slate-200 rounded-xl mb-10 shadow-sm">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Plus className="h-3 w-3 text-indigo-500" />
                Tambah Soal Manual
              </h3>
              <div className="space-y-4">
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-300 outline-none"
                  placeholder="Tuliskan pertanyaan di sini..."
                  value={manualQ.text}
                  onChange={e => setManualQ({ ...manualQ, text: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  {manualQ.options?.map((opt, i) => (
                    <div key={i} className="flex gap-2">
                       <div className="h-10 w-10 shrink-0 flex items-center justify-center font-black bg-slate-100 border border-slate-200 rounded text-slate-400 text-xs">{String.fromCharCode(65 + i)}</div>
                       <Input 
                        className="h-10 text-xs font-bold"
                        placeholder={`Opsi ${i + 1}`}
                        value={opt}
                        onChange={e => {
                          const newOpts = [...(manualQ.options || [])];
                          newOpts[i] = e.target.value;
                          setManualQ({ ...manualQ, options: newOpts });
                        }}
                       />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Jawaban Benar</label>
                    <select 
                      className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-md text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500/10"
                      value={manualQ.correctAnswer}
                      onChange={e => setManualQ({ ...manualQ, correctAnswer: e.target.value })}
                    >
                      <option value="">Pilih Jawaban</option>
                      {manualQ.options?.map((opt, i) => opt && (
                        <option key={i} value={opt}>{String.fromCharCode(65 + i)}. {opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Bobot Poin</label>
                    <Input 
                      type="number" 
                      className="h-10 text-xs font-black"
                      value={manualQ.points}
                      onChange={e => setManualQ({ ...manualQ, points: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="pt-5">
                    <Button size="md" className="h-10 px-6 font-black uppercase tracking-widest text-[10px]" onClick={addManualQuestion}>Tambah</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Process Result & Staged List */}
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5 bg-white border border-slate-200 rounded-lg relative hover:border-indigo-400 transition-all group shadow-xs">
                <div className="absolute -left-3 top-6 w-6 h-6 bg-slate-900 text-white text-[10px] font-black rounded flex items-center justify-center shadow-lg transform -rotate-3">
                  {idx + 1}
                </div>
                
                <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-600" onClick={() => moveQuestion(idx, 'up')} icon={ArrowLeft} title="Move Up" style={{ transform: 'rotate(90deg)' }} />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-slate-600" onClick={() => moveQuestion(idx, 'down')} icon={ArrowLeft} title="Move Down" style={{ transform: 'rotate(-90deg)' }} />
                  <div className="w-px h-4 bg-slate-100 mx-1"></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 hover:text-red-500" onClick={() => removeQuestion(q.id)} icon={Trash2} />
                </div>

                <div className="pl-6">
                  <p className="text-sm font-bold text-slate-800 mb-4 pr-20 leading-relaxed tracking-tight">{q.text}</p>
                  
                  {q.options && (
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-bold uppercase tracking-tight">
                      {q.options.map((opt, i) => (
                        <div key={i} className={cn(
                          "p-2.5 rounded-md border flex items-center gap-3 transition-all",
                          opt === q.correctAnswer 
                            ? "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm ring-1 ring-emerald-50" 
                            : "bg-slate-50 border-slate-100 text-slate-500 font-medium"
                        )}>
                          <span className={cn(
                            "w-5 h-5 shrink-0 flex items-center justify-center rounded text-[10px] font-black",
                            opt === q.correctAnswer ? "bg-emerald-500 text-white" : "bg-white border border-slate-200 text-slate-300 text-slate-400"
                          )}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="truncate">{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-4">
                    <Badge variant="info">{q.points} PTS</Badge>
                    <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.1em]">Verified Type: {q.type}</div>
                  </div>
                </div>
              </div>
            ))}

            {questions.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-center opacity-40">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 border-4 border-dashed border-slate-200">
                  <Cloud className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Question Vault Empty</h3>
                <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">Gunakan modul di kanan untuk upload atau modul di atas untuk manual.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right: AI Upload & Config */}
        <section className="col-span-4 bg-slate-50 overflow-y-auto p-6 space-y-6">
          {/* AI Batch Processor */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden ring-4 ring-indigo-500/5">
            <div className="p-4 border-b bg-slate-900 border-white/10">
              <h3 className="text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                <Brain className="h-3 w-3 text-indigo-400" />
                Gemini AI Processor
              </h3>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <p className="text-[11px] font-bold text-slate-600 leading-relaxed uppercase tracking-tight mb-4">
                  Pastikan format teks mengandung pertanyaan dan opsi jawaban (A, B, C...) untuk hasil maksimal.
                </p>
                <textarea 
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 min-h-[180px] placeholder:text-slate-300 leading-relaxed"
                  placeholder="Paste question text here..."
                  value={uploadText}
                  onChange={e => setUploadText(e.target.value)}
                />
              </div>
              <Button 
                className="w-full h-12 font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-indigo-500/20" 
                loading={isParsing} 
                onClick={handleUpload} 
                icon={Brain}
              >
                PROSES DENGAN AI
              </Button>
            </div>
          </div>

          {/* Exam Details */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">General Configuration</h3>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Judul Kuis</label>
                <Input 
                   value={title} 
                   onChange={e => setTitle(e.target.value)} 
                   placeholder="e.g. UAS SEJARAH XII" 
                   className="h-10 font-bold text-slate-700"
                />
              </div>
              
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 block">Durasi (Menit)</label>
                <div className="flex items-center">
                  <Input 
                    type="number" 
                    className="h-10 rounded-r-none font-black" 
                    value={duration} 
                    onChange={e => setDuration(parseInt(e.target.value))} 
                  />
                  <div className="h-10 px-4 bg-slate-100 border border-l-0 border-slate-200 rounded-r-md flex items-center text-[10px] font-black text-slate-500 uppercase shrink-0">
                    Mnt
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
