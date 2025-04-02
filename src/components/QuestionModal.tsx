import React, { useState, useEffect } from 'react';
import { Question, Answer, Category } from '@/lib/datocms';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: any) => Promise<void>;
  question: Question | null;
  categoryId: string;
}

export function QuestionModal({ isOpen, onClose, onSave, question, categoryId }: QuestionModalProps) {
  const [questionText, setQuestionText] = useState('');
  const [answers, setAnswers] = useState<Array<{id?: string; text: string; iscorrect: boolean}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (question) {
      setQuestionText(question.text);
      setAnswers(question.answers.map(a => ({
        id: a.id,
        text: a.text,
        iscorrect: a.iscorrect
      })));
    } else {
      setQuestionText('');
      setAnswers([
        { text: '', iscorrect: true },
        { text: '', iscorrect: false },
        { text: '', iscorrect: false },
        { text: '', iscorrect: false }
      ]);
    }
  }, [question, isOpen]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  const handleAnswerTextChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index].text = value;
    setAnswers(newAnswers);
  };

  const handleAnswerCorrectChange = (index: number) => {
    const newAnswers = answers.map((answer, i) => ({
      ...answer,
      iscorrect: i === index
    }));
    setAnswers(newAnswers);
  };

  const validateForm = () => {
    if (!questionText.trim()) {
      setError('Question text cannot be empty');
      return false;
    }
    
    if (answers.some(a => !a.text.trim())) {
      setError('All answers must have text');
      return false;
    }
    
    if (!answers.some(a => a.iscorrect)) {
      setError('At least one answer must be correct');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const formData = {
        text: questionText,
        categoryId,
        answers: answers.map(answer => ({
          text: answer.text,
          iscorrect: answer.iscorrect,
          id: answer.id
        }))
      };

      await onSave(formData);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to save question: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-md overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {question ? 'Edit Question' : 'Add New Question'}
          </h2>
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Question:</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={questionText} 
                onChange={handleQuestionChange} 
                required 
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Answers:</label>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={answer.iscorrect}
                      onChange={() => handleAnswerCorrectChange(index)}
                      className="mr-2"
                    />
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => handleAnswerTextChange(index, e.target.value)}
                      className="flex-1 p-2 border rounded"
                      placeholder={`Answer option ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : question ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
