'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type User = {
  name: string;
  email: string;
  role?: string;
  status?: string;
};

const ITEMS_PER_PAGE = 5;

export default function AdminPage() {
  const t = useTranslations('Admin');
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadUsers();
  }, []);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const demoAdmin = { name: 'Admin User', email: 'admin@myapp.com', role: 'admin', status: 'active' };
    setUsers([demoAdmin, ...storedUsers]);
  };

  const handleDelete = (email: string) => {
    if (email === 'admin@myapp.com') {
      toast.error('Cannot delete the demo admin.');
      return;
    }
    
    const updatedUsers = users.filter(u => u.email !== email && u.email !== 'admin@myapp.com');
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    loadUsers();
    toast.success('User deleted successfully.');
  };

  // 1. Filter
  const filteredUsers = users.filter((user) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Paginate
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full space-y-8 pb-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
          <p className="text-neutral-600 dark:text-neutral-400">{t('subtitle')}</p>
        </div>

        <div className="w-full md:w-72">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search')}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-neutral-900 dark:text-white"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                <th className="p-4 font-medium">{t('name')}</th>
                <th className="p-4 font-medium">{t('email')}</th>
                <th className="p-4 font-medium">{t('role')}</th>
                <th className="p-4 font-medium">{t('status')}</th>
                <th className="p-4 font-medium text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {currentUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-neutral-500">
                      {t('noUsers')}
                    </td>
                  </tr>
                ) : (
                  currentUsers.map((user) => (
                    <motion.tr 
                      key={user.email}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-neutral-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' 
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                        }`}>
                          {user.role === 'admin' ? t('admin') : t('user')}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                          {t('active')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(user.email)}
                          disabled={user.role === 'admin'}
                          className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          {t('delete')}
                        </button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {t('prev')}
            </button>
            <span className="text-sm text-neutral-500">
              {t('page', { current: currentPage, total: totalPages })}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              {t('next')}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}