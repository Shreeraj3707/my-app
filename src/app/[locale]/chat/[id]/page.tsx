'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/navigation';

type Message = {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function ChatPage() {
  const { id: receiverId } = useParams();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [receiverName, setReceiverName] = useState('Loading...');
  const [isReceiverOnline, setIsReceiverOnline] = useState(false);
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create the channel at the top level so both useEffect and handleTyping can use it
  const channelRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const channel = supabase.channel('chat_presence', {
      config: { presence: { key: '' } },
    });
    channelRef.current = channel;

    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setCurrentUser(user);

      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', receiverId).single();
      if (profile) setReceiverName(profile.full_name);

      const { data: initialMessages } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      if (initialMessages) setMessages(initialMessages);
      setTimeout(scrollToBottom, 100);

      channel
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
          const newMsg = payload.new as Message;
          if (
            (newMsg.sender_id === user.id && newMsg.receiver_id === receiverId) ||
            (newMsg.sender_id === receiverId && newMsg.receiver_id === user.id)
          ) {
            setMessages((prev) => [...prev, newMsg]);
            setTimeout(scrollToBottom, 100);
          }
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const receiverOnline = state[receiverId as string] ? true : false;
          setIsReceiverOnline(receiverOnline);
        })
        .on('broadcast', { event: 'typing' }, (payload) => {
          if (payload.payload.userId === receiverId) {
            setIsReceiverTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => setIsReceiverTyping(false), 2000);
          }
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({ online_at: new Date().toISOString() });
            await channel.track({ [user.id]: true });
          }
        });
    };

    initChat();

    return () => { supabase.removeChannel(channel); };
  }, [receiverId, supabase]);

  const handleTyping = () => {
    if (!currentUser || !channelRef.current) return;
    channelRef.current.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUser.id },
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser) return;

    const content = newMessage;
    setNewMessage('');
    
    await supabase.from('messages').insert({
      sender_id: currentUser.id,
      receiver_id: receiverId,
      content: content,
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col bg-white/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-2xl mt-8">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-4">
        <Link href={`/profile/${receiverId}`} className="text-xl">←</Link>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{receiverName}</h2>
          {isReceiverOnline && <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUser?.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                isMe ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        
        {isReceiverTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-200 dark:bg-neutral-800 p-2 rounded-xl rounded-bl-none text-xs text-neutral-500 animate-pulse">
              Typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => { setNewMessage(e.target.value); handleTyping(); }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl focus:outline-none text-neutral-900 dark:text-white"
        />
        <button type="submit" className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl">Send</button>
      </form>
    </div>
  );
}