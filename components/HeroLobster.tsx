'use client'

import { motion } from "framer-motion"

export function HeroLobster() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 0.8 }}
      className="inline-block mb-6"
    >
      <div className="text-8xl">🦞</div>
    </motion.div>
  )
}