import { NextRequest, NextResponse } from 'next/server';
import { generateToken, verifyOTP } from '@/lib/auth';
import { DatabaseService } from '@/lib/database';
import { RegisterForm } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RegisterForm & { otp: string } = await request.json();
    const { 
      phone, 
      otp, 
      role, 
      language, 
      name, 
      location, 
      farmDetails, 
      skills, 
      experience, 
      maxTravelDistance 
    } = body;

    // Validate required fields
    if (!phone || !otp || !role || !language || !name || !location) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
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

    // Check if user already exists
    const existingUser = await DatabaseService.findUserByPhone(phone);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'User already exists. Please login instead.',
        redirectTo: '/login'
      }, { status: 409 });
    }

    // Create user profile based on role
    let profile: any = {
      name,
      location,
      rating: 0,
      totalRatings: 0
    };

    if (role === 'farmer') {
      profile = {
        ...profile,
        farmDetails: farmDetails || {
          farmSize: 0,
          primaryCrops: [],
          farmingExperience: 0
        },
        jobsPosted: 0,
        totalSpent: 0
      };
    } else if (role === 'labourer') {
      profile = {
        ...profile,
        skills: skills || [],
        experience: experience || 0,
        availability: {
          isAvailable: true,
          preferredWorkTypes: skills || [],
          maxTravelDistance: maxTravelDistance || 50
        },
        jobsCompleted: 0,
        totalEarned: 0
      };
    }

    // Create user
    const userId = await DatabaseService.createUser({
      phone,
      role,
      language,
      isVerified: true,
      profile
    });

    // Generate JWT token
    const token = generateToken({
      userId,
      phone,
      role
    });

    return NextResponse.json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: userId,
          phone,
          role,
          name,
          language,
          isVerified: true
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}