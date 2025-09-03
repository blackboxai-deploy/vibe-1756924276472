'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        {['en', 'hi', 'mr'].map((lang) => (
          <button
            key={lang}
            onClick={() => handleLanguageChange(lang)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              currentLanguage === lang
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'मर'}
          </button>
        ))}
      </div>

      {/* Logo */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">A</span>
        </div>
        <h1 className="text-2xl font-bold text-green-700">Agriconnect</h1>
      </div>

      <LoginForm 
        onLanguageChange={handleLanguageChange}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}