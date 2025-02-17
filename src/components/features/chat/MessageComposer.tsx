import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import styles from './MessageComposer.module.css';

/**
 * MessageComposer Component
 * 
 * Styling Implementation:
 * - Uses CSS Modules with Tailwind CSS utility classes
 * - Styles are defined in MessageComposer.module.css
 * - Component uses the following styled elements:
 *   - messageComposer: Main container
 *   - inputContainer: Wrapper for textarea and send button
 *   - textarea: Main input field with auto-resize
 *   - sendButton: Submit button with icon
 *   - suggestions: Dropdown container for suggestions
 *   - suggestionItem: Individual suggestion buttons
 */

interface MessageComposerProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  suggestions?: string[];
  disabled?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSubmit,
  placeholder = 'Type your message...',
  suggestions = [],
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message.trim());
      setMessage('');
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className={styles.messageComposer}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            adjustTextareaHeight();
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          placeholder={placeholder}
          className={styles.textarea}
          disabled={disabled}
          rows={1}
          aria-label="Message input"
        />
        <button
          onClick={handleSubmit}
          className={styles.sendButton}
          disabled={!message.trim() || disabled}
          aria-label="Send message"
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            className={styles.sendIcon}
          >
            <path
              fill="currentColor"
              d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
            />
          </svg>
        </button>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestions}>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageComposer;
