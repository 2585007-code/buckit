# 🌿 민트 버킷 리스트 (Mint Bucket List) 웹 앱 프로젝트

이 프로젝트는 초보자를 위한 프론트엔드 개발 연습용 웹 애플리케이션입니다. React와 Tailwind CSS를 사용하여 깔끔하고 산뜻한 디자인으로 제작되었습니다.

## 📋 주요 기능

1. **할 일 추가**: 텍스트 입력 후 '추가' 버튼이나 엔터를 눌러 리스트에 추가합니다.
2. **입력 검증**: 내용이 비어있을 경우 경고창(Alert)을 표시합니다.
3. **할 일 완료**: 체크박스를 눌러 완료 상태로 변경하며, 글자에 취소선이 생깁니다.
4. **항목 삭제**: 항목을 삭제하기 전에 사용자에게 다시 한번 확인(Confirm) 절차를 거칩니다.
5. **데이터 저장**: `localStorage`를 사용하여 페이지를 새로고침해도 데이터가 유지됩니다.
6. **디자인**: 민트색 톤의 깨끗하고 정돈된 UI를 제공합니다.

## 🛠 사용된 기술

- **React**: 컴포넌트 기반 UI 라이브러리
- **Tailwind CSS**: 유틸리티 우선 스타일 프레임워크 (디자인 라이브러리)
- **Lucide React**: 깔끔한 벡터 아이콘
- **Framer Motion**: 부드러운 애니메이션 효과

## 💻 소스 코드 (App.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 1. 데이터 타입 정의
 * 각 할 일 항목이 어떤 정보를 가져야 하는지 정의합니다.
 */
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  // 2. 상태(State) 관리
  const [todos, setTodos] = useState<Todo[]>([]); // 할 일 목록 데이터
  const [inputValue, setInputValue] = useState(''); // 입력창의 현재 값

  // 3. 데이터 불러오기 (최초 1회 실행)
  useEffect(() => {
    const saved = localStorage.getItem('mint-bucket-list');
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch (e) {
        console.error('불러오기 오류', e);
      }
    }
  }, []);

  // 4. 데이터 저장하기 (목록이 변경될 때마다 실행)
  useEffect(() => {
    localStorage.setItem('mint-bucket-list', JSON.stringify(todos));
  }, [todos]);

  /**
   * 5. 기능 함수 정의
   */
  
  // 추가 기능
  const addTodo = () => {
    // 입력값이 비어있는지 확인
    if (inputValue.trim() === '') {
      alert('할 일을 입력해 주세요! (내용이 비어 있습니다)');
      return;
    }
    
    const newTodo: Todo = {
      id: Date.now(), // 고유한 ID 생성을 위해 현재 시간 사용
      text: inputValue,
      completed: false,
    };
    
    setTodos([newTodo, ...todos]); // 기존 목록 앞에 추가
    setInputValue(''); // 입력창 초기화
  };

  // 완료 토글 기능
  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // 삭제 기능
  const deleteTodo = (id: number) => {
    if (window.confirm('정말 이 항목을 삭제하시겠습니까?')) {
      setTodos(todos.filter(todo => todo.id !== id));
    }
  };

  /**
   * 6. 화면(UI) 구성
   */
  return (
    <div className="min-h-screen bg-[#F0FAF7] bg-[radial-gradient(#C6F6D5_1px,transparent_1px)] [background-size:20px_20px] flex flex-col items-center py-12 px-4 font-sans text-slate-700">
      <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl shadow-emerald-900/10 overflow-hidden border border-[#B2F5EA]/30 backdrop-blur-sm">
        
        {/* 헤더 */}
        <div className="bg-gradient-to-br from-[#B2F5EA] to-[#81E6D9] px-10 py-16 text-center relative overflow-hidden">
          <h1 className="text-4xl font-black text-[#234E52] tracking-tighter mb-3 relative z-10">🌿 My Bucket List</h1>
          <p className="text-[#285E61] text-base font-semibold opacity-80 relative z-10">꿈을 기록하고 하나씩 이루어 보세요</p>
        </div>

        {/* 바디 (입력창 및 리스트) */}
        <div className="p-10">
          <div className="flex gap-4 mb-12">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="어떤 일을 하고 싶으신가요?"
              className="flex-1 px-6 py-5 bg-[#F7FAFC] border-2 border-[#E2E8F0] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#4FD1C5]/20 focus:border-[#4FD1C5] transition-all text-lg font-medium shadow-inner"
            />
            <button
              onClick={addTodo}
              className="bg-[#38B2AC] hover:bg-[#2C7A7B] text-white px-8 rounded-2xl transition-all shadow-xl shadow-[#38B2AC]/30 active:scale-95 flex items-center gap-2 group"
            >
              <Plus size={28} strokeWidth={3} className="group-hover:rotate-90 transition-transform duration-300" />
              <span className="font-bold text-lg">추가하기</span>
            </button>
          </div>

          <div className="space-y-5">
            <AnimatePresence initial={false} mode="popLayout">
              {todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  className={`flex items-center gap-5 p-6 rounded-2xl border-2 transition-all group ${
                    todo.completed ? 'bg-[#F9FAFB] border-[#EDF2F7] opacity-70' : 'bg-white border-[#E2E8F0] hover:border-[#4FD1C5] hover:shadow-xl'
                  }`}
                >
                  <button onClick={() => toggleTodo(todo.id)} className={todo.completed ? 'text-[#38B2AC]' : 'text-[#CBD5E0] hover:text-[#38B2AC]'}>
                    {todo.completed ? <CheckCircle2 size={32} strokeWidth={2.5} fill="#E6FFFA" /> : <Circle size={32} strokeWidth={2.5} />}
                  </button>
                  <span className={`flex-1 text-xl leading-snug transition-all ${todo.completed ? 'text-[#A0AEC0] line-through decoration-4 decoration-[#B2F5EA]' : 'text-[#2D3748] font-bold'}`}>
                    {todo.text}
                  </span>
                  <button onClick={() => deleteTodo(todo.id)} className="text-[#CBD5E0] hover:text-rose-500 transition-all p-2 rounded-xl group-hover:opacity-100 opacity-0">
                    <Trash2 size={24} strokeWidth={2.5} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## 📝 설치 및 실행 방법

1. `App.tsx` 파일에 위 코드를 붙여넣습니다.
2. `npm install` 명령어로 필요한 패키지(`lucide-react`, `framer-motion`)를 설치합니다. (본 환경에는 이미 설치되어 있음)
3. 서버가 실행되면 브라우저에서 환상적인 민트색 버킷 리스트를 확인할 수 있습니다!
