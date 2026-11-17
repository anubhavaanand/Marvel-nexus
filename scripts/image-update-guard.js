/**
 * Guard for the one-shot image-fix scripts (#441).
 *
 * These scripts write hardcoded image URLs straight to production. Without a
 * preview, an accidental run silently overwrites every listed row. The guard
 * makes --dry-run the default and requires an explicit --confirm, and it
 * exports the current values first so a run is reversible.
 *
 * @example
 * const imageGuard = require('./image-update-guard')
 * const flags = imageGuard.parseFlags(process.argv.slice(2))
 * imageGuard.requireImageUpdateConfirm(flags, {
 *   title: 'overwrite hero image_url values',
 *   updates: ['Spider-Man (Andrew) -> https://...'],
 * }, 'fix-hero-images.js')
 */

'use strict'

const fs = require('fs')
const path = require('path')

const CONFIRM_ENV = 'SEED_CONFIRM'
const BACKUP_DIR = path.join(__dirname, 'backups')

/**
 * @param {string[]} argv
 * @returns {{confirm:boolean, dryRun:boolean, help:boolean}}
 */
function parseFlags(argv) {
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
 * Print the plan exactly as seed-guard does.
 * @param {string} scriptName
 * @param {{title:string, updates:string[]}} plan
 */
function printPlan(scriptName, plan) {
  console.log(`⚠️  ${scriptName} — ${plan.title}`)
  console.log('')
  console.log('This script will overwrite:')
  for (const line of plan.updates) {
    console.log(`   🖼️  ${line}`)
  }
  console.log('')
  console.log('Current values are exported to scripts/backups/ before any write.')
  console.log('To proceed, re-run with --confirm:')
  console.log(`   node scripts/${scriptName} --confirm`)
}

/**
 * Refuse to run without an explicit opt-in. Dry runs never write.
 *
 * @param {{confirm:boolean, dryRun:boolean, help:boolean}} flags
 * @param {{title:string, updates:string[]}} plan
 * @param {string} scriptName
 */
function requireImageUpdateConfirm(flags, plan, scriptName) {
  if (flags.help) {
    printPlan(scriptName, plan)
    console.log('')
    console.log('Flags:  --confirm  apply the updates')
    console.log('        --dry-run  print the plan only (default without --confirm)')
    process.exit(0)
  }

  printPlan(scriptName, plan)

  if (flags.dryRun) {
    console.log('')
    console.log('🛑 Dry run complete — no changes were made.')
    process.exit(0)
  }

  if (!flags.confirm) {
    console.error('')
    console.error('❌ Refusing to run: image updates require an explicit --confirm flag.')
    console.error('   Re-run with --dry-run to preview without changing anything.')
    process.exit(1)
  }

  console.log('')
  console.log('🔓 Confirmed: exporting current images and applying updates.')
}

/**
 * Export the pre-update rows so the change can be rolled back by hand.
 *
 * @param {*} supabase
 * @param {string[]} aliases
 * @param {string} scriptName
 * @returns {Promise<string|null>} written backup path, or null on failure
 */
async function backupCurrentImages(supabase, aliases, scriptName) {
  try {
    const { data, error } = await supabase
      .from('heroes')
      .select('id, alias, name, image_url')
      .in('alias', aliases)
    if (error) {
      console.warn(`⚠️  Backup lookup failed (${error.message}); continuing anyway.`)
      return null
    }
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const file = path.join(BACKUP_DIR, `${scriptName.replace(/\.js$/, '')}-${stamp}.json`)
    fs.writeFileSync(
      file,
      JSON.stringify(
        { backedUpAt: new Date().toISOString(), script: scriptName, rows: data ?? [] },
        null,
        2,
      ),
    )
    console.log(
      `💾 Backed up ${(data ?? []).length} rows to scripts/backups/${path.basename(file)}`,
    )
    return file
  } catch (err) {
    console.warn(`⚠️  Backup failed (${err.message}); continuing anyway.`)
    return null
  }
}

module.exports = { parseFlags, printPlan, requireImageUpdateConfirm, backupCurrentImages }
