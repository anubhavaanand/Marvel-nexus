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

    expect(result).toEqual({
      alias: 'Iron Man',
      is_locked_content: true,
      powers: ['Flight'],
      weaknesses: ['Ego'],
    })
    expect(result).not.toHaveProperty('id')
    expect(result).not.toHaveProperty('first_appearance_movie_id')
  })

  it('rejects empty alias or name', () => {
    expect(sanitizeHeroUpdate(partial({ alias: '' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ name: '   ' }))).toBeNull()
  })

  // #454: duplicate/blank power strings must be collapsed.
  it('de-duplicates and trims powers and weaknesses', () => {
    const result = sanitizeHeroUpdate(
      partial({
        powers: [' Flight ', 'Flight', '', 'Super Strength'],
        weaknesses: ['Ego', 'Ego', '  '],
      }),
    )
    expect(result).toEqual({
      powers: ['Flight', 'Super Strength'],
      weaknesses: ['Ego'],
    })
  })

  it('accepts an empty image url but rejects non-http urls', () => {
    expect(sanitizeHeroUpdate(partial({ image_url: '' }))).toEqual({ image_url: '' })
    expect(sanitizeHeroUpdate(partial({ image_url: 'javascript:alert(1)' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'data:image/png;base64,AAAA' }))).toBeNull()
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://image.tmdb.org/t/p/w500/x.jpg' })),
    ).toEqual({
      image_url: 'https://image.tmdb.org/t/p/w500/x.jpg',
    })
  })

  it('rejects SSRF targets and disallowed hosts', () => {
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'http://169.254.169.254/latest/meta-data/' })),
    ).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'http://localhost/x.jpg' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'http://127.0.0.1/x.jpg' }))).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'https://evil.com/x.jpg' }))).toBeNull()
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://image.tmdb.org.evil.com/x.jpg' })),
    ).toBeNull()
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://user:pass@image.tmdb.org/x.jpg' })),
    ).toBeNull()
  })

  it('accepts allowed hosts and subdomains', () => {
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://images.unsplash.com/photo-123' })),
    ).toEqual({
      image_url: 'https://images.unsplash.com/photo-123',
    })
    expect(sanitizeHeroUpdate(partial({ image_url: 'https://unsplash.com/photo-123' }))).toEqual({
      image_url: 'https://unsplash.com/photo-123',
    })
  })

  // #773: exact hosts only; evil suffix hosts must be rejected.
  it('rejects evil/suffix hosts', () => {
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://unsplash.com.evil.example/x.jpg' })),
    ).toBeNull()
    expect(sanitizeHeroUpdate(partial({ image_url: 'https://notunsplash.com/x.jpg' }))).toBeNull()
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://image.tmdb.org.evil.com/x.jpg' })),
    ).toBeNull()
  })

  // #773: legitimate *.supabase.co storage URL accepted.
  it('accepts a legitimate Supabase storage URL', () => {
    expect(
      sanitizeHeroUpdate(
        partial({ image_url: 'https://abc.supabase.co/storage/v1/object/public/b/x.jpg' }),
      ),
    ).toEqual({ image_url: 'https://abc.supabase.co/storage/v1/object/public/b/x.jpg' })
    expect(
      sanitizeHeroUpdate(partial({ image_url: 'https://abc.supabase.co/notstorage/x.jpg' })),
    ).toBeNull()
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
