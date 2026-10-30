'use client';

import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

type Task = {
  id: string;
  title: string;
  status: 'todo' | 'inProgress' | 'done';
  position: number;
};

type Columns = {
  todo: Task[];
  inProgress: Task[];
  done: Task[];
};

const initialColumns: Columns = { todo: [], inProgress: [], done: [] };

export function KanbanBoard() {
  const t = useTranslations('Kanban');
  const supabase = createClient();
  
  const [columns, setColumns] = useState<Columns>(initialColumns);
  const [newTask, setNewTask] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch tasks from Supabase on load
  useEffect(() => {
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('position', { ascending: true });

      if (error) {
        toast.error('Failed to load tasks');
        console.error(error);
      } else {
        const newColumns: Columns = { todo: [], inProgress: [], done: [] };
        data.forEach((task) => {
          newColumns[task.status as keyof Columns].push(task as Task);
        });
        setColumns(newColumns);
      }
      setIsLoading(false);
    };

    fetchTasks();
  }, [supabase]);

  // 2. Add a new task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("You must be logged in.");

    const newTaskObj = {
      user_id: user.id,
      title: newTask,
      status: 'todo' as const,
      position: columns.todo.length,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTaskObj)
      .select()
      .single();

    if (error) {
      toast.error('Failed to add task');
    } else {
      setColumns({ 
        ...columns, 
        todo: [...columns.todo, data as Task] 
      });
      setNewTask('');
    }
  };

  // 3. Delete a task
  const deleteTask = async (taskId: string, columnType: keyof Columns) => {
    // Optimistic UI update (remove instantly)
    const previousColumns = columns;
    setColumns({
      ...columns,
      [columnType]: columns[columnType].filter((task) => task.id !== taskId),
    });

    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) {
      toast.error('Failed to delete task');
      setColumns(previousColumns); // Revert if failed
    }
  };

  // 4. Handle reordering (Drag & Drop)
  const handleReorder = async (newOrder: Task[], type: keyof Columns) => {
    // Instantly update UI
    setColumns({ ...columns, [type]: newOrder });

    // Save new positions to database
    const updates = newOrder.map((task, index) => ({
      id: task.id,
      position: index,
    }));

    const { error } = await supabase.from('tasks').upsert(updates);
    if (error) console.error('Failed to save order', error);
  };

  const Column = ({ title, tasks, type }: { title: string, tasks: Task[], type: keyof Columns }) => (
    <div className="flex flex-col flex-1 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 min-w-[280px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-neutral-900 dark:text-white">{title}</h3>
        <span className="text-xs font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <Reorder.Group axis="y" values={tasks} onReorder={(newOrder) => handleReorder(newOrder, type)} className="flex flex-col gap-3 flex-1">
        {tasks.map((task) => (
          <Reorder.Item 
            key={task.id} 
            value={task}
            className="bg-white dark:bg-neutral-800 p-4 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 cursor-grab active:cursor-grabbing group relative"
            whileDrag={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
          >
            <div className="flex justify-between items-start gap-2">
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex-1">{task.title}</span>
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

  if (isLoading) return <div className="h-96 w-full animate-pulse bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl" />;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-12 w-full">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
      </div>

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

      <div className="flex gap-6 overflow-x-auto pb-4 items-start">
        <Column title={t('todo')} tasks={columns.todo} type="todo" />
        <Column title={t('inProgress')} tasks={columns.inProgress} type="inProgress" />
        <Column title={t('done')} tasks={columns.done} type="done" />
      </div>
    </motion.div>
  );
}