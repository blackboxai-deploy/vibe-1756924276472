'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  currentLanguage?: string;
}

export default function LandingPage({ currentLanguage = 'en' }: LandingPageProps) {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);

  const translations = {
    en: {
      appName: 'Agriconnect',
      tagline: 'Connecting Farmers and Agricultural Workers',
      description: 'Find reliable agricultural workers or discover farming opportunities in your area',
      forFarmers: 'For Farmers',
      forLabourers: 'For Agricultural Workers',
      farmerDesc: 'Post job requirements, find skilled workers, and manage your farm workforce efficiently',
      labourerDesc: 'Discover work opportunities, connect with farmers, and build your agricultural career',
      getStarted: 'Get Started',
      login: 'Login',
      features: 'Key Features',
      multilingualSupport: 'Multilingual Support',
      multilingualDesc: 'Available in English, Hindi, and Marathi for better accessibility',
      smartMatching: 'Smart Job Matching',
      smartMatchingDesc: 'AI-powered recommendations based on location, skills, and preferences',
      securePayments: 'Secure Payments',
      securePaymentsDesc: 'Safe and transparent payment system for both parties',
      chatSystem: 'In-app Communication',
      chatSystemDesc: 'Direct messaging with auto-translation support',
      mobileOptimized: 'Mobile Optimized',
      mobileOptimizedDesc: 'Designed for rural users with simple, touch-friendly interface',
      offlineSupport: 'Offline Support',
      offlineSupportDesc: 'SMS notifications and lightweight design for low connectivity areas'
    },
    hi: {
      appName: 'Agriconnect',
      tagline: 'किसानों और कृषि श्रमिकों को जोड़ना',
      description: 'विश्वसनीय कृषि श्रमिक खोजें या अपने क्षेत्र में खेती के अवसर खोजें',
      forFarmers: 'किसानों के लिए',
      forLabourers: 'कृषि श्रमिकों के लिए',
      farmerDesc: 'काम की आवश्यकताएं पोस्ट करें, कुशल श्रमिक खोजें, और अपने खेत की कार्यबल का प्रबंधन करें',
      labourerDesc: 'काम के अवसर खोजें, किसानों से जुड़ें, और अपना कृषि करियर बनाएं',
      getStarted: 'शुरू करें',
      login: 'लॉग इन',
      features: 'मुख्य विशेषताएं',
      multilingualSupport: 'बहुभाषी सहायता',
      multilingualDesc: 'बेहतर पहुंच के लिए अंग्रेजी, हिंदी और मराठी में उपलब्ध',
      smartMatching: 'स्मार्ट जॉब मैचिंग',
      smartMatchingDesc: 'स्थान, कौशल और प्राथमिकताओं के आधार पर AI-संचालित सुझाव',
      securePayments: 'सुरक्षित भुगतान',
      securePaymentsDesc: 'दोनों पक्षों के लिए सुरक्षित और पारदर्शी भुगतान प्रणाली',
      chatSystem: 'ऐप-में संचार',
      chatSystemDesc: 'ऑटो-अनुवाद सहायता के साथ सीधा संदेश',
      mobileOptimized: 'मोबाइल अनुकूलित',
      mobileOptimizedDesc: 'सरल, टच-फ्रेंडली इंटरफेस के साथ ग्रामीण उपयोगकर्ताओं के लिए डिज़ाइन',
      offlineSupport: 'ऑफलाइन सहायता',
      offlineSupportDesc: 'कम कनेक्टिविटी वाले क्षेत्रों के लिए SMS सूचनाएं और हल्का डिज़ाइन'
    },
    mr: {
      appName: 'Agriconnect',
      tagline: 'शेतकरी आणि कृषी कामगारांना जोडणे',
      description: 'विश्वासार्ह कृषी कामगार शोधा किंवा आपल्या भागात शेतीच्या संधी शोधा',
      forFarmers: 'शेतकर्‍यांसाठी',
      forLabourers: 'कृषी कामगारांसाठी',
      farmerDesc: 'नोकरीची आवश्यकता पोस्ट करा, कुशल कामगार शोधा आणि आपल्या शेताच्या कामगारांचे व्यवस्थापन करा',
      labourerDesc: 'कामाच्या संधी शोधा, शेतकर्‍यांशी जुळवा आणि आपली कृषी कारकीर्द बनवा',
      getStarted: 'सुरुवात करा',
      login: 'लॉग इन',
      features: 'मुख्य वैशिष्ट्ये',
      multilingualSupport: 'बहुभाषिक सहाय्य',
      multilingualDesc: 'चांगल्या पोहोचसाठी इंग्रजी, हिंदी आणि मराठीमध्ये उपलब्ध',
      smartMatching: 'स्मार्ट जॉब मॅचिंग',
      smartMatchingDesc: 'स्थान, कौशल्ये आणि प्राधान्यांवर आधारित AI-चालित सुझाव',
      securePayments: 'सुरक्षित पेमेंट',
      securePaymentsDesc: 'दोन्ही पक्षांसाठी सुरक्षित आणि पारदर्शी पेमेंट सिस्टम',
      chatSystem: 'अॅप-मधील संवाद',
      chatSystemDesc: 'ऑटो-भाषांतर सहाय्यासह थेट मेसेजिंग',
      mobileOptimized: 'मोबाइल अनुकूलित',
      mobileOptimizedDesc: 'सोप्या, टच-फ्रेंडली इंटरफेससह ग्रामीण वापरकर्त्यांसाठी डिझाइन',
      offlineSupport: 'ऑफलाइन सपोर्ट',
      offlineSupportDesc: 'कमी कनेक्टिव्हिटी असलेल्या भागासाठी SMS सूचना आणि हलके डिझाइन'
    }
  };

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en;

  const features = [
    {
      title: t.multilingualSupport,
      description: t.multilingualDesc,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      title: t.smartMatching,
      description: t.smartMatchingDesc,
      color: 'bg-green-100 text-green-800'
    },
    {
      title: t.securePayments,
      description: t.securePaymentsDesc,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      title: t.chatSystem,
      description: t.chatSystemDesc,
      color: 'bg-orange-100 text-orange-800'
    },
    {
      title: t.mobileOptimized,
      description: t.mobileOptimizedDesc,
      color: 'bg-pink-100 text-pink-800'
    },
    {
      title: t.offlineSupport,
      description: t.offlineSupportDesc,
      color: 'bg-indigo-100 text-indigo-800'
    }
  ];

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-2xl font-bold text-green-700">{t.appName}</h1>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-2">
              {['en', 'hi', 'mr'].map((lang) => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleLanguageChange(lang)}
                  className="text-xs px-2 py-1"
                >
                  {lang === 'en' ? 'EN' : lang === 'hi' ? 'हि' : 'मर'}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
              >
                {t.login}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            {t.tagline}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t.description}
          </p>
          
          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-green-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">🌾</span>
                </div>
                <CardTitle className="text-2xl text-green-700">{t.forFarmers}</CardTitle>
                <CardDescription className="text-lg">{t.farmerDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => router.push('/register?role=farmer')}
                >
                  {t.getStarted}
                </Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-white text-2xl">👨‍🌾</span>
                </div>
                <CardTitle className="text-2xl text-blue-700">{t.forLabourers}</CardTitle>
                <CardDescription className="text-lg">{t.labourerDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push('/register?role=labourer')}
                >
                  {t.getStarted}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            {t.features}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <Badge className={`w-fit ${feature.color} border-0`}>
                    {feature.title}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {selectedLanguage === 'en' ? 'Ready to get started?' : 
             selectedLanguage === 'hi' ? 'शुरू करने के लिए तैयार हैं?' : 
             'सुरुवात करण्यासाठी तयार आहात?'}
          </h3>
          <p className="text-gray-600 mb-6">
            {selectedLanguage === 'en' ? 'Join thousands of farmers and workers already using Agriconnect' : 
             selectedLanguage === 'hi' ? 'हजारों किसानों और श्रमिकों के साथ जुड़ें जो पहले से ही Agriconnect का उपयोग कर रहे हैं' : 
             'आधीच Agriconnect वापरणाऱ्या हजारो शेतकरी आणि कामगारांसोबत सामील व्हा'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => router.push('/register')}
            >
              {t.getStarted}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push('/login')}
            >
              {t.login}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">A</span>
            </div>
            <span className="text-xl font-bold">{t.appName}</span>
          </div>
          <p className="text-gray-400 mb-4">{t.tagline}</p>
          <p className="text-sm text-gray-500">
            © 2024 Agriconnect. {selectedLanguage === 'en' ? 'All rights reserved.' : 
                                 selectedLanguage === 'hi' ? 'सभी अधिकार सुरक्षित।' : 
                                 'सर्व हक्क राखीव.'}
          </p>
        </div>
      </footer>
    </div>
  );
}