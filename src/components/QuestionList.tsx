// F: Spurningalisti fall
'use client';

import { useState } from 'react';
import { Question } from '@/lib/datocms';

interface QuestionListProps {
  questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, boolean>>({});

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setAnsweredQuestions({ ...answeredQuestions, [questionId]: answerId });
  };

  const checkAnswer = (questionId: string) => {
    const selectedAnswerId = answeredQuestions[questionId];
    if (!selectedAnswerId) return;
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    const isCorrect = question.answers.find(a => a.id === selectedAnswerId)?.iscorrect;
    setFeedback({ ...feedback, [questionId]: isCorrect || false });
  };

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="space-card">
          <h3 className="mb-4">{question.text}</h3>
          <div className="mb-4">
            {question.answers.map((answer) => (
              <div key={answer.id} className="mb-2">
                <input
                  type="radio"
                  id={`answer-${answer.id}`}
                  name={`question-${question.id}`}
                  value={answer.id}
                  onChange={() => handleAnswerSelect(question.id, answer.id)}
                  disabled={feedback[question.id] !== undefined}
                  className="mr-2"
                />
                <label htmlFor={`answer-${answer.id}`}>{answer.text}</label>
              </div>
            ))}
          </div>
          {feedback[question.id] === undefined ? (
            <button onClick={() => checkAnswer(question.id)} disabled={!answeredQuestions[question.id]} className="space-button">
              Svara
            </button>
          ) : (
            <div className={feedback[question.id] ? "correct-answer" : "incorrect-answer"}>
              {feedback[question.id] ? '✓ Rétt svar!' : '✗ Rangt svar!'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
