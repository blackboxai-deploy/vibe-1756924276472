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

export default function FarmerDashboard() {
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
      if (parsedUser.role !== 'farmer') {
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const translations = {
    en: {
      welcome: 'Welcome to Agriconnect',
      farmerDashboard: 'Farmer Dashboard',
      greeting: 'Hello',
      verified: 'Verified',
      unverified: 'Unverified',
      quickActions: 'Quick Actions',
      postJob: 'Post New Job',
      postJobDesc: 'Create a job posting to find agricultural workers',
      viewJobs: 'View My Jobs',
      viewJobsDesc: 'Manage your existing job postings',
      viewApplications: 'View Applications',
      viewApplicationsDesc: 'Review applications from workers',
      messages: 'Messages',
      messagesDesc: 'Chat with potential workers',
      profile: 'Profile',
      profileDesc: 'Update your profile information',
      logout: 'Logout',
      comingSoon: 'Coming Soon',
      featureInDevelopment: 'This feature is currently under development and will be available soon.',
    },
    hi: {
      welcome: 'Agriconnect में आपका स्वागत है',
      farmerDashboard: 'किसान डैशबोर्ड',
      greeting: 'नमस्ते',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      quickActions: 'त्वरित कार्य',
      postJob: 'नई नौकरी पोस्ट करें',
      postJobDesc: 'कृषि श्रमिक खोजने के लिए नौकरी पोस्ट बनाएं',
      viewJobs: 'मेरी नौकरियां देखें',
      viewJobsDesc: 'अपनी मौजूदा नौकरी पोस्टिंग्स का प्रबंधन करें',
      viewApplications: 'आवेदन देखें',
      viewApplicationsDesc: 'श्रमिकों के आवेदनों की समीक्षा करें',
      messages: 'संदेश',
      messagesDesc: 'संभावित श्रमिकों से चैट करें',
      profile: 'प्रोफ़ाइल',
      profileDesc: 'अपनी प्रोफ़ाइल जानकारी अपडेट करें',
      logout: 'लॉग आउट',
      comingSoon: 'जल्द आ रहा है',
      featureInDevelopment: 'यह सुविधा वर्तमान में विकास में है और जल्द ही उपलब्ध होगी।',
    },
    mr: {
      welcome: 'Agriconnect मध्ये आपले स्वागत',
      farmerDashboard: 'शेतकरी डॅशबोर्ड',
      greeting: 'नमस्कार',
      verified: 'सत्यापित',
      unverified: 'असत्यापित',
      quickActions: 'त्वरित कृती',
      postJob: 'नवीन नोकरी पोस्ट करा',
      postJobDesc: 'कृषी कामगार शोधण्यासाठी नोकरी पोस्ट तयार करा',
      viewJobs: 'माझ्या नोकऱ्या पहा',
      viewJobsDesc: 'आपल्या सध्याच्या नोकरी पोस्टिंग्सचे व्यवस्थापन करा',
      viewApplications: 'अर्ज पहा',
      viewApplicationsDesc: 'कामगारांच्या अर्जांचे पुनरावलोकन करा',
      messages: 'संदेश',
      messagesDesc: 'संभाव्य कामगारांशी चॅट करा',
      profile: 'प्रोफाइल',
      profileDesc: 'आपली प्रोफाइल माहिती अपडेट करा',
      logout: 'लॉग आउट',
      comingSoon: 'लवकरच येत आहे',
      featureInDevelopment: 'हे वैशिष्ट्य सध्या विकसित होत आहे आणि लवकरच उपलब्ध होईल.',
    }
  };

  const t = translations[user?.language as keyof typeof translations] || translations.en;

  const quickActions = [
    {
      title: t.postJob,
      description: t.postJobDesc,
      icon: '📝',
      color: 'bg-green-100 text-green-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.viewJobs,
      description: t.viewJobsDesc,
      icon: '📋',
      color: 'bg-blue-100 text-blue-800',
      action: () => alert(t.comingSoon)
    },
    {
      title: t.viewApplications,
      description: t.viewApplicationsDesc,
      icon: '👥',
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
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-700">Agriconnect</h1>
                <p className="text-sm text-gray-600">{t.farmerDashboard}</p>
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
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-2">{t.welcome}</h2>
              <p className="text-green-100">
                {user?.language === 'hi' 
                  ? 'अपनी खेती की जरूरतों के लिए कुशल श्रमिक खोजें और अपने कृषि कार्यों को बेहतर बनाएं।'
                  : user?.language === 'mr'
                  ? 'आपल्या शेतीच्या गरजांसाठी कुशल कामगार शोधा आणि आपली कृषी कामे सुधारा.'
                  : 'Find skilled workers for your farming needs and improve your agricultural operations.'
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