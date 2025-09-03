'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

const phoneSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
});

const otpSchema = z.object({
  otp: z.string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface LoginFormProps {
  onLanguageChange?: (language: string) => void;
  currentLanguage?: string;
}

export function LoginForm({ onLanguageChange, currentLanguage = 'en' }: LoginFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: '' }
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const translations = {
    en: {
      title: 'Login to Agriconnect',
      subtitle: 'Enter your phone number to continue',
      otpSubtitle: 'Enter the OTP sent to your phone',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter 10-digit phone number',
      otpLabel: 'OTP',
      otpPlaceholder: 'Enter 6-digit OTP',
      sendOTP: 'Send OTP',
      verifyOTP: 'Verify OTP',
      resendOTP: 'Resend OTP',
      resendIn: 'Resend in',
      seconds: 'seconds',
      backToPhone: 'Back to Phone Number',
      registerLink: "Don't have an account? Register here",
      connecting: 'Connecting...',
      verifying: 'Verifying...',
    },
    hi: {
      title: 'Agriconnect में लॉग इन करें',
      subtitle: 'जारी रखने के लिए अपना फोन नंबर दर्ज करें',
      otpSubtitle: 'आपके फोन पर भेजा गया OTP दर्ज करें',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: '10 अंकों का फोन नंबर दर्ज करें',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकों का OTP दर्ज करें',
      sendOTP: 'OTP भेजें',
      verifyOTP: 'OTP सत्यापित करें',
      resendOTP: 'OTP दोबारा भेजें',
      resendIn: 'दोबारा भेजें',
      seconds: 'सेकंड में',
      backToPhone: 'फोन नंबर पर वापस जाएं',
      registerLink: 'खाता नहीं है? यहां पंजीकरण करें',
      connecting: 'कनेक्ट हो रहा है...',
      verifying: 'सत्यापित हो रहा है...',
    },
    mr: {
      title: 'Agriconnect मध्ये लॉग इन करा',
      subtitle: 'सुरू ठेवण्यासाठी आपला फोन नंबर टाका',
      otpSubtitle: 'आपल्या फोनवर पाठवलेला OTP टाका',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: '10 अंकी फोन नंबर टाका',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकी OTP टाका',
      sendOTP: 'OTP पाठवा',
      verifyOTP: 'OTP तपासा',
      resendOTP: 'OTP पुन्हा पाठवा',
      resendIn: 'पुन्हा पाठवा',
      seconds: 'सेकंदात',
      backToPhone: 'फोन नंबरवर परत जा',
      registerLink: 'खाते नाही? इथे नोंदणी करा',
      connecting: 'जोडत आहे...',
      verifying: 'तपासत आहे...',
    }
  };

  const t = translations[currentLanguage as keyof typeof translations] || translations.en;

  const startTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (data: PhoneFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: data.phone,
          language: currentLanguage 
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPhoneNumber(data.phone);
        setStep('otp');
        setOtpSent(true);
        startTimer();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phoneNumber, 
          otp: data.otp 
        }),
      });

      const result = await response.json();

      if (result.success) {
        // Store token and redirect
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Redirect based on user role
        const dashboardPath = `/dashboard/${result.data.user.role}`;
        router.push(dashboardPath);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    startTimer();
    
    try {
      await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: phoneNumber,
          language: currentLanguage 
        }),
      });
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-700">
          {t.title}
        </CardTitle>
        <CardDescription>
          {step === 'phone' ? t.subtitle : t.otpSubtitle}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === 'phone' ? (
          <form onSubmit={phoneForm.handleSubmit(handleSendOTP)} className="space-y-4">
            <div>
              <Label htmlFor="phone">{t.phoneLabel}</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={t.phonePlaceholder}
                {...phoneForm.register('phone')}
                className="mt-1"
                maxLength={10}
              />
              {phoneForm.formState.errors.phone && (
                <p className="text-sm text-red-600 mt-1">
                  {phoneForm.formState.errors.phone.message}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.connecting}
                </>
              ) : (
                t.sendOTP
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={otpForm.handleSubmit(handleVerifyOTP)} className="space-y-4">
            <div>
              <Label htmlFor="otp">{t.otpLabel}</Label>
              <Input
                id="otp"
                type="tel"
                placeholder={t.otpPlaceholder}
                {...otpForm.register('otp')}
                className="mt-1 text-center text-2xl tracking-widest"
                maxLength={6}
                autoFocus
              />
              {otpForm.formState.errors.otp && (
                <p className="text-sm text-red-600 mt-1">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="text-center text-sm text-gray-600">
              <p>OTP sent to +91 {phoneNumber}</p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t.verifying}
                </>
              ) : (
                t.verifyOTP
              )}
            </Button>

            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep('phone')}
                className="text-sm"
              >
                {t.backToPhone}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendOTP}
                disabled={resendTimer > 0}
                className="text-sm"
              >
                {resendTimer > 0 
                  ? `${t.resendIn} ${resendTimer} ${t.seconds}`
                  : t.resendOTP
                }
              </Button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Button
              variant="link"
              onClick={() => router.push('/register')}
              className="text-green-600 hover:text-green-700 p-0 h-auto"
            >
              {t.registerLink}
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}