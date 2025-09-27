import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Client-side Supabase client - only create if we have valid URLs
export const supabase = supabaseUrl.includes('placeholder') 
  ? null 
  : createClient(supabaseUrl, supabaseAnonKey)

// Browser client for client components
export const createClientComponentClient = () => {
  if (supabaseUrl.includes('placeholder')) {
    return null as any
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'client' | 'counselor' | 'admin'
  avatar_url?: string
  phone?: string
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  user_id: string
  bio?: string
  skills: string[]
  experience_level: 'entry' | 'mid' | 'senior'
  preferred_industries: string[]
  location: string
  availability: 'full-time' | 'part-time' | 'flexible'
  disabilities?: string[]
  accommodations_needed?: string[]
  created_at: string
  updated_at: string
}

export interface Appointment {
  id: string
  client_id: string
  counselor_id: string
  title: string
  description?: string
  scheduled_at: string
  duration: number
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show'
  meeting_link?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Assessment {
  id: string
  user_id: string
  type: 'skills' | 'personality' | 'career-interest'
  questions: Record<string, unknown>[]
  answers: Record<string, unknown>[]
  results: Record<string, unknown> | null
  completed_at?: string
  created_at: string
}

export interface JobMatch {
  id: string
  user_id: string
  job_title: string
  company_name: string
  description: string
  requirements: string[]
  match_score: number
  location: string
  salary_range?: string
  job_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  accessibility_features?: string[]
  created_at: string
}

export interface Resource {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'course' | 'tool' | 'template'
  content_url?: string
  content?: string
  tags: string[]
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_time?: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface Progress {
  id: string
  user_id: string
  category: 'skills' | 'applications' | 'interviews' | 'assessments'
  metric_name: string
  current_value: number
  target_value?: number
  unit: string
  tracked_at: string
  notes?: string
}