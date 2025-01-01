import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { Question, QuestionType } from '../../lib/database/types';

interface TemplateBuilderProps {
  questions: Question[];
  onChange: (questions: Question[]) => void;
}

export function TemplateBuilder({ questions, onChange }: TemplateBuilderProps) {
  const [selectedType, setSelectedType] = useState<QuestionType>('text');

  const addQuestion = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: selectedType,
      text: '',
      required: false,
      options: selectedType === 'select' || selectedType === 'multiselect' ? ['Option 1'] : undefined
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], ...updates };
    onChange(updatedQuestions);
  };

  const removeQuestion = (e: React.MouseEvent, index: number) => {
    e.preventDefault(); // Prevent form submission
    const updatedQuestions = questions.filter((_, i) => i !== index);
    onChange(updatedQuestions);
  };

  const addOption = (e: React.MouseEvent, questionIndex: number) => {
    e.preventDefault(); // Prevent form submission
    const question = questions[questionIndex];
    if (!question.options) return;
    
    const newOptions = [...question.options, ''];
    updateQuestion(questionIndex, { options: newOptions });
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as QuestionType)}
          className="rounded-md border-sage-200"
          data-testid="question-type-select"
        >
          <option value="text">Short Text</option>
          <option value="textarea">Long Text</option>
          <option value="rating">Rating</option>
          <option value="select">Single Choice</option>
          <option value="multiselect">Multiple Choice</option>
        </select>
        <button
          onClick={addQuestion}
          className="flex items-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
          data-testid="add-question-button"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="questions">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
              data-testid="questions-list"
            >
              {questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-4 rounded-lg border border-sage-200 shadow-sm"
                      data-testid={`question-${index}`}
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          {...provided.dragHandleProps}
                          className="mt-2 cursor-move"
                        >
                          <GripVertical className="h-5 w-5 text-sage-400" />
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between">
                            <input
                              type="text"
                              value={question.text}
                              onChange={(e) =>
                                updateQuestion(index, { text: e.target.value })
                              }
                              placeholder="Question text"
                              className="flex-1 rounded-md border-sage-200"
                              data-testid={`question-text-${index}`}
                            />
                            <button
                              onClick={(e) => removeQuestion(e, index)}
                              className="ml-2 text-sage-400 hover:text-sage-600"
                              data-testid={`remove-question-${index}`}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>

                          {(question.type === 'select' ||
                            question.type === 'multiselect') && (
                            <div className="space-y-2">
                              {question.options?.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[optionIndex] = e.target.value;
                                      updateQuestion(index, { options: newOptions });
                                    }}
                                    className="flex-1 rounded-md border-sage-200"
                                    placeholder={`Option ${optionIndex + 1}`}
                                    data-testid={`question-${index}-option-${optionIndex}`}
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      const newOptions = question.options?.filter(
                                        (_, i) => i !== optionIndex
                                      );
                                      updateQuestion(index, { options: newOptions });
                                    }}
                                    className="text-sage-400 hover:text-sage-600"
                                    data-testid={`remove-option-${index}-${optionIndex}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                              <button
                                onClick={(e) => addOption(e, index)}
                                className="text-sm text-primary-600 hover:text-primary-700"
                                data-testid={`add-option-${index}`}
                              >
                                Add Option
                              </button>
                            </div>
                          )}

                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={question.required}
                                onChange={(e) =>
                                  updateQuestion(index, { required: e.target.checked })
                                }
                                className="rounded border-sage-300 text-primary-600"
                                data-testid={`question-required-${index}`}
                              />
                              <span className="text-sm text-sage-600">Required</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}