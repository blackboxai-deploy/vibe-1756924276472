import { MongoClient, Db, Collection } from 'mongodb';
import { User, Job, JobApplication, ChatMessage, Conversation, Rating, Notification } from '@/types';

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
  var _db: Db;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let db: Db;

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agriconnect';

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

async function connectToDatabase() {
  if (global._db) {
    return global._db;
  }

  const client = await clientPromise;
  const database = client.db('agriconnect');
  
  if (process.env.NODE_ENV === 'development') {
    global._db = database;
  }
  
  return database;
}

// Database helper functions
export async function getDatabase(): Promise<Db> {
  if (!db) {
    db = await connectToDatabase();
  }
  return db;
}

// Collection helpers
export async function getUsersCollection(): Promise<Collection<User>> {
  const database = await getDatabase();
  return database.collection<User>('users');
}

export async function getJobsCollection(): Promise<Collection<Job>> {
  const database = await getDatabase();
  return database.collection<Job>('jobs');
}

export async function getApplicationsCollection(): Promise<Collection<JobApplication>> {
  const database = await getDatabase();
  return database.collection<JobApplication>('applications');
}

export async function getMessagesCollection(): Promise<Collection<ChatMessage>> {
  const database = await getDatabase();
  return database.collection<ChatMessage>('messages');
}

export async function getConversationsCollection(): Promise<Collection<Conversation>> {
  const database = await getDatabase();
  return database.collection<Conversation>('conversations');
}

export async function getRatingsCollection(): Promise<Collection<Rating>> {
  const database = await getDatabase();
  return database.collection<Rating>('ratings');
}

export async function getNotificationsCollection(): Promise<Collection<Notification>> {
  const database = await getDatabase();
  return database.collection<Notification>('notifications');
}

