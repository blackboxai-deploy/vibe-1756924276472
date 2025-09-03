import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, generateToken } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json({
        success: false,
        message: 'Phone number and OTP are required'
      }, { status: 400 });
    }

    // Verify OTP
    const otpResult = verifyOTP(phone, otp);
    if (!otpResult.success) {
      return NextResponse.json({
        success: false,
        message: otpResult.error
      }, { status: 400 });
    }

    // Check if user exists
    const user = await DatabaseService.findUserByPhone(phone);
    
    if (!user) {
      // New user - redirect to registration
      return NextResponse.json({
        success: false,
        message: 'User not found. Please register first.',
        redirectTo: '/register'
      }, { status: 404 });
    }

    if (!user.isVerified) {
      // Verify the user
      await DatabaseService.updateUser(user._id, { isVerified: true });
      user.isVerified = true;
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      phone: user.phone,
      role: user.role
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          phone: user.phone,
          role: user.role,
          name: user.profile.name,
          language: user.language,
          isVerified: user.isVerified
        }
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}