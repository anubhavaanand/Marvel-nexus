import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/service-supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const startedAt = Date.now()
  try {
    const supabase = getServiceSupabase()
    const { error } = await supabase.from('heroes').select('id').limit(1)
    if (error) throw error
    return NextResponse.json(
      { status: 'ok', db: 'ok', latencyMs: Date.now() - startedAt },
      { headers: { 'Cache-Control': 'no-store' } },
    )
  } catch (err) {
    // Log hygiene: never surface credentials or upstream details.
    console.error('health check failed')
    return NextResponse.json(
      { status: 'error', db: 'error', latencyMs: Date.now() - startedAt },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }
}
