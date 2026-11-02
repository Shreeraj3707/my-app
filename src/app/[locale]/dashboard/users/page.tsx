'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

type User = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to load users');
    } else {
      setUsers(data || []);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string, email: string) => {
    if (email === 'admin@myapp.com') {
      toast.error('Cannot delete the primary admin.');
      return;
    }
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete user');
      return;
    }
    toast.success('User profile deleted.');
    loadUsers();
  };

  const filteredUsers = users.filter((user) => 
    (user.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">User Management</h1>
        <p className="text-neutral-600 dark:text-neutral-400">View and manage all registered users.</p>
      </div>

      <div className="w-full md:w-72">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users by name or email..."
          className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm text-neutral-900 dark:text-white"
        />
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-800 rounded-xl"></div>)}
        </div>
      ) : (
        <div className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Role</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-neutral-500">No users found.</td>
                    </tr>
                  ) : (
                    currentUsers.map((user) => (
                      <motion.tr 
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-neutral-100 dark:border-neutral-800/50 last:border-0 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs">
                              {(user.full_name || 'U').charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-neutral-900 dark:text-white">{user.full_name || 'Anonymous'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-neutral-600 dark:text-neutral-400">{user.email}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300' 
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                          }`}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(user.id, user.email)}
                            disabled={user.role === 'admin'}
                            className="text-sm font-medium text-red-500 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/20">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50">Previous</button>
              <span className="text-sm text-neutral-500">Page {currentPage} of {totalPages}</span>
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 text-sm font-medium bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg disabled:opacity-50">Next</button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}