/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * 할 일 아이템 인터페이스
 */
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  // 1. 초기 렌더링 시 LocalStorage에서 데이터 읽기
  useEffect(() => {
    const savedTodos = localStorage.getItem('mint-bucket-list');
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error('데이터를 불러오는데 실패했습니다.', e);
      }
    }
  }, []);

  // 2. todos 상태가 변할 때마다 LocalStorage에 저장
  useEffect(() => {
    localStorage.setItem('mint-bucket-list', JSON.stringify(todos));
  }, [todos]);

  // 할 일 추가 함수
  const addTodo = () => {
    if (inputValue.trim() === '') {
      alert('할 일을 입력해 주세요! (내용이 비어 있습니다)');
      return;
    }
    
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };
    
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  // 완료 상태 토글 함수
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 할 일 삭제 함수 (작성 여부 확인 포함)
  const deleteTodo = (id: number) => {
    if (window.confirm('정말 이 항목을 삭제하시겠습니까?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FAF7] bg-[radial-gradient(#C6F6D5_1px,transparent_1px)] [background-size:20px_20px] flex flex-col items-center py-12 px-4 font-sans text-slate-700">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-[#B2F5EA]/30 backdrop-blur-sm">
        
        {/* 상단 헤더 영역 */}
        <div className="bg-gradient-to-br from-[#B2F5EA] to-[#81E6D9] px-10 py-16 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-5%] w-40 h-40 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-40 h-40 bg-teal-500 rounded-full blur-3xl"></div>
          </div>
          
          <h1 className="text-4xl font-black text-[#234E52] tracking-tighter mb-3 relative z-10">
            🌿 My Bucket List
          </h1>
          <p className="text-[#285E61] text-base font-semibold opacity-80 relative z-10">
            꿈꾸던 모든 일들을 시원한 민트 노트에 담아보세요
          </p>
        </div>

        {/* 입력 및 리스트 영역 */}
        <div className="p-10">
          
          {/* 입력창과 추가 버튼 */}
          <div className="flex gap-4 mb-12">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                placeholder="어떤 멋진 일을 계획하시나요?"
                className="w-full px-6 py-5 bg-[#F7FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/20 focus:border-[#4FD1C5] transition-all placeholder:text-[#A0AEC0] text-lg font-medium shadow-inner"
              />
            </div>
            <button
              id="add-todo-btn"
              onClick={addTodo}
              className="bg-[#38B2AC] hover:bg-[#2C7A7B] text-white px-8 rounded-2xl transition-all shadow-xl shadow-[#38B2AC]/30 active:scale-95 flex items-center gap-2 group"
            >
              <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-bold text-lg hidden sm:inline">추가하기</span>
            </button>
          </div>

          {/* 리스트 출력 영역 */}
          <div className="space-y-5">
            <AnimatePresence initial={false} mode="popLayout">
              {todos.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-24 text-slate-400 flex flex-col items-center gap-5 bg-[#F0FAF7]/50 rounded-3xl border-2 border-dashed border-[#B2F5EA]"
                >
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg transform -rotate-6">
                    <AlertCircle size={40} className="text-[#4FD1C5]" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-xl text-slate-500">리스트가 비어 있어요!</p>
                    <p className="text-sm">지금 바로 첫 번째 버킷 리스트를 추가해보세요.</p>
                  </div>
                </motion.div>
              ) : (
                todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`flex items-center gap-5 p-6 rounded-2xl border-2 transition-all group ${
                      todo.completed 
                        ? 'bg-[#F9FAFB] border-[#EDF2F7] opacity-70' 
                        : 'bg-white border-[#E2E8F0] hover:border-[#4FD1C5] hover:shadow-xl hover:-translate-y-1'
                    }`}
                  >
                    {/* 체크박스 버튼 */}
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className={`transition-all transform active:scale-125 shrink-0 ${
                        todo.completed ? 'text-[#38B2AC]' : 'text-[#CBD5E0] hover:text-[#38B2AC]'
                      }`}
                    >
                      {todo.completed ? (
                        <CheckCircle2 size={32} strokeWidth={2.5} fill="#E6FFFA" />
                      ) : (
                        <Circle size={32} strokeWidth={2.5} />
                      )}
                    </button>
                    
                    {/* 할 일 텍스트 */}
                    <span className={`flex-1 text-xl leading-snug transition-all ${
                      todo.completed ? 'text-[#A0AEC0] line-through decoration-4 decoration-[#B2F5EA]' : 'text-[#2D3748] font-bold'
                    }`}>
                      {todo.text}
                    </span>

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-[#CBD5E0] hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-50 opacity-0 group-hover:opacity-100 focus:opacity-100"
                      title="삭제"
                    >
                      <Trash2 size={24} strokeWidth={2.5} />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 하단 상태 바 */}
        <div className="px-10 py-6 bg-[#F7FAFC] border-t border-[#EDF2F7] flex justify-between items-center">
          <div className="flex gap-6 items-center">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#A0AEC0] font-bold mb-1">Total Goals</span>
              <span className="text-xl font-black text-[#2D3748] leading-none">{todos.length}</span>
            </div>
            <div className="w-[1px] h-8 bg-[#E2E8F0]"></div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-[#A0AEC0] font-bold mb-1">Completed</span>
              <span className="text-xl font-black text-[#38B2AC] leading-none">{todos.filter(t => t.completed).length}</span>
            </div>
          </div>
          
          <div className="hidden sm:flex flex-col items-end">
             <span className="text-[10px] uppercase tracking-widest text-[#A0AEC0] font-bold mb-1">System Status</span>
             <div className="flex items-center gap-1.5 text-[#38B2AC] font-bold text-xs uppercase tracking-tighter">
                <div className="w-2 h-2 rounded-full bg-[#38B2AC] animate-pulse"></div>
                Cloud Sync Active
             </div>
          </div>
        </div>
      </div>

      {/* 바닥 문구 */}
      <footer className="mt-12 text-[#A0AEC0] text-sm flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
          Mint Note <Plus size={10} /> Bucket List Pro 
        </div>
        <p className="opacity-60 italic">ⓒ 2026 Crafted with Passion for Better Planning.</p>
      </footer>
    </div>
  );
}

