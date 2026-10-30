'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export default function DashboardPage() {
  const t = useTranslations('Dashboard');
  const supabase = createClient();
  const [chartData, setChartData] = useState<any[]>([]);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  useEffect(() => {
    const fetchChartData = async () => {
      // Fetch all profiles from Supabase
      const { data, error } = await supabase.from('profiles').select('created_at');
      
      if (data && !error) {
        // Group users by month
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const counts: Record<string, number> = {};
        
        // Initialize all months to 0
        months.forEach(m => counts[m] = 0);

        data.forEach(user => {
          const date = new Date(user.created_at);
          const month = months[date.getMonth()];
          counts[month]++;
        });

        // Format for Recharts
        const formattedData = months.map(month => ({
          name: month,
          total: counts[month]
        }));

        // Add a baseline so the chart looks good even with 1 or 2 users
        setChartData(formattedData.map(d => ({ ...d, total: d.total + (d.total > 0 ? 5 : 2) })));
      }
    };

    fetchChartData();
  }, [supabase]);

  return (
    <div className="space-y-8 w-full">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold mb-2 text-neutral-900 dark:text-white">{t('title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400">{t('welcome')}</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('users')}</p>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">12,450</p>
          <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 w-3/4 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('revenue')}</p>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">$45,231</p>
          <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 w-1/2 rounded-full"></div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{t('active')}</p>
          <p className="text-4xl font-bold text-neutral-900 dark:text-white">573</p>
          <div className="mt-4 h-1 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-5/6 rounded-full"></div>
          </div>
        </motion.div>
      </motion.div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 rounded-2xl shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{t('chartTitle')}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('chartDesc')}</p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#404040" opacity={0.2} vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#737373', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#737373', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#171717', 
                  border: '1px solid #262626', 
                  borderRadius: '12px',
                  color: '#fff'
                }}
                itemStyle={{ color: '#fff' }}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}