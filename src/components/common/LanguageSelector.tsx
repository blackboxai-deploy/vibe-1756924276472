'use client';

import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' }
];

interface LanguageSelectorProps {
  variant?: 'select' | 'dropdown' | 'buttons';
  className?: string;
  showLabel?: boolean;
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  className = '',
  showLabel = true 
}: LanguageSelectorProps) {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (langCode: string) => {
    if (langCode === i18n.language) return;
    
    setIsChanging(true);
    try {
      await router.push(router.asPath, router.asPath, { locale: langCode });
    } catch (error) {
      console.error('Language change failed:', error);
    } finally {
      setIsChanging(false);
    }
  };

  if (variant === 'select') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {showLabel && (
          <label className="text-sm font-medium text-gray-700">
            {t('language')}
          </label>
        )}
        <Select 
          value={currentLanguage.code} 
          onValueChange={changeLanguage}
          disabled={isChanging}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((language) => (
              <SelectItem key={language.code} value={language.code}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{language.nativeName}</span>
                  <span className="text-sm text-gray-500">({language.name})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (variant === 'buttons') {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {showLabel && (
          <label className="text-sm font-medium text-gray-700">
            {t('selectLanguage')}
          </label>
        )}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {languages.map((language) => (
            <Button
              key={language.code}
              variant={currentLanguage.code === language.code ? 'default' : 'outline'}
              onClick={() => changeLanguage(language.code)}
              disabled={isChanging}
              className="justify-start text-left"
            >
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs opacity-70">{language.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Default dropdown variant
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`justify-between ${className}`}
          disabled={isChanging}
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">{currentLanguage.nativeName}</span>
            {showLabel && (
              <span className="text-sm text-gray-500 hidden sm:inline">
                ({currentLanguage.name})
              </span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={currentLanguage.code === language.code ? 'bg-gray-100' : ''}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{language.nativeName}</span>
              <span className="text-sm text-gray-500">{language.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simplified version for mobile/compact spaces
export function LanguageSelectorMobile({ className = '' }: { className?: string }) {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = async (langCode: string) => {
    if (langCode === i18n.language) return;
    
    setIsChanging(true);
    try {
      await router.push(router.asPath, router.asPath, { locale: langCode });
    } catch (error) {
      console.error('Language change failed:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className={`flex gap-1 ${className}`}>
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={currentLanguage.code === language.code ? 'default' : 'ghost'}
          size="sm"
          onClick={() => changeLanguage(language.code)}
          disabled={isChanging}
          className="text-xs px-2 py-1 h-auto min-w-[40px]"
        >
          {language.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}