"use client";

import { motion } from "framer-motion";

const PRIMARY_GREEN = "#34c759";
const DARK_BG = "#0a0a0a";

export function AuthBackground() {
  return (
    <>
      {/* Dark gradient background */}
      <div 
        style={{
          position: "fixed",
          inset: 0,
          background: DARK_BG,
          zIndex: 0,
        }}
      />
      
      {/* Animated Green Gradient */}
      <motion.div
        animate={{
          background: [
            `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(52, 199, 89, 0.15), transparent)`,
            `radial-gradient(ellipse 80% 50% at 60% -10%, rgba(52, 199, 89, 0.2), transparent)`,
            `radial-gradient(ellipse 80% 50% at 40% -20%, rgba(52, 199, 89, 0.15), transparent)`,
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1,
        }}
      />
      
      {/* Animated Grid Pattern */}
      <motion.div 
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 30%, black, transparent)",
          zIndex: 2,
        }}
      />

      {/* Floating Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -80 - (i * 10), 0],
            x: [0, Math.sin(i * 0.8) * 30, 0],
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            borderRadius: "50%",
            background: i % 3 === 0 ? PRIMARY_GREEN : `rgba(255, 255, 255, ${0.3 + (i % 4) * 0.1})`,
            left: `${5 + i * 8}%`,
            top: `${20 + (i % 5) * 15}%`,
            filter: "blur(0.5px)",
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Additional subtle particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`p2-${i}`}
          animate={{
            y: [0, -60, 0],
            opacity: [0.05, 0.2, 0.05],
          }}
          transition={{
            duration: 12 + i * 2,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            width: "2px",
            height: "2px",
            borderRadius: "50%",
            background: "white",
            right: `${10 + i * 10}%`,
            bottom: `${15 + (i % 4) * 20}%`,
            zIndex: 3,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Glow orb effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          position: "fixed",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%)`,
          top: "-100px",
          right: "-100px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        style={{
          position: "fixed",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(52, 199, 89, 0.08) 0%, transparent 70%)`,
          bottom: "-50px",
          left: "-50px",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
    </>
  );
}
