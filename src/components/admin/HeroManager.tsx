'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Pencil,
    Trash2,
    Search,
    Save,
    X,
    Loader2,
    Image as ImageIcon,
    AlertTriangle,
    CheckCircle
} from 'lucide-react'
import { getAllHeroes, updateHero, deleteHero, type Hero } from '@/lib/supabase'

export default function HeroManager() {
    const [heroes, setHeroes] = useState<Hero[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [editingHero, setEditingHero] = useState<Hero | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // Load heroes on mount
    useEffect(() => {
        fetchHeroes()
    }, [])

    const fetchHeroes = async () => {
        setLoading(true)
        const data = await getAllHeroes()
        setHeroes(data)
        setLoading(false)
    }

    const handleSave = async () => {
        if (!editingHero) return

        setIsSaving(true)
        try {
            const updated = await updateHero(editingHero.id, {
                alias: editingHero.alias,
                name: editingHero.name,
                image_url: editingHero.image_url,
                franchise: editingHero.franchise,
                origin_world: editingHero.origin_world
            })

            if (updated) {
                setHeroes(heroes.map(h => h.id === updated.id ? updated : h))
                setEditingHero(null)
            }
        } catch (error) {
            console.error('Failed to update hero:', error)
        }
        setIsSaving(false)
    }

    const handleDelete = async (id: string) => {
        if (deleteConfirm !== id) {
            setDeleteConfirm(id)
            return
        }

        setIsSaving(true)
        const success = await deleteHero(id)
        if (success) {
            setHeroes(heroes.filter(h => h.id !== id))
            setDeleteConfirm(null)
        }
        setIsSaving(false)
    }

    const filteredHeroes = heroes.filter(h =>
        h.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        h.franchise.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search heroes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-900/50 border border-neutral-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono text-sm"
                    />
                </div>
                <Badge variant="outline" className="h-10 px-4 border-cyan-500/30 text-cyan-400 font-mono">
                    {filteredHeroes.length} Heroes
                </Badge>
            </div>

            {/* Edit Modal / Form */}
            <AnimatePresence>
                {editingHero && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-8 overflow-hidden"
                    >
                        <div className="bg-neutral-800/80 border border-cyan-500/30 rounded-xl p-6 space-y-4 shadow-2xl shadow-black/50">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-orbitron text-cyan-400">Edit Hero</h3>
                                <Button size="icon" variant="ghost" onClick={() => setEditingHero(null)}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-400">Alias (Hero Name)</label>
                                    <input
                                        value={editingHero.alias}
                                        onChange={e => setEditingHero({ ...editingHero, alias: e.target.value })}
                                        className="w-full p-2 bg-black/40 border border-neutral-700 rounded text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-400">Real Name</label>
                                    <input
                                        value={editingHero.name}
                                        onChange={e => setEditingHero({ ...editingHero, name: e.target.value })}
                                        className="w-full p-2 bg-black/40 border border-neutral-700 rounded text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-400">Image URL</label>
                                    <input
                                        value={editingHero.image_url}
                                        onChange={e => setEditingHero({ ...editingHero, image_url: e.target.value })}
                                        className="w-full p-2 bg-black/40 border border-neutral-700 rounded text-white font-mono text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-neutral-400">Franchise</label>
                                    <select
                                        value={editingHero.franchise}
                                        onChange={e => setEditingHero({ ...editingHero, franchise: e.target.value })}
                                        className="w-full p-2 bg-black/40 border border-neutral-700 rounded text-white"
                                    >
                                        <option value="MCU">MCU</option>
                                        <option value="DC">DC</option>
                                        <option value="Anime">Anime</option>
                                        <option value="The Boys">The Boys</option>
                                        <option value="Invincible">Invincible</option>
                                        <option value="X-Men">X-Men</option>
                                        <option value="Spider-Verse">Spider-Verse</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setEditingHero(null)}>Cancel</Button>
                                <Button
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            <div className="border border-white/5 rounded-xl overflow-hidden bg-black/20">
                <div className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 p-4 text-xs font-mono text-neutral-500 border-b border-white/5 uppercase tracking-wider">
                    <div className="w-12 text-center">Img</div>
                    <div>Alias</div>
                    <div className="hidden sm:block">Name</div>
                    <div className="hidden sm:block">Franchise</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
                    {filteredHeroes.map(hero => (
                        <div key={hero.id} className="grid grid-cols-[auto_1fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
                            <div className="w-12 h-12 relative rounded overflow-hidden bg-neutral-800">
                                {hero.image_url ? (
                                    <img src={hero.image_url} alt={hero.alias} className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-neutral-600" />
                                )}
                            </div>

                            <div className="font-bold text-white font-orbitron truncate">
                                {hero.alias}
                            </div>

                            <div className="hidden sm:block text-neutral-400 text-sm truncate">
                                {hero.name}
                            </div>

                            <div className="hidden sm:block">
                                <Badge variant="outline" className="border-white/10 text-neutral-400">
                                    {hero.franchise}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-2 justify-end">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-neutral-400 hover:text-cyan-400 hover:bg-cyan-950/30"
                                    onClick={() => setEditingHero(hero)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={`h-8 w-8 ${deleteConfirm === hero.id ? 'text-red-500 bg-red-950/30 ring-1 ring-red-500' : 'text-neutral-400 hover:text-red-400 hover:bg-red-950/30'}`}
                                    onClick={() => handleDelete(hero.id)}
                                >
                                    {deleteConfirm === hero.id ? <AlertTriangle className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    ))}

                    {filteredHeroes.length === 0 && (
                        <div className="p-8 text-center text-neutral-500">
                            No heroes found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
