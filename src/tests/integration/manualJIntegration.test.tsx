import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import ManualJPage from '../../app/manual-j/page';
import { useManualJStore } from '../../lib/stores/manualJStore';
import { generateTheme } from '../../lib/theme';
import ChatContainer from '../../components/features/chat/ChatContainer';

// Mock fetch globally
global.fetch = jest.fn();

// Mock supabase client
jest.mock('../../../../supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    }
  }
}));

// Mock File object
const mockFile = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });

// Mock authenticated user
const mockAuthenticatedUser = {
  id: 'test-user-id',
  email: 'test@example.com'
};

// Mock store reset function
jest.mock('../../lib/stores/manualJStore', () => ({
  useManualJStore: jest.fn()
}));

describe('Manual J Integration Tests', () => {
  let mockStore: any;

  beforeEach(() => {
    // Reset fetch mock
    (global.fetch as jest.Mock).mockReset();

    // Initialize mock store
    mockStore = {
      pdfFile: null,
      location: '',
      isLoading: false,
      error: '',
      projectId: null,
      assumptions: null,
      results: null,
      setPdfFile: jest.fn(),
      setLocation: jest.fn(),
      setLoading: jest.fn(),
      setError: jest.fn(),
      setProjectId: jest.fn(),
      setAssumptions: jest.fn(),
      setResults: jest.fn(),
      reset: jest.fn(),
    };

    (useManualJStore as jest.Mock).mockImplementation(() => mockStore);
  });

  test('renders initial form correctly', () => {
    render(<ManualJPage />);
    
    expect(screen.getByText('Manual J Calculator')).toBeInTheDocument();
    expect(screen.getByTestId('manual-j-form')).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
  });

  test('handles file upload correctly', async () => {
    render(<ManualJPage />);
    
    const fileInput = screen.getByTestId('file-upload-input');
    
    await act(async () => {
      await userEvent.upload(fileInput, mockFile);
    });

    expect(mockStore.setPdfFile).toHaveBeenCalledWith(mockFile);
    expect(mockStore.setError).toHaveBeenCalledWith('');
  });

  test('validates form submission without file', async () => {
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    expect(mockStore.setError).toHaveBeenCalledWith('Please upload a PDF file.');
  });

  test('handles successful authenticated form submission', async () => {
    // Mock authenticated user
    const { supabase } = require('../../../../supabaseClient');
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockAuthenticatedUser },
      error: null
    });

    const mockProjectId = '123';
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({ 
          projectId: mockProjectId,
          userId: mockAuthenticatedUser.id 
        })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          chartData: 'mock-chart-data',
          csvData: 'mock-csv-data',
          dynamicAssumptions: '{}'
        })
      }));

    mockStore.pdfFile = mockFile;
    
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/manual-j/init', expect.any(Object));
    });
  });

  test('handles unauthenticated request correctly', async () => {
    // Mock unauthenticated user
    const { supabase } = require('../../../../supabaseClient');
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { message: 'Not authenticated' }
    });

    mockStore.pdfFile = mockFile;
    
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockStore.setError).toHaveBeenCalledWith('Authentication required');
    });
  });

  test('handles API errors correctly', async () => {
    // Mock authenticated user
    const { supabase } = require('../../../../supabaseClient');
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockAuthenticatedUser },
      error: null
    });

    const errorMessage = 'API Error';
    (global.fetch as jest.Mock).mockImplementationOnce(() => 
      Promise.resolve({
        json: () => Promise.resolve({ 
          error: errorMessage,
          code: 'API_ERROR'
        })
      })
    );

    mockStore.pdfFile = mockFile;
    
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockStore.setError).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('handles location input correctly', async () => {
    render(<ManualJPage />);
    
    const locationInput = screen.getByLabelText(/Location/i);
    const testLocation = '12345';
    
    await act(async () => {
      fireEvent.change(locationInput, { target: { value: testLocation } });
    });

    expect(mockStore.setLocation).toHaveBeenCalledWith(testLocation);
  });

  test('handles authentication error during submission', async () => {
    // Mock authentication error
    const { supabase } = require('../../../../supabaseClient');
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: { 
        message: 'Session expired',
        code: 'AUTH_ERROR'
      }
    });

    mockStore.pdfFile = mockFile;
    
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(mockStore.setError).toHaveBeenCalledWith('Authentication required');
      expect(mockStore.setLoading).toHaveBeenCalledWith(false);
    });
  });

  test('displays results after successful authenticated submission', async () => {
    // Mock authenticated user
    const { supabase } = require('../../../../supabaseClient');
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockAuthenticatedUser },
      error: null
    });

    const mockProjectId = '123';
    const mockChartData = 'mock-chart-data';
    const mockCsvData = 'mock-csv-data';
    
    (global.fetch as jest.Mock)
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({ projectId: mockProjectId })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        json: () => Promise.resolve({
          chartData: mockChartData,
          csvData: mockCsvData,
          dynamicAssumptions: '{}'
        })
      }));

    mockStore.pdfFile = mockFile;
    
    render(<ManualJPage />);
    
    const submitButton = screen.getByRole('button', { name: /run manual j/i });
    
    await act(async () => {
      fireEvent.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.queryByTestId('results-display')).toBeInTheDocument();
    });
  });

  test('handles assumptions editor updates', async () => {
    const mockProjectId = '123';
    mockStore.projectId = mockProjectId;
    
    const updatedAssumptions = { key: 'value' };
    
    (global.fetch as jest.Mock).mockImplementationOnce(() => Promise.resolve({
      json: () => Promise.resolve({
        chartData: 'updated-chart-data',
        csvData: 'updated-csv-data'
      })
    }));

    render(<ManualJPage />);
    
    const saveButton = screen.getByRole('button', { name: /save assumptions/i });
    
    await act(async () => {
      fireEvent.click(saveButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `/api/manual-j/${mockProjectId}/assumptions`,
        expect.any(Object)
      );
    });
  });
});

