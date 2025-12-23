'use client'

import { motion } from 'framer-motion'
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip
} from 'recharts'

interface PowerData {
    power: string
    value: number
    fullMark: number
}

interface PowerRadarChartProps {
    powers: string[]
    className?: string
}

// Generate power stats based on power names (simulated)
function generatePowerStats(powers: string[]): PowerData[] {
    const powerValues: Record<string, number> = {
        // Physical Powers
        'Superhuman Strength': 95,
        'Enhanced Strength': 75,
        'Super Speed': 85,
        'Flight': 80,
        'Healing Factor': 90,
        'Durability': 85,
        'Agility': 75,
        'Reflexes': 80,

        // Energy Powers
        'Energy Projection': 88,
        'Lightning Manipulation': 92,
        'Chaos Magic': 98,
        'Reality Warping': 100,
        'Power Cosmic': 95,
        'Venom Strike': 70,

        // Mental Powers
        'Telepathy': 90,
        'Mind Control': 88,
        'Genius Intellect': 95,
        'Tactical Genius': 85,
        'Spider-Sense': 85,
        '4th Wall Awareness': 100,

        // Equipment/Tech
        'Powered Armor': 90,
        'Vibranium Shield': 85,
        'Vibranium Suit': 88,
        'Mjolnir': 95,
        'Adamantium Claws': 92,
        'Talons': 75,
        'Web-Slinging': 80,

        // Other
        'Master Spy': 85,
        'Combat Expert': 88,
        'Wall-Crawling': 75,
        'Invisibility': 80,
        'Acrobatics': 78,
        'Accelerated Vision': 82,
        'Magnetism Control': 95,
    }

    return powers.map(power => ({
        power: power.length > 15 ? power.substring(0, 12) + '...' : power,
        value: powerValues[power] || Math.floor(Math.random() * 40) + 60,
        fullMark: 100
    }))
}

export default function PowerRadarChart({ powers, className = '' }: PowerRadarChartProps) {
    if (!powers || powers.length === 0) {
        return (
            <div className={`glass-panel rounded-xl p-6 ${className}`}>
                <h3 className="text-lg font-orbitron text-cyan-400 mb-4">Power Analysis</h3>
                <div className="h-64 flex items-center justify-center text-neutral-500">
                    No power data available
                </div>
            </div>
        )
    }

    const data = generatePowerStats(powers)

    return (
        <motion.div
            className={`glass-panel rounded-xl p-6 ${className}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-lg font-orbitron text-cyan-400 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                Power Analysis
            </h3>

            <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid
                            stroke="rgba(6, 182, 212, 0.2)"
                            strokeWidth={1}
                        />
                        <PolarAngleAxis
                            dataKey="power"
                            tick={{
                                fill: '#a1a1aa',
                                fontSize: 10,
                                fontFamily: 'Inter'
                            }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fill: '#525252', fontSize: 8 }}
                            axisLine={false}
                        />
                        <Radar
                            name="Power Level"
                            dataKey="value"
                            stroke="#06b6d4"
                            fill="#06b6d4"
                            fillOpacity={0.3}
                            strokeWidth={2}
                            dot={{
                                r: 3,
                                fill: '#06b6d4',
                                stroke: '#0a0a0a',
                                strokeWidth: 1
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(23, 23, 23, 0.95)',
                                border: '1px solid rgba(6, 182, 212, 0.3)',
                                borderRadius: '8px',
                                color: '#ededed',
                                fontFamily: 'Inter'
                            }}
                            labelStyle={{ color: '#06b6d4', fontFamily: 'Orbitron' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Power List */}
            <div className="mt-4 flex flex-wrap gap-2">
                {powers.map((power, i) => (
                    <motion.span
                        key={power}
                        className="px-2 py-1 text-xs bg-cyan-950/50 border border-cyan-500/30 rounded-md text-cyan-400 font-mono"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        {power}
                    </motion.span>
                ))}
            </div>
        </motion.div>
    )
}
