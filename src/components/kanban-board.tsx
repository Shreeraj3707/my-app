'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useTranslations } from 'next-intl';

type Task = {
  id: string;
  text: string;
};

type Columns = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

const defaultColumns: Columns = {
  todo: [
    { id: '1', text: 'Design new landing page' },
    { id: '2', text: 'Write documentation' },
  ],
  inProgress: [
    { id: '3', text: 'Build authentication flow' },
  ],
  done: [
    { id: '4', text: 'Setup Next.js project' },
  ],
};

export function KanbanBoard() {
  const t = useTranslations('Kanban');
  
  // Initialize state from local storage or use defaults
  const [columns, setColumns] = useState<Columns>(defaultColumns);
  const [newTask, setNewTask] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kanban-data');
    if (saved) {
      try {
        setColumns(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved tasks", e);
      }
    }
    setIsMounted(true);
  }, []);

  // Save to local storage whenever columns change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('kanban-data', JSON.stringify(columns));
    }
  }, [columns, isMounted]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = { id: Date.now().toString(), text: newTask };
    setColumns({ ...columns, todo: [...columns.todo, task] });
    setNewTask('');
  };

  const deleteTask = (taskId: string, columnType: keyof Columns) => {
    setColumns({
      ...columns,
      [columnType]: columns[columnType].filter((task) => task.id !== taskId),
    });
  };

  // Helper to render a column
  const Column = ({ title, tasks, type }: { title: string, tasks: Task[], type: keyof Columns }) => (
    <div className="flex flex-col flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 min-w-[280px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
        <span className="text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      {/* Reorderable List */}
      <Reorder.Group axis="y" values={tasks} onReorder={(newOrder) => setColumns({ ...columns, [type]: newOrder })} className="flex flex-col gap-3 flex-1">
        {tasks.map((task) => (
          <Reorder.Item 
            key={task.id} 
            value={task}
            className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-grab active:cursor-grabbing group relative"
            whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex-1">{task.text}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTask(task.id, type);
                }}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity text-xs font-bold"
              >
                ✕
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>
    </div>
  );

  // Prevent hydration mismatch by waiting for mount
  if (!isMounted) return <div className="h-96 w-full animate-pulse bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl" />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12 w-full">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

      {/* Add Task Input */}
      <form onSubmit={addTask} className="flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-neutral-900 dark:text-white"
        />
        <button type="submit" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-90 transition-opacity">
          {t('addTask')}
        </button>
      </form>

      {/* Kanban Columns */}
      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        <Column title={t('todo')} tasks={columns.todo} type="todo" />
        <Column title={t('inProgress')} tasks={columns.inProgress} type="inProgress" />
        <Column title={t('done')} tasks={columns.done} type="done" />
      </div>
    </motion.div>
  );
}   