describe('Theme Integration Tests', () => {
  test('generates valid theme colors based on base hue', () => {
    const baseHue = 210; // Default blue hue
    const themeColors = generateTheme(baseHue);
    
    // Check primary colors
    expect(themeColors.primary.main).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.primary.light).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.primary.dark).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.primary.contrastText).toMatch(/^#[0-9A-F]{6}$/i);
    
    // Check secondary colors
    expect(themeColors.secondary.main).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.secondary.light).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.secondary.dark).toMatch(/^#[0-9A-F]{6}$/i);
    expect(themeColors.secondary.contrastText).toMatch(/^#[0-9A-F]{6}$/i);
  });
});

describe('Chat Animation Integration Tests', () => {
  test('chat messages have animation properties', () => {
    const mockMessages = [
      { role: 'user', content: 'Test message' },
      { role: 'assistant', content: 'Response message' }
    ];
    
    render(
      <ChatContainer
        projectId="test-project"
        chatHistory={mockMessages}
        setChatHistory={() => {}}
      />
    );
    
    // Check for Framer Motion animation properties
    const messageElements = screen.getAllByRole('article');
    messageElements.forEach(element => {
      expect(element.parentElement).toHaveStyle({
        opacity: '1'
      });
      // Check for motion div wrapper
      expect(element.parentElement).toHaveAttribute('data-motion');
    });
  });

  test('chat messages animate in sequence', async () => {
    const mockMessages = [
      { role: 'user', content: 'Test message' }
    ];
    
    const { rerender } = render(
      <ChatContainer
        projectId="test-project"
        chatHistory={mockMessages}
        setChatHistory={() => {}}
      />
    );
    
    // Add new message
    const updatedMessages = [
      ...mockMessages,
      { role: 'assistant', content: 'New message' }
    ];
    
    await act(async () => {
      rerender(
        <ChatContainer
          projectId="test-project"
          chatHistory={updatedMessages}
          setChatHistory={() => {}}
        />
      );
    });
    
    // Check that new message appears with animation
    const newMessage = screen.getByText('New message');
    expect(newMessage.parentElement?.parentElement).toHaveStyle({
      opacity: '1'
    });
  });

  test('processing indicator shows animation when loading', async () => {
    const mockMessages = [
      { role: 'user', content: 'Test message' }
    ];
    
    render(
      <ChatContainer
        projectId="test-project"
        chatHistory={mockMessages}
        setChatHistory={() => {}}
      />
    );
    
    // Trigger a new message to show loading state
    const input = screen.getByPlaceholderText('Type your message...');
    await act(async () => {
      await userEvent.type(input, 'New message{enter}');
    });
    
    // Check for processing indicator with animation
    const processingIndicator = screen.getByTestId('processing-indicator');
    expect(processingIndicator).toHaveStyle({
      animation: expect.stringContaining('pulse')
    });
  });
});
