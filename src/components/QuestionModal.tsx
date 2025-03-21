import React, { useState, useEffect } from 'react';
import { Question, Category } from '@/services/api-types';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (questionData: any) => Promise<void>;
  question?: Question | null;
  categoryId: number;
}

export function QuestionModal({ isOpen, onClose, onSave, question, categoryId }: QuestionModalProps) {
  const [formData, setFormData] = useState({
    question: '',
    categoryId: categoryId,
    answers: [
      { text: '', correct: true },
      { text: '', correct: false }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with question data when editing
  useEffect(() => {
    if (question) {
      console.log('Initializing modal with question data:', question); // Upphafsstilla
      setFormData({
        question: question.question,
        categoryId: question.categoryId || categoryId,
        answers: question.answers.map(a => ({
          id: a.id,
          text: a.answer, // Map from 'answer' field to 'text' for the form
          correct: a.correct
        }))
      });
    } else {
      // Reset form for new question
      setFormData({
        question: '',
        categoryId: categoryId,
        answers: [
          { text: '', correct: true },
          { text: '', correct: false }
        ]
      });
    }
  }, [question, categoryId, isOpen]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleAnswerChange = (index: number, field: 'text' | 'correct', value: string | boolean) => {
    const updatedAnswers = [...formData.answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };
    
    // If setting an answer as correct, make others not correct
    if (field === 'correct' && value === true) {
      updatedAnswers.forEach((_, i) => {
        if (i !== index) {
          updatedAnswers[i].correct = false;
        }
      });
    }
    
    setFormData({ ...formData, answers: updatedAnswers });
    console.log(`Answer ${index} changed - ${field}:`, value); // Svar breytt
  };

  const addAnswer = () => {
    const newAnswers = [...formData.answers, { text: '', correct: false }];
    setFormData({ ...formData, answers: newAnswers });
    console.log('Answer added - total answers:', newAnswers.length); // Bæti við
  };

  const removeAnswer = (index: number) => {
    if (formData.answers.length <= 2) {
      setError("A minimum of 2 answers is required"); // A.m.k. 2 svör
      return;
    }

    // If removing the only correct answer, make the first remaining answer correct
    const isRemovingCorrect = formData.answers[index].correct;
    const newAnswers = formData.answers.filter((_, i) => i !== index);
    
    if (isRemovingCorrect && !newAnswers.some(a => a.correct)) {
      newAnswers[0].correct = true;
    }

    setFormData({
      ...formData,
      answers: newAnswers
    });
    console.log(`Answer ${index} removed - remaining answers:`, newAnswers.length); // Eyði
  };

  const validateForm = () => {
    if (!formData.question.trim()) {
      setError('Question text cannot be empty'); // Tómt
      return false;
    }
    if (formData.answers.some(a => !a.text.trim())) {
      setError('All options must have text'); // Allt útfyllt
      return false;
    }
    if (!formData.answers.some(a => a.correct)) {
      setError('At least one answer must be marked as correct'); // Eitt rétt
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
      // Create a deep copy of the form data to avoid reference issues
      const formDataToSubmit = JSON.parse(JSON.stringify(formData));
      
      // Ensure answers are properly formatted for the API
      formDataToSubmit.answers = formDataToSubmit.answers.map((a: { text: string; correct: boolean; id?: number }) => ({
        text: a.text,
        correct: a.correct,
        // Exclude any IDs since the backend recreates all answers
      }));
      
      console.log('Modal submitting form data:', formDataToSubmit); // Sendi
      
      // Pass the form data to the parent component
      await onSave(formDataToSubmit);
      onClose();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'; // Óþekkt
      setError(`Failed to save question: ${errorMessage}`); // Villa
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">
            {question ? 'Edit Question' : 'Add New Question'} // Breyta/Nýtt
          </h2>
          
          {error && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Question:</label> // Spurning
              <input 
                type="text" 
                className="w-full p-2 border rounded" 
                value={formData.question} 
                onChange={handleQuestionChange} 
                required 
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-medium">Answers:</label> // Svör
                <button 
                  type="button" 
                  className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  onClick={addAnswer} 
                >
                  + Add Answer
                </button>
              </div>
              
              {formData.answers.map((answer, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={answer.correct} 
                    onChange={(e) => handleAnswerChange(index, 'correct', e.target.checked)} 
                  />
                  <input 
                    type="text" 
                    className="flex-1 p-2 border rounded" 
                    value={answer.text} 
                    onChange={(e) => handleAnswerChange(index, 'text', e.target.value)} 
                    placeholder={`Answer ${index + 1}`} 
                    required 
                  />
                  <button 
                    type="button" 
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    onClick={() => removeAnswer(index)}
                    disabled={formData.answers.length <= 2}
                  >
                    &times;
                  </button>
                </div>
              ))}
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
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {loading ? 'Saving...' : question ? 'Update' : 'Save'} // Vista/Uppfæra/Vista
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
