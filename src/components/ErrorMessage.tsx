import React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="bg-red-100 text-red-800 p-3 rounded">
      {message}
    </div>
  );
}
