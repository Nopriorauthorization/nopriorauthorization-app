import React, { useState } from 'react';

interface HIPAAConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

export default function HIPAAConsentModal({
  isOpen,
  onAccept,
  onDecline,
  isProcessing = false
}: HIPAAConsentModalProps) {
  const [hasReadConsent, setHasReadConsent] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">HIPAA Privacy Consent</h2>
              <p className="text-gray-600">Required before processing your lab documents</p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-gray-700 mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">🔒 How Your Data is Protected</h3>
              <ul className="space-y-1 text-blue-800">
                <li>• <strong>Client-Side Processing:</strong> Your lab documents are processed entirely in your browser</li>
                <li>• <strong>No External Sharing:</strong> Raw documents never leave your device</li>
                <li>• <strong>Encrypted Storage:</strong> Only parsed results are securely stored</li>
                <li>• <strong>Your Control:</strong> You can view, edit, and delete your data anytime</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">📋 What We Process</h3>
              <p className="text-green-800 mb-2">
                We extract and analyze lab test results including:
              </p>
              <ul className="space-y-1 text-green-800 ml-4">
                <li>• Test names and values</li>
                <li>• Reference ranges and status</li>
                <li>• Collection dates</li>
                <li>• Clinical insights and trends</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">🎯 How We Use Your Data</h3>
              <ul className="space-y-1 text-purple-800">
                <li>• Generate personalized health insights</li>
                <li>• Track trends and identify patterns</li>
                <li>• Provide clinical context and explanations</li>
                <li>• Help you understand your lab results better</li>
                <li>• Store securely in your private vault</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">⚖️ Your Rights Under HIPAA</h3>
              <ul className="space-y-1 text-yellow-800">
                <li>• <strong>Access:</strong> View all your stored health data</li>
                <li>• <strong>Correction:</strong> Request changes to inaccurate information</li>
                <li>• <strong>Deletion:</strong> Remove your data permanently</li>
                <li>• <strong>Portability:</strong> Export your data in standard formats</li>
                <li>• <strong>Revoke Consent:</strong> Stop processing at any time</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">🚫 What We DON'T Do</h3>
              <ul className="space-y-1 text-red-800">
                <li>• Share your data with third parties</li>
                <li>• Sell or monetize your health information</li>
                <li>• Use your data for marketing</li>
                <li>• Store raw lab documents or images</li>
                <li>• Transmit PHI to external services</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasReadConsent}
                onChange={(e) => setHasReadConsent(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div className="text-sm">
                <p className="font-medium text-gray-900 mb-1">
                  I have read and understand the HIPAA privacy consent
                </p>
                <p className="text-gray-600">
                  I consent to the processing of my lab documents for health insights and trend analysis.
                  I understand my rights and how my data is protected.
                </p>
              </div>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onDecline}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Decline
            </button>
            <button
              onClick={onAccept}
              disabled={!hasReadConsent || isProcessing}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {isProcessing ? 'Processing...' : 'Accept & Continue'}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4 text-center">
            By accepting, you acknowledge that this service is for informational purposes only and does not constitute medical advice.
          </p>
        </div>
      </div>
    </div>
  );
}