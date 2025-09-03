'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { Badge } from '@/components/ui/badge';
import { Loader2, ChevronLeft } from 'lucide-react';
import { UserRole, WorkType, CropType } from '@/types';

const phoneOtpSchema = z.object({
  phone: z.string()
    .min(10, 'Phone number must be 10 digits')
    .max(10, 'Phone number must be 10 digits')
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid Indian phone number'),
  otp: z.string()
    .min(6, 'OTP must be 6 digits')
    .max(6, 'OTP must be 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only numbers'),
});

const profileSchema = z.object({
  role: z.enum(['farmer', 'labourer']),
  language: z.enum(['en', 'hi', 'mr']),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  state: z.string().min(1, 'State is required'),
  district: z.string().min(1, 'District is required'),
  village: z.string().min(1, 'Village is required'),
  // Farmer-specific fields
  farmSize: z.number().optional(),
  primaryCrops: z.array(z.string()).optional(),
  farmingExperience: z.number().optional(),
  // Labourer-specific fields
  skills: z.array(z.string()).optional(),
  experience: z.number().optional(),
  maxTravelDistance: z.number().optional(),
});

type PhoneOtpFormData = z.infer<typeof phoneOtpSchema>;
type ProfileFormData = z.infer<typeof profileSchema>;

interface RegisterFormProps {
  currentLanguage?: string;
}

const workTypes: WorkType[] = ['planting', 'harvesting', 'weeding', 'pesticide', 'irrigation', 'general'];
const cropTypes: CropType[] = ['rice', 'wheat', 'cotton', 'sugarcane', 'vegetables', 'fruits', 'other'];

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

