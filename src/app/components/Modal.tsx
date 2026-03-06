import React, { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 bg-gray-900/95 border-4 border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800/95 border-b-2 border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold hover:bg-gray-700/50 w-10 h-10 flex items-center justify-center rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
