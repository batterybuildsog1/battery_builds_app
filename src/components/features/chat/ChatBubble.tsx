import React from 'react';
import styled from 'styled-components';

interface ChatBubbleProps {
  variant: 'incoming' | 'outgoing';
  avatar?: React.ReactNode;
  children: React.ReactNode;
}

const BubbleContainer = styled.div<{ variant: 'incoming' | 'outgoing' }>`
  display: flex;
  align-items: flex-start;
  justify-content: ${({ variant }) => variant === 'incoming' ? 'flex-start' : 'flex-end'};
  margin: 8px 0;
  gap: 8px;
`;

const AvatarContainer = styled.div`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageContent = styled.div<{ variant: 'incoming' | 'outgoing' }>`
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: ${({ variant }) =>
    variant === 'incoming' ? 'var(--color-background-secondary)' : 'var(--color-primary)'};
  color: ${({ variant }) =>
    variant === 'incoming' ? 'var(--color-text-primary)' : 'var(--color-text-inverse)'};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  ${({ variant }) => variant === 'incoming'
    ? 'border-top-left-radius: 4px;'
    : 'border-top-right-radius: 4px;'
  }
`;

const ChatBubble: React.FC<ChatBubbleProps> = ({
  variant,
  avatar,
  children
}) => {
  return (
    <BubbleContainer variant={variant}>
      {variant === 'incoming' && avatar && (
        <AvatarContainer>
          {avatar}
        </AvatarContainer>
      )}
      <MessageContent variant={variant}>
        {children}
      </MessageContent>
      {variant === 'outgoing' && avatar && (
        <AvatarContainer>
          {avatar}
        </AvatarContainer>
      )}
    </BubbleContainer>
  );
};

export default ChatBubble;