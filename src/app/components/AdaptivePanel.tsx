import React, { ReactNode } from 'react';
import { useIsDesktop } from '../hooks/useMediaQuery';
import { Modal } from './Modal';

interface AdaptivePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function AdaptivePanel({ isOpen, onClose, title, children }: AdaptivePanelProps) {
  const isDesktop = useIsDesktop();

  // Mobile: Modal
  if (!isDesktop) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        {children}
      </Modal>
    );
  }

  // Desktop: Sidepanel fixo do lado direito
  return (
    <>
      {/* Sidepanel */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-gray-900/95 border-l-4 border-gray-700 shadow-2xl overflow-y-auto z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header com X */}
        <div className="sticky top-0 bg-gray-800/95 border-b-2 border-gray-700 p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-yellow-400">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 text-2xl font-bold hover:bg-gray-700/50 w-10 h-10 flex items-center justify-center rounded transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-white">
          {children}
        </div>
      </div>

      {/* Overlay/Backdrop (apenas visual, não impede interações) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30"
          onClick={onClose}
        />
      )}
    </>
  );
}