export function RegisterForm({ currentLanguage = 'en' }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (searchParams.get('role') as UserRole) || 'farmer'
  );

  const phoneOtpForm = useForm<PhoneOtpFormData>({
    resolver: zodResolver(phoneOtpSchema),
    defaultValues: { phone: '', otp: '' }
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      role: selectedRole,
      language: currentLanguage as any,
      name: '',
      state: '',
      district: '',
      village: '',
      farmSize: 1,
      primaryCrops: [],
      farmingExperience: 1,
      skills: [],
      experience: 1,
      maxTravelDistance: 50,
    }
  });

  const translations = {
    en: {
      title: 'Join Agriconnect',
      subtitle: 'Create your account to get started',
      phoneSubtitle: 'Enter your phone number to continue',
      otpSubtitle: 'Enter the OTP sent to your phone',
      profileSubtitle: 'Complete your profile information',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter 10-digit phone number',
      otpLabel: 'OTP',
      otpPlaceholder: 'Enter 6-digit OTP',
      sendOTP: 'Send OTP',
      verifyOTP: 'Verify & Continue',
      resendOTP: 'Resend OTP',
      resendIn: 'Resend in',
      seconds: 'seconds',
      back: 'Back',
      selectRole: 'I am a',
      farmer: 'Farmer',
      labourer: 'Agricultural Worker',
      language: 'Preferred Language',
      personalInfo: 'Personal Information',
      name: 'Full Name',
      namePlaceholder: 'Enter your full name',
      location: 'Location',
      state: 'State',
      district: 'District',
      village: 'Village',
      selectState: 'Select your state',
      enterDistrict: 'Enter your district',
      enterVillage: 'Enter your village',
      farmerDetails: 'Farm Details',
      farmSize: 'Farm Size (acres)',
      primaryCrops: 'Primary Crops',
      farmingExperience: 'Farming Experience (years)',
      labourerDetails: 'Work Details',
      skills: 'Skills & Work Types',
      workExperience: 'Work Experience (years)',
      travelDistance: 'Maximum Travel Distance (km)',
      selectSkills: 'Select your skills',
      selectCrops: 'Select crops you grow',
      createAccount: 'Create Account',
      loginLink: 'Already have an account? Login here',
      creating: 'Creating Account...',
      chooseAtLeastOne: 'Please choose at least one',
    },
    hi: {
      title: 'Agriconnect में शामिल हों',
      subtitle: 'शुरू करने के लिए अपना खाता बनाएं',
      phoneSubtitle: 'जारी रखने के लिए अपना फोन नंबर दर्ज करें',
      otpSubtitle: 'आपके फोन पर भेजा गया OTP दर्ज करें',
      profileSubtitle: 'अपनी प्रोफ़ाइल जानकारी पूरी करें',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: '10 अंकों का फोन नंबर दर्ज करें',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकों का OTP दर्ज करें',
      sendOTP: 'OTP भेजें',
      verifyOTP: 'सत्यापित करें और आगे बढ़ें',
      resendOTP: 'OTP दोबारा भेजें',
      resendIn: 'दोबारा भेजें',
      seconds: 'सेकंड में',
      back: 'वापस',
      selectRole: 'मैं हूं',
      farmer: 'किसान',
      labourer: 'कृषि श्रमिक',
      language: 'पसंदीदा भाषा',
      personalInfo: 'व्यक्तिगत जानकारी',
      name: 'पूरा नाम',
      namePlaceholder: 'अपना पूरा नाम दर्ज करें',
      location: 'स्थान',
      state: 'राज्य',
      district: 'जिला',
      village: 'गांव',
      selectState: 'अपना राज्य चुनें',
      enterDistrict: 'अपना जिला दर्ज करें',
      enterVillage: 'अपना गांव दर्ज करें',
      farmerDetails: 'खेत की जानकारी',
      farmSize: 'खेत का आकार (एकड़)',
      primaryCrops: 'मुख्य फसलें',
      farmingExperience: 'खेती का अनुभव (वर्ष)',
      labourerDetails: 'काम की जानकारी',
      skills: 'कौशल और काम के प्रकार',
      workExperience: 'काम का अनुभव (वर्ष)',
      travelDistance: 'अधिकतम यात्रा दूरी (किमी)',
      selectSkills: 'अपने कौशल चुनें',
      selectCrops: 'अपनी फसलें चुनें',
      createAccount: 'खाता बनाएं',
      loginLink: 'पहले से खाता है? यहां लॉग इन करें',
      creating: 'खाता बनाया जा रहा है...',
      chooseAtLeastOne: 'कृपया कम से कम एक चुनें',
    },
    mr: {
      title: 'Agriconnect मध्ये सामील व्हा',
      subtitle: 'सुरुवात करण्यासाठी आपले खाते तयार करा',
      phoneSubtitle: 'सुरू ठेवण्यासाठी आपला फोन नंबर टाका',
      otpSubtitle: 'आपल्या फोनवर पाठवलेला OTP टाका',
      profileSubtitle: 'आपली प्रोफाइल माहिती पूर्ण करा',
      phoneLabel: 'फोन नंबर',
      phonePlaceholder: '10 अंकी फोन नंबर टाका',
      otpLabel: 'OTP',
      otpPlaceholder: '6 अंकी OTP टाका',
      sendOTP: 'OTP पाठवा',
      verifyOTP: 'तपासा आणि पुढे जा',
      resendOTP: 'OTP पुन्हा पाठवा',
      resendIn: 'पुन्हा पाठवा',
      seconds: 'सेकंदात',
      back: 'परत',
      selectRole: 'मी आहे',
      farmer: 'शेतकरी',
      labourer: 'कृषी कामगार',
      language: 'पसंतीची भाषा',
      personalInfo: 'वैयक्तिक माहिती',
      name: 'पूर्ण नाव',
      namePlaceholder: 'आपले पूर्ण नाव टाका',
      location: 'ठिकाण',
      state: 'राज्य',
      district: 'जिल्हा',
      village: 'गाव',
      selectState: 'आपले राज्य निवडा',
      enterDistrict: 'आपला जिल्हा टाका',
      enterVillage: 'आपले गाव टाका',
      farmerDetails: 'शेताची माहिती',
      farmSize: 'शेताचा आकार (एकर)',
      primaryCrops: 'मुख्य पिके',
      farmingExperience: 'शेतीचा अनुभव (वर्ष)',
      labourerDetails: 'कामाची माहिती',
      skills: 'कौशल्ये आणि कामाचे प्रकार',
      workExperience: 'कामाचा अनुभव (वर्ष)',
      travelDistance: 'जास्तीत जास्त प्रवास अंतर (किमी)',
      selectSkills: 'आपली कौशल्ये निवडा',
      selectCrops: 'आपली पिके निवडा',
      createAccount: 'खाते तयार करा',
      loginLink: 'आधीच खाते आहे? इथे लॉग इन करा',
      creating: 'खाते तयार करत आहे...',
      chooseAtLeastOne: 'कृपया किमान एक निवडा',
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

  const handleSendOTP = async (data: { phone: string }) => {
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
        startTimer();
        phoneOtpForm.setValue('otp', '');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (data: { otp: string }) => {
    setIsLoading(true);
    setError('');

    try {
      // Just verify OTP for now, don't complete registration
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
        // User exists, redirect to login
        router.push('/login');
        return;
      } else if (result.redirectTo === '/register') {
        // Continue with registration
        setStep('profile');
      } else {
        setError(result.message);
      }
    } catch (error) {
      // Assume new user for demo purposes
      setStep('profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: ProfileFormData) => {
    setIsLoading(true);
    setError('');

    try {
      const registrationData = {
        phone: phoneNumber,
        otp: phoneOtpForm.getValues('otp'),
        role: data.role,
        language: data.language,
        name: data.name,
        location: {
          state: data.state,
          district: data.district,
          village: data.village,
        },
        ...(data.role === 'farmer' ? {
          farmDetails: {
            farmSize: data.farmSize || 0,
            primaryCrops: data.primaryCrops || [],
            farmingExperience: data.farmingExperience || 0,
          }
        } : {
          skills: data.skills || [],
          experience: data.experience || 0,
          maxTravelDistance: data.maxTravelDistance || 50,
        })
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      });

      const result = await response.json();

      if (result.success) {
        // Store token and redirect
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        
        // Redirect to dashboard
        router.push(`/dashboard/${result.data.user.role}`);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneStep = () => (
    <form onSubmit={phoneOtpForm.handleSubmit((data) => handleSendOTP({ phone: data.phone }))} className="space-y-4">
      <div>
        <Label htmlFor="phone">{t.phoneLabel}</Label>
        <Input
          id="phone"
          type="tel"
          placeholder={t.phonePlaceholder}
          {...phoneOtpForm.register('phone')}
          className="mt-1"
          maxLength={10}
        />
        {phoneOtpForm.formState.errors.phone && (
          <p className="text-sm text-red-600 mt-1">
            {phoneOtpForm.formState.errors.phone.message}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <Label>{t.selectRole}</Label>
        <div className="grid grid-cols-2 gap-4">
          {(['farmer', 'labourer'] as UserRole[]).map((role) => (
            <Card 
              key={role}
              className={`cursor-pointer transition-all ${
                selectedRole === role 
                  ? 'border-green-500 bg-green-50' 
                  : 'hover:border-gray-300'
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <CardContent className="p-4 text-center">
                <div className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                  role === 'farmer' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  <span className="text-2xl">
                    {role === 'farmer' ? '🌾' : '👨‍🌾'}
                  </span>
                </div>
                <p className="font-medium">{t[role]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          t.sendOTP
        )}
      </Button>
    </form>
  );

  const renderOTPStep = () => (
    <form onSubmit={phoneOtpForm.handleSubmit((data) => handleVerifyOTP({ otp: data.otp }))} className="space-y-4">
      <div>
        <Label htmlFor="otp">{t.otpLabel}</Label>
        <Input
          id="otp"
          type="tel"
          placeholder={t.otpPlaceholder}
          {...phoneOtpForm.register('otp')}
          className="mt-1 text-center text-2xl tracking-widest"
          maxLength={6}
          autoFocus
        />
        {phoneOtpForm.formState.errors.otp && (
          <p className="text-sm text-red-600 mt-1">
            {phoneOtpForm.formState.errors.otp.message}
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
            Verifying...
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
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t.back}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          onClick={() => handleSendOTP({ phone: phoneNumber })}
          disabled={resendTimer > 0 || isLoading}
          className="text-sm"
        >
          {resendTimer > 0 
            ? `${t.resendIn} ${resendTimer} ${t.seconds}`
            : t.resendOTP
          }
        </Button>
      </div>
    </form>
  );

  const renderProfileStep = () => (
    <form onSubmit={profileForm.handleSubmit(handleRegister)} className="space-y-6">
      {/* Personal Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t.personalInfo}</h3>
        
        <div>
          <Label htmlFor="name">{t.name}</Label>
          <Input
            id="name"
            placeholder={t.namePlaceholder}
            {...profileForm.register('name')}
            className="mt-1"
          />
          {profileForm.formState.errors.name && (
            <p className="text-sm text-red-600 mt-1">
              {profileForm.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label>{t.language}</Label>
          <Select
            value={profileForm.watch('language')}
            onValueChange={(value) => profileForm.setValue('language', value as any)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="mr">मराठी</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t.location}</h3>
        
        <div>
          <Label htmlFor="state">{t.state}</Label>
          <Select
            value={profileForm.watch('state')}
            onValueChange={(value) => profileForm.setValue('state', value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={t.selectState} />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {indianStates.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {profileForm.formState.errors.state && (
            <p className="text-sm text-red-600 mt-1">
              {profileForm.formState.errors.state.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="district">{t.district}</Label>
            <Input
              id="district"
              placeholder={t.enterDistrict}
              {...profileForm.register('district')}
              className="mt-1"
            />
            {profileForm.formState.errors.district && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.district.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="village">{t.village}</Label>
            <Input
              id="village"
              placeholder={t.enterVillage}
              {...profileForm.register('village')}
              className="mt-1"
            />
            {profileForm.formState.errors.village && (
              <p className="text-sm text-red-600 mt-1">
                {profileForm.formState.errors.village.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Role-specific fields */}
      {selectedRole === 'farmer' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.farmerDetails}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmSize">{t.farmSize}</Label>
              <Input
                id="farmSize"
                type="number"
                min="0.1"
                step="0.1"
                {...profileForm.register('farmSize', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="farmingExperience">{t.farmingExperience}</Label>
              <Input
                id="farmingExperience"
                type="number"
                min="0"
                {...profileForm.register('farmingExperience', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>{t.primaryCrops}</Label>
            <p className="text-sm text-gray-500 mb-2">{t.selectCrops}</p>
            <div className="flex flex-wrap gap-2">
              {cropTypes.map((crop) => {
                const currentCrops = profileForm.watch('primaryCrops') || [];
                const isSelected = currentCrops.includes(crop);
                
                return (
                  <Badge
                    key={crop}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentCrops = profileForm.getValues('primaryCrops') || [];
                      if (isSelected) {
                        profileForm.setValue('primaryCrops', currentCrops.filter(c => c !== crop));
                      } else {
                        profileForm.setValue('primaryCrops', [...currentCrops, crop]);
                      }
                    }}
                  >
                    {crop}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {selectedRole === 'labourer' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{t.labourerDetails}</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience">{t.workExperience}</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                {...profileForm.register('experience', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="maxTravelDistance">{t.travelDistance}</Label>
              <Input
                id="maxTravelDistance"
                type="number"
                min="1"
                {...profileForm.register('maxTravelDistance', { valueAsNumber: true })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>{t.skills}</Label>
            <p className="text-sm text-gray-500 mb-2">{t.selectSkills}</p>
            <div className="flex flex-wrap gap-2">
              {workTypes.map((skill) => {
                const currentSkills = profileForm.watch('skills') || [];
                const isSelected = currentSkills.includes(skill);
                
                return (
                  <Badge
                    key={skill}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const currentSkills = profileForm.getValues('skills') || [];
                      if (isSelected) {
                        profileForm.setValue('skills', currentSkills.filter(s => s !== skill));
                      } else {
                        profileForm.setValue('skills', [...currentSkills, skill]);
                      }
                    }}
                  >
                    {skill}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep('otp')}
          className="flex-1"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          {t.back}
        </Button>
        
        <Button 
          type="submit" 
          className="flex-1 bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.creating}
            </>
          ) : (
            t.createAccount
          )}
        </Button>
      </div>
    </form>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-green-700">
          {t.title}
        </CardTitle>
        <CardDescription>
          {step === 'phone' ? t.phoneSubtitle :
           step === 'otp' ? t.otpSubtitle :
           t.profileSubtitle}
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

        {step === 'phone' && renderPhoneStep()}
        {step === 'otp' && renderOTPStep()}
        {step === 'profile' && renderProfileStep()}

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            <Button
              variant="link"
              onClick={() => router.push('/login')}
              className="text-green-600 hover:text-green-700 p-0 h-auto"
            >
              {t.loginLink}
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}