import { Bot, User } from 'lucide-react';
import clsx from 'clsx';

export default function ChatMessage({ role, content }) {
  const isAssistant = role === 'assistant';

  return (
    <div className={clsx('flex gap-3', !isAssistant && 'flex-row-reverse')}>
      <div
        className={clsx(
          'h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0',
          isAssistant ? 'bg-primary-100 dark:bg-primary-900' : 'bg-gray-100 dark:bg-gray-800'
        )}
      >
        {isAssistant ? (
          <Bot className="h-4 w-4 text-primary-600" />
        ) : (
          <User className="h-4 w-4 text-gray-600" />
        )}
      </div>
      <div
        className={clsx(
          'max-w-[80%] rounded-lg px-4 py-2 text-sm',
          isAssistant
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
            : 'bg-primary-600 text-white'
        )}
      >
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}