"use client";

import { motion } from "framer-motion";

export function HeroLobster() {
  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      {/* 外圈光环 */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-400 to-red-500 opacity-20"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* 龙虾图标 */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center text-7xl"
        animate={{
          y: [0, -8, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        🦞
      </motion.div>
      
      {/* 小气泡 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-orange-300 rounded-full opacity-60"
          style={{
            left: `${20 + i * 30}%`,
            bottom: "20%",
          }}
          animate={{
            y: [-5, -20, -5],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2,
            delay: i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}