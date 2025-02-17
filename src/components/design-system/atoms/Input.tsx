import React, { forwardRef, useState } from 'react';
import styled, { css } from 'styled-components';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

const InputWrapper = styled.div<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;

const StyledInput = styled.input<{ hasError?: boolean; isFocused?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.hasError ? '#EF4444' : '#D1D5DB'};
  font-size: 0.875rem;
  line-height: 1.25rem;
  width: 100%;
  transition: all 0.15s ease-in-out;

  &:hover {
    border-color: ${props => props.hasError ? '#EF4444' : '#9CA3AF'};
  }

  ${props => props.isFocused && css`
    border-color: ${props.hasError ? '#EF4444' : '#2563EB'};
    box-shadow: 0 0 0 3px ${props.hasError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
  `}

  &:disabled {
    background-color: #F3F4F6;
    cursor: not-allowed;
  }

  &::placeholder {
    color: #9CA3AF;
  }
`;

const HelperText = styled.span<{ isError?: boolean }>`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${props => props.isError ? '#EF4444' : '#6B7280'};
`;

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <InputWrapper fullWidth={fullWidth} className={className}>
      {label && <Label htmlFor={props.id}>{label}</Label>}
      <StyledInput
        ref={ref}
        hasError={!!error}
        isFocused={isFocused}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-invalid={!!error}
        aria-describedby={
          (error || helperText) ? `${props.id}-helper-text` : undefined
        }
        {...props}
      />
      {(error || helperText) && (
        <HelperText
          id={`${props.id}-helper-text`}
          isError={!!error}
        >
          {error || helperText}
        </HelperText>
      )}
    </InputWrapper>
  );
});

Input.displayName = 'Input';

export default Input;