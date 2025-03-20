import React, { useState } from 'react';
import { Answer, Category } from '@/services/api';

// Skilgreining á gerð svars í formi
interface AnswerFormData {
  id?: string;
  text: string;
  isCorrect: boolean;
}

interface QuestionFormProps {
  onSubmit: (text: string, answers: AnswerFormData[]) => Promise<void>;
  categories: Category[];
  selectedCategorySlug?: string;
  initialText?: string;
  initialAnswers?: AnswerFormData[];
}

export function QuestionForm({ 
  onSubmit, 
  categories, 
  selectedCategorySlug,
  initialText = '', 
  initialAnswers = [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]
}: QuestionFormProps) {
  const [categorySlug, setCategorySlug] = useState(selectedCategorySlug || '');
  const [text, setText] = useState(initialText);
  const [answers, setAnswers] = useState<AnswerFormData[]>(initialAnswers);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnswerChange = (index: number, field: keyof AnswerFormData, value: string | boolean) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = { ...updatedAnswers[index], [field]: value };

    // Ef þetta svar er sett sem rétt, stillum öll önnur svör sem röng
    if (field === 'isCorrect' && value === true) {
      updatedAnswers.forEach((answer, i) => {
        if (i !== index) {
          updatedAnswers[i] = { ...answer, isCorrect: false };
        }
      });
    }

    setAnswers(updatedAnswers);
  };

  const addAnswer = () => {
    setAnswers([...answers, { text: '', isCorrect: false }]);
  };

  const removeAnswer = (index: number) => {
    // Passað að halda a.m.k. tveimur svörum
    if (answers.length <= 2) {
      return;
    }
    
    const updatedAnswers = answers.filter((_, i) => i !== index);
    
    // Ef við fjarlægðum rétta svarið, stillum fyrsta sem rétt
    if (answers[index].isCorrect) {
      updatedAnswers[0] = { ...updatedAnswers[0], isCorrect: true };
    }
    
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Einföld validation
    if (text.trim() === '') {
      setError('Spurning má ekki vera tóm');
      return;
    }
    
    if (answers.some(answer => answer.text.trim() === '')) {
      setError('Svör mega ekki vera tóm');
      return;
    }
    
    if (!answers.some(answer => answer.isCorrect)) {
      setError('Það verður að vera að minnsta kosti eitt rétt svar');
      return;
    }
    
    if (!selectedCategorySlug && !categorySlug) {
      setError('Veldu flokk fyrir spurninguna');
      return;
    }

    setLoading(true);

    try {
      await onSubmit(text, answers);
      
      // Ef þetta er ný spurning, hreinsum formið
      if (!initialText) {
        setText('');
        setAnswers([
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Villa kom upp');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-800 p-3 rounded">
          {error}
        </div>
      )}
      
      {!selectedCategorySlug && (
        <div>
          <label htmlFor="category" className="block mb-1 font-medium">
            Flokkur
          </label>
          <select
            id="category"
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          >
            <option value="">Veldu flokk</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div>
        <label htmlFor="question" className="block mb-1 font-medium">
          Spurning
        </label>
        <input
          id="question"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Slá inn spurningu"
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      
      <div className="space-y-4">
        <label className="block font-medium">Svör</label>
        
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center space-x-2 p-3 border rounded">
            <input
              type="checkbox"
              checked={answer.isCorrect}
              onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
              className="mr-2"
            />
            <input
              type="text"
              value={answer.text}
              onChange={(e) => handleAnswerChange(index, 'text', e.target.value)}
              placeholder={`Svar ${index + 1}`}
              className="flex-grow px-3 py-2 border rounded"
              required
            />
            <button
              type="button"
              onClick={() => removeAnswer(index)}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-300"
              disabled={answers.length <= 2}
            >
              Eyða
            </button>
          </div>
        ))}
        
        <button
          type="button"
          onClick={addAnswer}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Bæta við svari
        </button>
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? 'Vista...' : initialText ? 'Uppfæra spurningu' : 'Búa til spurningu'}
      </button>
    </form>
  );
}
