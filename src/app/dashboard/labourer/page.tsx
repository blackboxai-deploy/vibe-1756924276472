'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface User {
  id: string;
  phone: string;
  role: string;
  name: string;
  language: string;
  isVerified: boolean;
}

export default function LabourerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'labourer') {
        router.push('/login');
        return;
      }
      setUser(parsedUser);
    } catch (error) {
      router.push('/login');
      return;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const translations = {
    en: {
      welcome: 'Welcome to Agriconnect',
      labourerDashboard: 'Agricultural Worker Dashboard',
      greeting: 'Hello',
      verified: 'Verified',
      unverified: 'Unverified',
      quickActions: 'Quick Actions',
      findJobs: 'Find Jobs',
      findJobsDesc: 'Search for agricultural work opportunities',
      myApplications: 'My Applications',
      myApplicationsDesc: 'Track your job applications',
      acceptedJobs: 'Accepted Jobs',
      acceptedJobsDesc: 'View jobs you have been hired for',
      messages: 'Messages',
      messagesDesc: 'Chat with farmers',
      profile: 'Profile',
      profileDesc: 'Update your skills and profile',
      logout: 'Logout',
      comingSoon: 'Coming Soon',
      featureInDevelopment: 'This feature is currently under development and will be available soon.',
    },
    hi: {
      welcome: 'Agriconnect में आपका स्वागत है',
      labourerDashboard: 'कृषि श्रमिक डैशबोर्ड',
      greeting: 'नमस्ते',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      quickActions: 'त्वरित कार्य',
      findJobs: 'नौकरी खोजें',
      findJobsDesc: 'कृषि काम के अवसर खोजें',
      myApplications: 'मेरे आवेदन',
      myApplicationsDesc: 'अपने नौकरी आवेदनों को ट्रैक करें',
      acceptedJobs: 'स्वीकृत नौकरियां',
      acceptedJobsDesc: 'उन नौकरियों को देखें जिनके लिए आपको काम पर रखा गया है',
      messages: 'संदेश',
      messagesDesc: 'किसानों से चैट करें',
      profile: 'प्रोफ़ाइल',
      profileDesc: 'अपने कौशल और प्रोफ़ाइल को अपडेट करें',
      logout: 'लॉग आउट',
      comingSoon: 'जल्द आ रहा है',
      featureInDevelopment: 'यह सुविधा वर्तमान में विकास में है और जल्द ही उपलब्ध होगी।',
    },
    mr: {
      welcome: 'Agriconnect मध्ये आपले स्वागत',
      labourerDashboard: 'कृषी कामगार डॅशबोर्ड',
      greeting: 'नमस्कार',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      quickActions: 'त्वरित कृती',
      findJobs: 'नोकरी शोधा',
      findJobsDesc: 'कृषी कामाच्या संधी शोधा',
      myApplications: 'माझे अर्ज',
      myApplicationsDesc: 'आपल्या नोकरी अर्जांचा मागोवा घ्या',
      acceptedJobs: 'स्वीकारलेल्या नोकऱ्या',
      acceptedJobsDesc: 'ज्या नोकऱ्यांसाठी आपली नेमणूक झाली आहे त्या पहा',
      messages: 'संदेश',
      messagesDesc: 'शेतकर्‍यांशी चॅट करा',
      profile: 'प्रोफाइल',
      profileDesc: 'आपली कौशल्ये आणि प्रोफाइल अपडेट करा',
      logout: 'लॉग आउट',
      comingSoon: 'लवकरच येत आहे',
      featureInDevelopment: 'हे वैशिष्ट्य सध्या विकसित होत आहे आणि लवकरच उपलब्ध होईल.',
    }
  };

  const t = translations[user?.language as keyof typeof translations] || translations.en;

  const quickActions = [
    {
      title: t.findJobs,
      description: t.findJobsDesc,
      icon: '🔍',
      color: 'bg-blue-100 text-blue-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.myApplications,
      description: t.myApplicationsDesc,
      icon: '📄',
      color: 'bg-green-100 text-green-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.acceptedJobs,
      description: t.acceptedJobsDesc,
      icon: '✅',
      color: 'bg-purple-100 text-purple-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.messages,
      description: t.messagesDesc,
      icon: '💬',
      color: 'bg-orange-100 text-orange-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.profile,
      description: t.profileDesc,
      icon: '⚙️',
      color: 'bg-gray-100 text-gray-800',
      action: () => alert(t.comingSoon)
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-blue-700">Agriconnect</h1>
                <p className="text-sm text-gray-600">{t.labourerDashboard}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-medium">{t.greeting}, {user?.name}</p>
                <Badge variant={user?.isVerified ? 'default' : 'secondary'}>
                  {user?.isVerified ? t.verified : t.unverified}
                </Badge>
              </div>
              
              <Button 
                variant="outline"
                onClick={handleLogout}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                {t.logout}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">{t.welcome}</h2>
              <p className="text-blue-100">
                {user?.language === 'hi' 
                  ? 'अपने कौशल के अनुसार सबसे अच्छे कृषि कार्य के अवसर खोजें और अपनी आजीविका को बेहतर बनाएं।'
                  : user?.language === 'mr'
                  ? 'आपल्या कौशल्यांनुसार सर्वोत्तम कृषी कामाच्या संधी शोधा आणि आपली उपजीविका सुधारा.'
                  : 'Find the best agricultural work opportunities matching your skills and improve your livelihood.'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">{t.quickActions}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={action.action}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color.split(' ')[0]} ${action.color.split(' ')[1]}`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <Badge className={action.color}>
                        {t.comingSoon}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Development Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">{t.comingSoon}</h4>
            <p className="text-blue-700">{t.featureInDevelopment}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}