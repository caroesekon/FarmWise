import { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import { chat as chatApi } from '../api/aiApi';
import { useAuth } from '../hooks/useAuth';
import {
  Send,
  Bot,
  User,
  Trash2,
  Sparkles,
  Cloud,
  Stethoscope,
  Wheat,
  Languages,
} from 'lucide-react';
import clsx from 'clsx';

const suggestions = {
  en: [
    { icon: Stethoscope, text: 'Check animal health status', prompt: 'How are my animals doing? Any health concerns?' },
    { icon: Cloud, text: 'Weather impact on farm', prompt: 'How does today\'s weather affect my farm operations?' },
    { icon: Wheat, text: 'Feed and nutrition advice', prompt: 'What should I be feeding my animals this season?' },
    { icon: Sparkles, text: 'Farm optimization tips', prompt: 'What can I do to improve my farm productivity?' },
  ],
  sw: [
    { icon: Stethoscope, text: 'Angalia afya ya wanyama', prompt: 'Wanyama wangu wana hali gani? Kuna wasiwasi wowote wa kiafya?' },
    { icon: Cloud, text: 'Athari za hali ya hewa', prompt: 'Hali ya hewa ya leo inaathiri vipi shughuli za shamba langu?' },
    { icon: Wheat, text: 'Ushauri wa lishe na malisho', prompt: 'Niwalishe nini wanyama wangu msimu huu?' },
    { icon: Sparkles, text: 'Vidokezo vya kuboresha shamba', prompt: 'Nifanye nini kuboresha uzalishaji wa shamba langu?' },
  ],
};

const greetings = {
  en: (name, farm) => `Hello ${name?.split(' ')[0] || 'there'}! 👋 I'm your FarmWise AI assistant. I can see everything on ${farm?.name || 'your farm'} — animals, health, production, weather, and more. Ask me anything!`,
  sw: (name, farm) => `Habari ${name?.split(' ')[0] || 'rafiki'}! 👋 Mimi ni msaidizi wako wa FarmWise AI. Ninaweza kuona kila kitu kwenye ${farm?.name || 'shamba lako'} — wanyama, afya, uzalishaji, hali ya hewa, na zaidi. Niulize chochote!`,
};

export default function AIChatPage() {
  const { user, farm } = useAuth();
  const [language, setLanguage] = useState(() => localStorage.getItem('farmwise_ai_language') || 'en');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('farmwise_chat_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    const lang = localStorage.getItem('farmwise_ai_language') || 'en';
    return [
      {
        role: 'assistant',
        content: greetings[lang](user, farm),
        timestamp: new Date().toISOString(),
      },
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('farmwise_chat_history', JSON.stringify(messages.slice(-50)));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('farmwise_ai_language', language);
  }, [language]);

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'sw' : 'en';
    setLanguage(newLang);
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: newLang === 'sw'
          ? 'Nitaendelea kukujibu kwa Kiswahili. Unaweza kubadilisha lugha wakati wowote.'
          : 'I will continue responding in English. You can switch languages anytime.',
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const handleSend = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: userMessage, timestamp: new Date().toISOString() }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await chatApi({ message: userMessage, language });
      setMessages([...newMessages, { role: 'assistant', content: res.data.data.reply, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages([...newMessages, {
        role: 'assistant',
        content: language === 'sw'
          ? 'Samahani, nina shida sasa hivi. Tafadhali jaribu tena.'
          : 'Sorry, I\'m having trouble right now. Please try again.',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: language === 'sw'
          ? 'Mazungumzo yamefutwa. Nikusaidie vipi?'
          : 'Chat cleared. How can I help you?',
        timestamp: new Date().toISOString(),
      },
    ]);
    localStorage.removeItem('farmwise_chat_history');
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
  };

  const currentSuggestions = suggestions[language];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)]">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <PageHeader
          title="AI Assistant"
          description="Your personal farm consultant powered by AI"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={toggleLanguage}
            className="flex items-center gap-2"
          >
            <Languages className="h-4 w-4" />
            {language === 'en' ? 'Kiswahili' : 'English'}
          </Button>
          {messages.length > 1 && (
            <Button variant="ghost" onClick={clearChat} className="text-gray-400 hover:text-red-500">
              <Trash2 className="h-4 w-4" />
              {language === 'en' ? 'Clear' : 'Futa'}
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex gap-6 min-h-0">
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {currentSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s.prompt)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-950/30 hover:border-primary-200 dark:hover:border-primary-800 transition-all text-left group"
                  >
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-800 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors">
                      <s.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{s.text}</span>
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={clsx('flex gap-3', msg.role === 'user' && 'flex-row-reverse')}
              >
                <div
                  className={clsx(
                    'h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm',
                    msg.role === 'assistant'
                      ? 'bg-gradient-to-br from-primary-500 to-green-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <Bot className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div className={clsx('max-w-[75%]', msg.role === 'user' && 'items-end')}>
                  <div
                    className={clsx(
                      'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'assistant'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md'
                        : 'bg-primary-600 text-white rounded-tr-md'
                    )}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <p className={clsx(
                    'text-[10px] text-gray-400 mt-1',
                    msg.role === 'user' ? 'text-right' : 'text-left'
                  )}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-green-600 flex items-center justify-center shadow-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-tl-md px-5 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 bg-primary-400 rounded-full animate-bounce" />
                    <span className="h-2.5 w-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="h-2.5 w-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={language === 'en' ? 'Ask about your animals, crops, weather, or anything farm-related...' : 'Uliza kuhusu wanyama wako, mazao, hali ya hewa, au chochote...'}
                  rows={1}
                  className="w-full resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 pr-12 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  disabled={loading}
                />
              </div>
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="rounded-xl px-4"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-[11px] text-gray-400 mt-2 text-center">
              {language === 'en'
                ? 'FarmWise AI uses your real farm data to give personalized advice. Press Enter to send.'
                : 'FarmWise AI inatumia data halisi ya shamba lako kutoa ushauri. Bonyeza Enter kutuma.'}
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary-600" />
              {language === 'en' ? 'Quick Prompts' : 'Maswali Haraka'}
            </h3>
            <div className="space-y-2">
              {currentSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.prompt)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left"
                >
                  <s.icon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                  <span className="truncate">{s.text}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {language === 'en' ? 'Farm Context' : 'Taarifa za Shamba'}
              </h4>
              <div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  {farm?.name || 'Farm'} — {language === 'en' ? 'Active' : 'Imewashwa'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  {language === 'en' ? 'Live data connected' : 'Data halisi imeunganishwa'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  {language === 'en' ? 'Real-time weather' : 'Hali ya hewa halisi'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}