'use server'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import { Hero } from '@/lib/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Helper to get admin client (bypasses RLS using service key)
function getAdminSupabase() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase URL or Service Role Key is missing')
  }
  return createClient(supabaseUrl, supabaseServiceKey)
}

// Generate the secure session token hash
function getSessionToken() {
  const password = process.env.ADMIN_PASSWORD || 'Anubhav@12'
  return crypto.createHash('sha256').update(password + 'marvel-nexus-salt-987').digest('hex')
}

/**
 * Validates the password and sets a secure HttpOnly cookie
 */
export async function loginAdminAction(password: string): Promise<boolean> {
  const correctPassword = process.env.ADMIN_PASSWORD || 'Anubhav@12'
  if (password === correctPassword) {
    const token = getSessionToken()
    const cookieStore = await cookies()
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })
    return true
  }
  return false
}

/**
 * Checks if the user is authenticated based on the session cookie
 */
export async function checkAdminAuthAction(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('admin_session')
    if (!sessionCookie) return false

    const expectedToken = getSessionToken()
    return sessionCookie.value === expectedToken
  } catch {
    return false
  }
}

/**
 * Logs out the admin by deleting the session cookie
 */
export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

/**
 * Securely updates a hero using the admin client
 */
export async function updateHeroAction(id: string, updates: Partial<Hero>): Promise<Hero | null> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    throw new Error('Unauthorized admin access')
  }

  const supabase = getAdminSupabase()
  const { data, error } = await supabase
    .from('heroes')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating hero via server action:', error)
    return null
  }
  return data
}

/**
 * Securely deletes a hero using the admin client
 */
export async function deleteHeroAction(id: string): Promise<boolean> {
  const isAuthenticated = await checkAdminAuthAction()
  if (!isAuthenticated) {
    throw new Error('Unauthorized admin access')
  }

  const supabase = getAdminSupabase()
  const { error } = await supabase
    .from('heroes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting hero via server action:', error)
    return false
  }
  return true
}
