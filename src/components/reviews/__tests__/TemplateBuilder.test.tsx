import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TemplateBuilder } from '../TemplateBuilder';
import { vi, describe, it, expect } from 'vitest';

// Mock @hello-pangea/dnd
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: Function }) => children({
    draggableProps: {},
    innerRef: null,
  }),
  Draggable: ({ children }: { children: Function }) => children({
    draggableProps: {},
    dragHandleProps: {},
    innerRef: null,
  }),
}));

describe('TemplateBuilder', () => {
  const defaultProps = {
    questions: [],
    onChange: vi.fn(),
  };

  it('adds a new question when clicking add button', () => {
    render(<TemplateBuilder {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('add-question-button'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({
        type: 'text',
        text: '',
        required: false,
      })
    ]));
  });

  it('removes a question when clicking remove button', () => {
    const questions = [{
      id: '1',
      type: 'text',
      text: 'Test Question',
      required: false,
    }];

    render(<TemplateBuilder questions={questions} onChange={defaultProps.onChange} />);
    
    fireEvent.click(screen.getByTestId('remove-question-0'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith([]);
  });

  it('updates question text when typing', () => {
    const questions = [{
      id: '1',
      type: 'text',
      text: '',
      required: false,
    }];

    render(<TemplateBuilder questions={questions} onChange={defaultProps.onChange} />);
    
    fireEvent.change(screen.getByTestId('question-text-0'), {
      target: { value: 'New Question Text' }
    });
    
    expect(defaultProps.onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        text: 'New Question Text'
      })
    ]);
  });

  it('adds options for select/multiselect questions', () => {
    const questions = [{
      id: '1',
      type: 'select',
      text: 'Test Question',
      required: false,
      options: ['Option 1']
    }];

    render(<TemplateBuilder questions={questions} onChange={defaultProps.onChange} />);
    
    fireEvent.click(screen.getByTestId('add-option-0'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith([
      expect.objectContaining({
        options: ['Option 1', '']
      })
    ]);
  });
});