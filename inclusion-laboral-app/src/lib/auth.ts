import { createClientComponentClient } from './supabase'
import { User } from '@supabase/supabase-js'

export interface AuthUser extends User {
  user_metadata: {
    full_name?: string
    role?: 'client' | 'counselor' | 'admin'
  }
}

export const useAuth = () => {
  const supabase = createClientComponentClient()

  const signUp = async (email: string, password: string, fullName: string, role: 'client' | 'counselor' = 'client') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })

    if (data.user && !error) {
      // Create user profile in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          full_name: fullName,
          role: role,
        })

      if (profileError) {
        console.error('Error creating user profile:', profileError)
      }
    }

    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const updatePassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    })
    return { error }
  }

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  }
}

export const getUser = async () => {
  const supabase = createClientComponentClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const supabase = createClientComponentClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}