// Database initialization and indexes
export async function initializeDatabase() {
  try {
    const database = await getDatabase();
    
    // Create indexes for better performance
    const users = database.collection('users');
    await users.createIndex({ phone: 1 }, { unique: true });
    await users.createIndex({ role: 1 });
    await users.createIndex({ 'profile.location.coordinates': '2dsphere' });
    
    const jobs = database.collection('jobs');
    await jobs.createIndex({ farmerId: 1 });
    await jobs.createIndex({ status: 1 });
    await jobs.createIndex({ cropType: 1 });
    await jobs.createIndex({ workType: 1 });
    await jobs.createIndex({ 'location.coordinates': '2dsphere' });
    await jobs.createIndex({ createdAt: -1 });
    
    const applications = database.collection('applications');
    await applications.createIndex({ jobId: 1 });
    await applications.createIndex({ labourerId: 1 });
    await applications.createIndex({ farmerId: 1 });
    await applications.createIndex({ status: 1 });
    
    const messages = database.collection('messages');
    await messages.createIndex({ conversationId: 1, timestamp: -1 });
    await messages.createIndex({ senderId: 1 });
    await messages.createIndex({ receiverId: 1 });
    
    const conversations = database.collection('conversations');
    await conversations.createIndex({ participants: 1 });
    await conversations.createIndex({ jobId: 1 });
    await conversations.createIndex({ updatedAt: -1 });
    
    const ratings = database.collection('ratings');
    await ratings.createIndex({ ratedUserId: 1 });
    await ratings.createIndex({ raterId: 1 });
    await ratings.createIndex({ jobId: 1 });
    
    const notifications = database.collection('notifications');
    await notifications.createIndex({ userId: 1, createdAt: -1 });
    await notifications.createIndex({ isRead: 1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Utility functions for common database operations
export class DatabaseService {
  // User operations
  static async createUser(userData: Omit<User, '_id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const users = await getUsersCollection();
    const now = new Date();
    const result = await users.insertOne({
      ...userData,
      createdAt: now,
      updatedAt: now,
    } as User);
    return result.insertedId.toString();
  }

  static async findUserByPhone(phone: string): Promise<User | null> {
    const users = await getUsersCollection();
    return await users.findOne({ phone });
  }

  static async findUserById(id: string): Promise<User | null> {
    const users = await getUsersCollection();
    return await users.findOne({ _id: id } as any);
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    const users = await getUsersCollection();
    const result = await users.updateOne(
      { _id: id } as any,
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  // Job operations
  static async createJob(jobData: Omit<Job, '_id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>): Promise<string> {
    const jobs = await getJobsCollection();
    const now = new Date();
    const result = await jobs.insertOne({
      ...jobData,
      applicationsCount: 0,
      createdAt: now,
      updatedAt: now,
    } as Job);
    return result.insertedId.toString();
  }

  static async findJobById(id: string): Promise<Job | null> {
    const jobs = await getJobsCollection();
    return await jobs.findOne({ _id: id } as any);
  }

  static async findJobsByFarmer(farmerId: string, limit = 10, skip = 0): Promise<Job[]> {
    const jobs = await getJobsCollection();
    return await jobs.find({ farmerId }).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray();
  }

  static async searchJobs(filters: any, limit = 10, skip = 0): Promise<Job[]> {
    const jobs = await getJobsCollection();
    return await jobs.find(filters).sort({ createdAt: -1 }).limit(limit).skip(skip).toArray();
  }

  static async updateJob(id: string, updates: Partial<Job>): Promise<boolean> {
    const jobs = await getJobsCollection();
    const result = await jobs.updateOne(
      { _id: id } as any,
      { $set: { ...updates, updatedAt: new Date() } }
    );
    return result.modifiedCount > 0;
  }

  // Application operations
  static async createApplication(applicationData: Omit<JobApplication, '_id' | 'appliedAt'>): Promise<string> {
    const applications = await getApplicationsCollection();
    const jobs = await getJobsCollection();
    
    const result = await applications.insertOne({
      ...applicationData,
      appliedAt: new Date(),
    } as JobApplication);
    
    // Increment applications count for the job
    await jobs.updateOne(
      { _id: applicationData.jobId } as any,
      { $inc: { applicationsCount: 1 } }
    );
    
    return result.insertedId.toString();
  }

  static async findApplicationsByJob(jobId: string): Promise<JobApplication[]> {
    const applications = await getApplicationsCollection();
    return await applications.find({ jobId }).sort({ appliedAt: -1 }).toArray();
  }

  static async findApplicationsByLabourer(labourerId: string): Promise<JobApplication[]> {
    const applications = await getApplicationsCollection();
    return await applications.find({ labourerId }).sort({ appliedAt: -1 }).toArray();
  }

  static async updateApplication(id: string, updates: Partial<JobApplication>): Promise<boolean> {
    const applications = await getApplicationsCollection();
    const result = await applications.updateOne(
      { _id: id } as any,
      { 
        $set: { 
          ...updates, 
          ...(updates.status ? { respondedAt: new Date() } : {}) 
        } 
      }
    );
    return result.modifiedCount > 0;
  }

  // Chat operations
  static async createConversation(participants: string[], jobId?: string): Promise<string> {
    const conversations = await getConversationsCollection();
    const now = new Date();
    const result = await conversations.insertOne({
      participants,
      jobId,
      createdAt: now,
      updatedAt: now,
    } as Conversation);
    return result.insertedId.toString();
  }

  static async findConversation(participants: string[], jobId?: string): Promise<Conversation | null> {
    const conversations = await getConversationsCollection();
    const query: any = { participants: { $all: participants } };
    if (jobId) query.jobId = jobId;
    return await conversations.findOne(query);
  }

  static async createMessage(messageData: Omit<ChatMessage, '_id' | 'timestamp' | 'isRead'>): Promise<string> {
    const messages = await getMessagesCollection();
    const conversations = await getConversationsCollection();
    
    const message = {
      ...messageData,
      timestamp: new Date(),
      isRead: false,
    } as ChatMessage;
    
    const result = await messages.insertOne(message);
    
    // Update conversation's last message and timestamp
    await conversations.updateOne(
      { _id: messageData.conversationId } as any,
      { 
        $set: { 
          lastMessage: message,
          updatedAt: new Date() 
        } 
      }
    );
    
    return result.insertedId.toString();
  }

  static async getConversationMessages(conversationId: string, limit = 50, skip = 0): Promise<ChatMessage[]> {
    const messages = await getMessagesCollection();
    return await messages.find({ conversationId }).sort({ timestamp: -1 }).limit(limit).skip(skip).toArray();
  }

  // Rating operations
  static async createRating(ratingData: Omit<Rating, '_id' | 'createdAt'>): Promise<string> {
    const ratings = await getRatingsCollection();
    const users = await getUsersCollection();
    
    const result = await ratings.insertOne({
      ...ratingData,
      createdAt: new Date(),
    } as Rating);
    
    // Update user's average rating
    const userRatings = await ratings.find({ ratedUserId: ratingData.ratedUserId }).toArray();
    const totalRating = userRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / userRatings.length;
    
    await users.updateOne(
      { _id: ratingData.ratedUserId } as any,
      { 
        $set: { 
          'profile.rating': averageRating,
          'profile.totalRatings': userRatings.length
        } 
      }
    );
    
    return result.insertedId.toString();
  }
}

export default clientPromise;