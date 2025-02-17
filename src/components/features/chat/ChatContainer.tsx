import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import ChatBubble from './ChatBubble';
import MessageComposer from './MessageComposer';
import MarkdownRenderer from './MarkdownRenderer';
import ProcessingIndicator from './ProcessingIndicator';
import ContextPreview from './ContextPreview';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  context?: {
    assumptions: Record<string, string>;
    version: string;
  };
}

interface ChatContainerProps {
  projectId: string;
  chatHistory: Message[];
  setChatHistory: (history: Message[]) => void;
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  projectId,
  chatHistory,
  setChatHistory,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const newMessage: Message = { role: 'user', content: message };
    setChatHistory([...chatHistory, newMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/manual-j/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          message: message.trim(),
          history: chatHistory,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      setChatHistory([...chatHistory, newMessage, data.message]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory([
        ...chatHistory,
        newMessage,
        { role: 'system', content: 'Sorry, there was an error processing your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const BotIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
  );

  const MessageComponent: React.FC<{ message: Message }> = ({ message }) => {
    const isUser = message.role === 'user';
    
    return (
      <motion.div 
        className="mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ChatBubble
          variant={isUser ? 'outgoing' : 'incoming'}
          avatar={!isUser ? <BotIcon /> : undefined}
        >
          <MarkdownRenderer content={message.content} />
          {!isUser && message.context && (
            <ContextPreview
              assumptions={message.context.assumptions}
              version={message.context.version}
            />
          )}
        </ChatBubble>
      </motion.div>
    );
  };

  return (
    <div className={`flex flex-col h-[600px] ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white rounded-t-lg">
        {chatHistory.map((msg, index) => (
          <MessageComponent key={index} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <ProcessingIndicator isProcessing={isLoading} />
        <div className="p-4">
          <MessageComposer
            onSubmit={(msg) => {
              setMessage(msg);
              handleSubmit(new Event('submit') as any);
            }}
            disabled={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
