import React from 'react';
import { AlertCircle } from 'lucide-react';

interface VATWarningProps {
  onConfigureClick: () => void;
  className?: string;
}

export const VATWarning: React.FC<VATWarningProps> = ({ onConfigureClick, className = '' }) => {
  return (
    <div className={`bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center space-x-3 ${className}`}>
      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-yellow-800 font-medium">VAT Configuration Required</p>
        <p className="text-yellow-700 text-sm">
          You cannot create events until you have completed your VAT configuration.
        </p>
      </div>
      <button
        onClick={onConfigureClick}
        className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200 flex-shrink-0"
      >
        Configure Now
      </button>
    </div>
  );
};