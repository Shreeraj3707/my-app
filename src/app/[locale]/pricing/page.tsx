'use client';

import { motion } from 'framer-motion';

export default function PricingPage() {
  // 👇 PASTE YOUR COPIED STRIPE LINK HERE
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_fZueVebXi8Kt4tPatj0RG00';

  const handleUpgrade = () => {
    // Redirect the user directly to Stripe's secure checkout page
    window.location.href = STRIPE_PAYMENT_LINK;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">Upgrade to Pro</h1>
        <p className="text-neutral-500 text-lg">Unlock unlimited AI features and premium support.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Free Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8"
        >
          <h2 className="text-2xl font-bold mb-2">Free</h2>
          <p className="text-4xl font-extrabold mb-6">$0<span className="text-lg text-neutral-500 font-normal">/mo</span></p>
          <ul className="space-y-3 mb-8 text-neutral-600 dark:text-neutral-400">
            <li>✅ 5 AI Summaries / minute</li>
            <li>✅ Basic Kanban Board</li>
            <li>✅ Community Support</li>
          </ul>
          <button className="w-full py-3 bg-neutral-200 dark:bg-neutral-800 font-bold rounded-xl cursor-not-allowed">
            Current Plan
          </button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-indigo-600 text-white border border-indigo-500 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 bg-white text-indigo-600 text-xs font-bold px-4 py-1 rounded-bl-xl">
            POPULAR
          </div>
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <p className="text-4xl font-extrabold mb-6">$9<span className="text-lg text-indigo-200 font-normal">/mo</span></p>
          <ul className="space-y-3 mb-8 text-indigo-100">
            <li>✅ Unlimited AI Summaries</li>
            <li>✅ Advanced Analytics</li>
            <li>✅ Priority Support</li>
            <li>✅ Custom Domain</li>
          </ul>
          <button 
            onClick={handleUpgrade}
            className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Upgrade Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}