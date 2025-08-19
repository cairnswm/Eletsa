import React, { useState } from 'react';
import { Building, Save, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const OrganizerTab: React.FC = () => {
  const { user, updateProfile, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    vat_number: user?.vat_number === 'NO VAT' ? '' : (user?.vat_number || ''),
  });
  const [isNotVatRegistered, setIsNotVatRegistered] = useState(user?.vat_number === 'NO VAT');
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const vatValue = isNotVatRegistered ? 'NO VAT' : formData.vat_number.trim();
      
      // Validate VAT number if not checking "Not VAT Registered"
      if (!isNotVatRegistered && !vatValue) {
        return; // Form validation will handle this
      }
      
      await updateProfile({ vat_number: vatValue });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      // Error is handled by context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleNotVatRegisteredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsNotVatRegistered(checked);
    
    if (checked) {
      // Clear the VAT number input when "Not VAT Registered" is checked
      setFormData(prev => ({ ...prev, vat_number: '' }));
    }
  };

  if (!user) return null;

  return (
    <>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-600 text-sm">{error}</span>
        </div>
      )}

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-600 text-sm">Organizer details updated successfully!</span>
        </div>
      )}

      <div className="flex items-center space-x-2 mb-6">
        <Building className="w-6 h-6 text-[#489707]" />
        <h2 className="text-2xl font-bold text-gray-900">Organizer Information</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* VAT Number Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="w-5 h-5 text-[#1E30FF]" />
            <h3 className="text-lg font-semibold text-gray-900">Tax Information</h3>
          </div>

          {/* Not VAT Registered Checkbox */}
          <div className="mb-4">
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="not-vat-registered"
                checked={isNotVatRegistered}
                onChange={handleNotVatRegisteredChange}
                className="w-4 h-4 text-[#1E30FF] border-gray-300 rounded focus:ring-[#1E30FF]"
              />
              <label htmlFor="not-vat-registered" className="text-sm font-medium text-gray-700">
                Not VAT Registered
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 ml-7">
              Check this if your business is not registered for VAT
            </p>
          </div>

          {/* VAT Number Input */}
          {!isNotVatRegistered && (
            <div>
              <label htmlFor="vat_number" className="block text-sm font-medium text-gray-700 mb-2">
                VAT Number *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="vat_number"
                  name="vat_number"
                  type="text"
                  value={formData.vat_number}
                  onChange={handleChange}
                  required={!isNotVatRegistered}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E30FF] focus:border-transparent transition-all duration-200"
                  placeholder="Enter your VAT number"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter your business VAT registration number
              </p>
            </div>
          )}

          {/* Current Status Display */}
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Current VAT Status:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.vat_number === 'NO VAT' 
                  ? 'bg-gray-100 text-gray-800' 
                  : user.vat_number 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.vat_number === 'NO VAT' 
                  ? 'Not VAT Registered' 
                  : user.vat_number 
                    ? 'VAT Registered'
                    : 'Not Set'
                }
              </span>
            </div>
            {user.vat_number && user.vat_number !== 'NO VAT' && (
              <div className="mt-2 text-sm text-gray-600">
                VAT Number: <span className="font-mono">{user.vat_number}</span>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-6">
          <button
            type="submit"
            disabled={loading || (!isNotVatRegistered && !formData.vat_number.trim())}
            className="w-full bg-gradient-to-r from-[#489707] to-[#1E30FF] text-white py-3 px-4 rounded-lg font-medium hover:opacity-90 focus:ring-2 focus:ring-[#1E30FF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{loading ? 'Saving...' : 'Save Organizer Details'}</span>
          </button>
        </div>
      </form>
    </>
  );
};