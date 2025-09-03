import { NextRequest, NextResponse } from 'next/server';
import { generateOTP, storeOTP, sendOTP, validatePhoneNumber } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, language = 'en' } = body;

    // Validate phone number
    if (!phone || !validatePhoneNumber(phone)) {
      return NextResponse.json({
        success: false,
        message: language === 'hi' 
          ? 'कृपया एक वैध फोन नंबर दर्ज करें'
          : language === 'mr'
          ? 'कृपया वैध फोन नंबर टाका'
          : 'Please enter a valid phone number'
      }, { status: 400 });
    }

    // Generate and store OTP
    const otp = generateOTP();
    storeOTP(phone, otp);

    // Send OTP via SMS
    const smsSent = await sendOTP(phone, otp, language);

    if (!smsSent) {
      return NextResponse.json({
        success: false,
        message: language === 'hi' 
          ? 'OTP भेजने में समस्या हुई। कृपया पुनः प्रयास करें।'
          : language === 'mr'
          ? 'OTP पाठवण्यात समस्या झाली. कृपया पुन्हा प्रयत्न करा.'
          : 'Failed to send OTP. Please try again.'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: language === 'hi' 
        ? 'OTP आपके फोन नंबर पर भेजा गया है'
        : language === 'mr'
        ? 'OTP आपल्या फोन नंबरवर पाठवला आहे'
        : 'OTP has been sent to your phone number'
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}