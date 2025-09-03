export type UserRole = 'farmer' | 'labourer' | 'admin';
export type Language = 'en' | 'hi' | 'mr';
export type JobStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type WorkType = 'planting' | 'harvesting' | 'weeding' | 'pesticide' | 'irrigation' | 'general';
export type CropType = 'rice' | 'wheat' | 'cotton' | 'sugarcane' | 'vegetables' | 'fruits' | 'other';

export interface User {
  _id: string;
  phone: string;
  role: UserRole;
  isVerified: boolean;
  language: Language;
  profile: FarmerProfile | LabourerProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface BaseProfile {
  name: string;
  avatar?: string;
  location: {
    state: string;
    district: string;
    village: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  totalRatings: number;
}

export interface FarmerProfile extends BaseProfile {
  farmDetails: {
    farmSize: number; // in acres
    primaryCrops: CropType[];
    farmingExperience: number; // in years
  };
  jobsPosted: number;
  totalSpent: number;
}

export interface LabourerProfile extends BaseProfile {
  skills: WorkType[];
  experience: number; // in years
  availability: {
    isAvailable: boolean;
    preferredWorkTypes: WorkType[];
    maxTravelDistance: number; // in km
  };
  jobsCompleted: number;
  totalEarned: number;
}

export interface Job {
  _id: string;
  farmerId: string;
  title: string;
  description: string;
  cropType: CropType;
  workType: WorkType;
  location: {
    state: string;
    district: string;
    village: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  requirements: {
    workersNeeded: number;
    experienceRequired: 'beginner' | 'intermediate' | 'expert';
    skillsRequired: WorkType[];
  };
  schedule: {
    startDate: Date;
    endDate?: Date;
    estimatedDays: number;
    workingHours: {
      start: string;
      end: string;
    };
  };
  wages: {
    type: 'daily' | 'hourly' | 'contract';
    amount: number;
    bonuses?: {
      description: string;
      amount: number;
    }[];
  };
  status: JobStatus;
  applicationsCount: number;
  hiredWorkers: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  _id: string;
  jobId: string;
  labourerId: string;
  farmerId: string;
  message?: string;
  proposedWage?: number;
  status: ApplicationStatus;
  appliedAt: Date;
  respondedAt?: Date;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  originalLanguage: Language;
  translatedContent?: {
    [key in Language]?: string;
  };
  messageType: 'text' | 'voice' | 'image' | 'location';
  timestamp: Date;
  isRead: boolean;
}

export interface Conversation {
  _id: string;
  participants: string[];
  jobId?: string;
  lastMessage?: ChatMessage;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  _id: string;
  raterId: string;
  ratedUserId: string;
  jobId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

export interface Notification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'job_match' | 'application' | 'message' | 'payment' | 'system';
  isRead: boolean;
  data?: any;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

// Form types
export interface LoginForm {
  phone: string;
  otp: string;
}

export interface RegisterForm {
  phone: string;
  role: UserRole;
  language: Language;
  name: string;
  location: {
    state: string;
    district: string;
    village: string;
  };
  // Additional fields based on role
  farmDetails?: {
    farmSize: number;
    primaryCrops: CropType[];
    farmingExperience: number;
  };
  skills?: WorkType[];
  experience?: number;
  maxTravelDistance?: number;
}

export interface JobPostForm {
  title: string;
  description: string;
  cropType: CropType;
  workType: WorkType;
  workersNeeded: number;
  experienceRequired: 'beginner' | 'intermediate' | 'expert';
  skillsRequired: WorkType[];
  startDate: Date;
  endDate?: Date;
  estimatedDays: number;
  workingHours: {
    start: string;
    end: string;
  };
  wageType: 'daily' | 'hourly' | 'contract';
  wageAmount: number;
  bonuses?: {
    description: string;
    amount: number;
  }[];
}

export interface JobSearchFilters {
  location?: {
    state?: string;
    district?: string;
    radius?: number; // in km
  };
  cropTypes?: CropType[];
  workTypes?: WorkType[];
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
  wageRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy?: 'date' | 'wage' | 'distance' | 'rating';
  sortOrder?: 'asc' | 'desc';
}