import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'agriconnect-secret-key';
const OTP_EXPIRY_MINUTES = 10;

// In-memory OTP storage (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: Date; attempts: number }>();

export interface JWTPayload {
  userId: string;
  phone: string;
  role: UserRole;
}

// JWT functions
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

// Password hashing (for future use)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// OTP functions
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function storeOTP(phone: string, otp: string): void {
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_EXPIRY_MINUTES);
  
  otpStore.set(phone, {
    otp,
    expiresAt,
    attempts: 0
  });
}

export function verifyOTP(phone: string, otp: string): { success: boolean; error?: string } {
  const stored = otpStore.get(phone);
  
  if (!stored) {
    return { success: false, error: 'OTP not found or expired' };
  }
  
  if (stored.attempts >= 3) {
    otpStore.delete(phone);
    return { success: false, error: 'Too many attempts. Please request a new OTP.' };
  }
  
  if (new Date() > stored.expiresAt) {
    otpStore.delete(phone);
    return { success: false, error: 'OTP has expired' };
  }
  
  if (stored.otp !== otp) {
    stored.attempts++;
    return { success: false, error: 'Invalid OTP' };
  }
  
  otpStore.delete(phone);
  return { success: true };
}

export function clearExpiredOTPs(): void {
  const now = new Date();
  for (const [phone, data] of otpStore.entries()) {
    if (now > data.expiresAt) {
      otpStore.delete(phone);
    }
  }
}

// SMS service integration (mock implementation)
export async function sendOTP(phone: string, otp: string, language: 'en' | 'hi' | 'mr' = 'en'): Promise<boolean> {
  // In production, integrate with SMS service like Twilio, MSG91, etc.
  console.log(`Sending OTP ${otp} to ${phone} in language ${language}`);
  
  const messages = {
    en: `Your Agriconnect verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`,
    hi: `आपका Agriconnect सत्यापन कोड है: ${otp}. ${OTP_EXPIRY_MINUTES} मिनट के लिए वैध।`,
    mr: `तुमचा Agriconnect सत्यापन कोड आहे: ${otp}. ${OTP_EXPIRY_MINUTES} मिनिटांसाठी वैध.`
  };
  
  // Mock SMS sending - replace with actual SMS service
  try {
    // await smsService.send(phone, messages[language]);
    console.log(`SMS sent to ${phone}: ${messages[language]}`);
    return true;
  } catch (error) {
    console.error('Failed to send SMS:', error);
    return false;
  }
}

// Phone number validation
export function validatePhoneNumber(phone: string): boolean {
  // Indian phone number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
}

// Format phone number for display
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return phone;
}

// Authentication middleware for API routes
export function withAuth(handler: any) {
  return async (req: any, res: any) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication required' 
        });
      }
      
      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid or expired token' 
        });
      }
      
      req.user = payload;
      return handler(req, res);
    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        message: 'Authentication error' 
      });
    }
  };
}

// Role-based authorization
export function withRole(roles: UserRole[]) {
  return function(handler: any) {
    return withAuth(async (req: any, res: any) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ 
          success: false, 
          message: 'Insufficient permissions' 
        });
      }
      return handler(req, res);
    });
  };
}

// Clean up expired OTPs periodically
setInterval(clearExpiredOTPs, 5 * 60 * 1000); // Run every 5 minutes