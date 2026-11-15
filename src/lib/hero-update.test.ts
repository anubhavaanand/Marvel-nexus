import { describe, expect, it } from 'vitest'
import type { Hero } from '@/lib/supabase'
import { sanitizeHeroUpdate } from './hero-update'

function partial(overrides: Partial<Hero>): Partial<Hero> {
  return overrides
}

describe('sanitizeHeroUpdate', () => {
  it('keeps allowed fields and trims them', () => {
    const result = sanitizeHeroUpdate(
      partial({
        alias: '  Iron Man  ',
        name: ' Tony Stark ',
        origin_world: ' Earth-616 ',
        image_url: '',
        franchise: 'MCU',
      }),
    )

    expect(result).toEqual({
      alias: 'Iron Man',
      name: 'Tony Stark',
      origin_world: 'Earth-616',
      image_url: '',
      franchise: 'MCU',
    })
  })

  it('drops primary key, audit, and relation fields', () => {
    const result = sanitizeHeroUpdate(
      partial({
        alias: 'Iron Man',
        id: 'attacker-supplied',
        is_locked_content: true,
        powers: ['Flight'],
        weaknesses: ['Ego'],
        first_appearance_movie_id: 'attacker-supplied',
      }),
    )

    expect(result).toEqual({ alias: 'Iron Man' })
    expect(result).not.toHaveProperty('id')
    expect(result).not.toHaveProperty('is_locked_content')
  })

  it('rejects empty alias or name', () => {
    expect(sanitizeHeroUpdate(partial({ alias: '' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ name: '   ' }))).toBeNull()
  })

  it('accepts an empty image url but rejects non-http urls', () => {
    expect(sanitizeHeroUpdate(partial({ image_url: '' }))).toEqual({ image_url: '' })
    expect(sanitizeHeroUpdate(partial({ image_url: 'javascript:alert(1)' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'https://example.com/a.jpg' }))).toEqual({
      image_url: 'https://example.com/a.jpg',
    })
  })

  it('rejects unknown franchises', () => {
    expect(sanitizeHeroUpdate(partial({ franchise: 'Made Up' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ franchise: 'The Boys' }))).toEqual({
      franchise: 'The Boys',
    })
  })

  it('returns an empty object for no allowed fields', () => {
    expect(sanitizeHeroUpdate(partial({}))).toEqual({})
  })
})
