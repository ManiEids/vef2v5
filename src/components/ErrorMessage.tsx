import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
      <p>{message}</p>
    </div>
  );
}
