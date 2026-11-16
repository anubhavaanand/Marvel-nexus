/**
 * Shared safety guard for destructive seed/setup scripts.
 *
 * Any script that truncates, deletes, or overwrites database rows must go
 * through this guard. Without an explicit `--confirm` flag (or
 * `SEED_CONFIRM=1` in the environment) the guard prints exactly what the
 * script would do and exits non-zero. This keeps CI and accidental runs safe
 * while still allowing a deliberate operator to opt in.
 *
 * The guard is non-interactive: it never prompts. Flags only.
 *
 * @example
 * // At the top of a seed script, after creating the Supabase client:
 * const guard = require('./seed-guard')
 * const flags = guard.parseArgs(process.argv.slice(2))
 * if (flags.help) { guard.printUsage('seed-heroes.js'); process.exit(0) }
 * guard.requireConfirm(flags, {
 *   title: 'full reseed — wipes existing data before inserting',
 *   destructive: ['DELETE all rows from canon_events', 'DELETE all rows from heroes'],
 *   safe: ['UPSERT 51 heroes by alias (idempotent)'],
 * }, 'seed-heroes.js')
 */

'use strict'

const CONFIRM_ENV = 'SEED_CONFIRM'

/**
 * Parse CLI flags from a seed script.
 * @param {string[]} argv - raw process.argv slice (node + script excluded)
 * @returns {{confirm:boolean, dryRun:boolean, help:boolean}}
 */
function parseArgs(argv) {
  return {
    confirm:
      argv.includes('--confirm') ||
      argv.includes('--force') ||
      argv.includes('--yes') ||
      process.env[CONFIRM_ENV] === '1' ||
      process.env[CONFIRM_ENV] === 'true',
    dryRun: argv.includes('--dry-run') || argv.includes('--plan'),
    help: argv.includes('--help') || argv.includes('-h'),
  }
}

/**
 * @param {string} scriptName
 * @param {{title:string, destructive:string[], safe:string[]}} plan
 */
function printPlan(scriptName, plan) {
  console.log(`⚠️  ${scriptName} — ${plan.title}`)
  console.log('')
  console.log('This script will:')
  for (const line of plan.destructive) {
    console.log(`   🗑️  ${line}`)
  }
  for (const line of plan.safe) {
    console.log(`   ✅ ${line}`)
  }
  console.log('')
  console.log('To proceed, re-run with --confirm:')
  console.log(`   node scripts/${scriptName} --confirm`)
  if (process.env[CONFIRM_ENV] !== undefined) {
    console.log(`   OR set ${CONFIRM_ENV}=1 in your environment`)
  }
}

/**
 * @param {string} scriptName
 */
function printUsage(scriptName) {
  console.log(`Usage: node scripts/${scriptName} [flags]`)
  console.log('')
  console.log('Flags:')
  console.log('  --confirm, --force, --yes   Run the destructive operations (required)')
  console.log(
    '  --dry-run, --plan           Print what would happen, then exit without changing anything',
  )
  console.log('  --help, -h                  Show this help')
  console.log('')
  console.log('Environment:')
  console.log(`  ${CONFIRM_ENV}=1              Equivalent to --confirm (useful for CI)`)
}

/**
 * Refuse to run unless the operator explicitly opts in.
 *
 * @param {{confirm:boolean, dryRun:boolean, help:boolean}} flags
 * @param {{title:string, destructive:string[], safe:string[]}} plan
 * @param {string} scriptName
 */
function requireConfirm(flags, plan, scriptName) {
  if (flags.help) {
    printUsage(scriptName)
    process.exit(0)
  }

  if (flags.dryRun) {
    printPlan(scriptName, plan)
    console.log('🛑 Dry run complete — no changes were made.')
    process.exit(0)
  }

  // Only gate destructive scripts. A plan with no destructive operations
  // (pure idempotent upserts) is safe to run without --confirm.
  if (plan.destructive.length > 0 && !flags.confirm) {
    printPlan(scriptName, plan)
    console.error('')
    console.error('❌ Refusing to run: destructive operations require an explicit --confirm flag.')
    process.exit(1)
  }

  if (flags.confirm && plan.destructive.length > 0) {
    console.log(`🔓 Confirmed: running destructive operations for ${scriptName}.`)
    console.log('')
  }
}

/**
 * Idempotently upsert heroes by `alias`.
 *
 * The `heroes` table has no unique constraint on `alias` (multiple seed
 * scripts have created conflicting duplicate aliases in the past), so we
 * check-then-update-or-insert rather than relying on a DB-level upsert.
 * Re-running this function never creates duplicate rows and never deletes
 * data, which makes the seed scripts safe to run repeatedly.
 *
 * @param {*} supabase - initialized Supabase client
 * @param {Array<object>} heroes - hero records to upsert
 * @param {(msg:string)=>void} [log=console.log]
 * @returns {Promise<{inserted:number, updated:number, failed:number}>}
 */
async function upsertHeroes(supabase, heroes, log = console.log) {
  let inserted = 0
  let updated = 0
  let failed = 0

  for (const hero of heroes) {
    const { data: existing, error: findError } = await supabase
      .from('heroes')
      .select('id')
      .eq('alias', hero.alias)
      .maybeSingle()

    if (findError) {
      console.error(`❌ ${hero.alias}: lookup failed — ${findError.message}`)
      failed += 1
      continue
    }

    let error
    if (existing) {
      const result = await supabase.from('heroes').update(hero).eq('id', existing.id)
      error = result.error
      if (!error) updated += 1
    } else {
      const result = await supabase.from('heroes').insert(hero)
      error = result.error
      if (!error) inserted += 1
    }

    if (error) {
      console.error(`❌ ${hero.alias}: ${error.message}`)
      failed += 1
    } else {
      log(`✅ ${hero.alias}`)
    }
  }

  return { inserted, updated, failed }
}

module.exports = { parseArgs, printPlan, printUsage, requireConfirm, upsertHeroes }
