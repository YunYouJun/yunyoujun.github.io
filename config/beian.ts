import process from 'node:process'

export const isBeianMode = process.env.VITE_BEIAN_MODE === 'true'
