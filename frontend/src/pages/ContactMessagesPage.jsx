// src/pages/ContactMessagesPage.jsx
// Admin-only page listing every message submitted via the public Contact
// form, with an unread indicator and a button to mark messages as read.

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Clock, User } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { getContactMessages, markMessageRead } from '../api/contactApi';

const formatDate = (dateString) =>
  new Date(dateString).toLocaleString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getContactMessages();
      setMessages(data.messages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id) => {
    setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
    try {
      await markMessageRead(id);
    } catch {
      loadMessages(); // revert to server truth if the request failed
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-up">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-display font-bold text-brand-dark">Contact Messages</h1>
            <p className="text-sm text-gray-500">Messages submitted via the public Contact page.</p>
          </div>
          {unreadCount > 0 && (
            <span className="bg-brand-red text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center text-gray-400 py-10">Loading messages...</p>
        ) : messages.length === 0 ? (
          <div className="bg-white border border-gray-100 shadow-soft rounded-2xl p-10 text-center text-gray-400">
            No messages yet.
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <div
                key={msg._id}
                style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
                className={`animate-fade-up bg-white border rounded-2xl p-4 sm:p-5 shadow-soft hover:shadow-lift ${
                  msg.isRead ? 'border-gray-100' : 'border-brand-red/30 bg-brand-blush/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-brand-dark flex items-center gap-2">
                      <User size={14} className="text-brand-red shrink-0" />
                      {msg.name}
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-red inline-block" />
                      )}
                    </p>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-brand-red hover:underline break-all"
                    >
                      {msg.email}
                    </a>
                  </div>
                  <p className="text-[11px] text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock size={11} /> {formatDate(msg.createdAt)}
                  </p>
                </div>

                {msg.subject && (
                  <p className="text-sm font-medium text-brand-dark mt-3">{msg.subject}</p>
                )}
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="mt-3 flex items-center gap-3">
                  {msg.isRead ? (
                    <span className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MailOpen size={13} /> Read
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleMarkRead(msg._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-red hover:underline"
                    >
                      <Mail size={13} /> Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
