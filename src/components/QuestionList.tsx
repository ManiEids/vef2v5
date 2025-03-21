"use client";

import React, { useState } from 'react';
import { Question } from '@/services/api-types';

interface QuestionListProps {
  questions: Question[];
}

export function QuestionList({ questions }: QuestionListProps) {
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<string | number, string | number>>({});
  const [feedback, setFeedback] = useState<Record<string | number, boolean | null>>({});

  if (questions.length === 0) {
    return <p>No questions found in this category.</p>;
  }

  const handleAnswerSelect = (questionId: string | number, answerId: string | number) => {
    setAnsweredQuestions({
      ...answeredQuestions,
      [questionId]: answerId,
    });
  };

  const checkAnswer = (questionId: string | number) => {
    const selectedAnswerId = answeredQuestions[questionId];
    if (!selectedAnswerId) return;
    
    const question = questions.find(q => q.id === questionId);
    if (!question) return;
    
    const isCorrect = question.answers.find(a => a.id === selectedAnswerId)?.correct;
    
    setFeedback({
      ...feedback,
      [questionId]: isCorrect || false,
    });
  };

  return (
    <div className="space-y-8">
      {questions.map((question) => (
        <div key={question.id} className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">{question.question}</h3> {/* Use question instead of text */}
          
          <div className="space-y-2">
            {question.answers.map((answer) => (
              <div key={answer.id} className="flex items-center">
                <input
                  type="radio"
                  id={`answer-${answer.id}`}
                  name={`question-${question.id}`}
                  value={answer.id}
                  onChange={() => handleAnswerSelect(question.id, answer.id)}
                  className="mr-2"
                  disabled={feedback[question.id] !== undefined}
                />
                <label htmlFor={`answer-${answer.id}`}>{answer.answer}</label> {/* Use answer instead of text */}
              </div>
            ))}
          </div>
          
          {feedback[question.id] === undefined ? (
            <button
              onClick={() => checkAnswer(question.id)}
              disabled={!answeredQuestions[question.id]}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Submit Answer
            </button>
          ) : (
            <div className={`mt-4 p-3 rounded ${feedback[question.id] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback[question.id] ? 'Correct!' : 'Incorrect!'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
