"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowRight,
  Repeat2,
  Heart,
  MessageCircle,
  Users,
  TrendingUp,
  Globe,
  Shield,
  Zap,
  Sparkles,
  Play,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";

const PRIMARY_GREEN = "#34c759";
const DARK_BG = "#0a0a0a";

// Text reveal animation - letra por letra
function AnimatedText({ text, className, style, delay = 0 }: { text: string; className?: string; style?: React.CSSProperties; delay?: number }) {
  const words = text.split(" ");
  
  return (
    <motion.span className={className} style={{ display: "inline-block", ...style }}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} style={{ display: "inline-block", marginRight: "0.25em" }}>
          {word.split("").map((char, charIndex) => (
            <motion.span
              key={charIndex}
              initial={{ opacity: 0, y: 50, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * 0.1) + (charIndex * 0.03),
                ease: [0.25, 0.4, 0.25, 1]
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

// Gradient text with animation
function GradientText({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.4, 0.25, 1] }}
      style={{
        background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #7dd3a1 50%, ${PRIMARY_GREEN} 100%)`,
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
      }}
    >
      <motion.span
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #7dd3a1 50%, ${PRIMARY_GREEN} 100%)`,
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {children}
      </motion.span>
    </motion.span>
  );
}

// Animated button with glow effect
function GlowButton({ children, href, variant = "primary" }: { children: React.ReactNode; href: string; variant?: "primary" | "outline" }) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.1);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.1);
  };
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const isPrimary = variant === "primary";
  
  return (
    <motion.a
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        x: springX,
        y: springY,
        display: "inline-flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        padding: "16px 32px",
        borderRadius: "50px",
        fontWeight: 600,
        fontSize: "16px",
        textDecoration: "none",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        background: isPrimary ? PRIMARY_GREEN : "transparent",
        color: "white",
        border: isPrimary ? "none" : "1.5px solid rgba(255, 255, 255, 0.4)",
        boxShadow: isPrimary ? `0 10px 30px -8px rgba(52, 199, 89, 0.5)` : "none",
      }}
    >
      {/* Animated glow */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.5 : 1,
        }}
        style={{
          position: "absolute",
          inset: -20,
          background: isPrimary 
            ? `radial-gradient(circle, rgba(52, 199, 89, 0.4) 0%, transparent 70%)`
            : `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      
      {/* Shine effect */}
      <motion.div
        animate={{
          x: isHovered ? ["-100%", "200%"] : "-100%",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "50%",
          height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          pointerEvents: "none",
        }}
      />
      
      <span style={{ 
        position: "relative", 
        zIndex: 1, 
        display: "inline-flex", 
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "center",
        gap: "8px",
        whiteSpace: "nowrap"
      }}>{children}</span>
    </motion.a>
  );
}

// Animated section with parallax
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 80 }}
      transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

// Stats Counter with spring animation
function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value]);
  
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateX: -45 }}
        animate={isInView ? { opacity: 1, scale: 1, rotateX: 0 } : {}}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        style={{ 
          fontSize: "clamp(48px, 8vw, 72px)", 
          fontWeight: 700, 
          color: PRIMARY_GREEN,
          lineHeight: 1,
          letterSpacing: "-2px",
          perspective: "1000px",
        }}
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        style={{ color: "rgba(255,255,255,0.5)", marginTop: "8px", fontSize: "16px" }}
      >
        {label}
      </motion.p>
    </div>
  );
}

// Animated Icon with pulse
function AnimatedIcon({ icon: Icon, color, size = 28, delay = 0 }: { icon: any; color: string; size?: number; delay?: number }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      whileInView={{ scale: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay, 
        type: "spring", 
        stiffness: 200, 
        damping: 15 
      }}
      whileHover={{ 
        scale: 1.2, 
        rotate: [0, -10, 10, 0],
        transition: { duration: 0.4 }
      }}
      style={{
        width: "64px",
        height: "64px",
        borderRadius: "16px",
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
    >
      <Icon size={size} style={{ color }} />
    </motion.div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  
  // Parallax transforms
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const heroRotate = useTransform(scrollYProgress, [0, 0.3], [0, -5]);
  
  // Background parallax
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  // Navbar animation
  const navbarBg = useTransform(scrollYProgress, [0, 0.05], ["rgba(10, 10, 10, 0)", "rgba(10, 10, 10, 0.95)"]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/feed");
    }
  }, [isAuthenticated, router]);

  return (
    <div ref={containerRef} style={{ background: DARK_BG, minHeight: "100vh", overflow: "hidden" }}>
      {/* Fixed Navbar with animation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: navbarBg,
          backdropFilter: "blur(20px)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.5 }}
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "12px",
              background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #2aa347 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 24px rgba(52, 199, 89, 0.3)`,
            }}
          >
            <Repeat2 size={24} color="white" />
          </motion.div>
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: "22px", fontWeight: 700, color: "white", letterSpacing: "-0.5px" }}
          >
            Escambo
          </motion.span>
        </Link>
        
        <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <nav style={{ display: "flex", gap: "32px" }} className="desktop-nav">
            {["Propósito", "Ferramentas", "Soluções"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + (i * 0.1) }}
                whileHover={{ y: -2, color: "#fff" }}
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 500,
                }}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                href="/login" 
                style={{ 
                  color: "white", 
                  textDecoration: "none", 
                  fontSize: "15px", 
                  fontWeight: 500,
                  padding: "10px 20px",
                }}
              >
                Entrar
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/register"
                style={{
                  background: PRIMARY_GREEN,
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: "100px",
                  fontSize: "15px",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Começar
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: "80px"
      }}>
        {/* Animated Background */}
        <motion.div 
          style={{ y: bgY }}
          animate={{
            background: [
              `radial-gradient(ellipse 80% 50% at 50% -20%, rgba(52, 199, 89, 0.3), transparent)`,
              `radial-gradient(ellipse 80% 50% at 60% -10%, rgba(52, 199, 89, 0.4), transparent)`,
              `radial-gradient(ellipse 80% 50% at 40% -20%, rgba(52, 199, 89, 0.3), transparent)`,
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          className="hero-bg-gradient"
        />
        
        {/* Animated Grid Pattern */}
        <motion.div 
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
          }}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.sin(i) * 50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 0.5,
            }}
            style={{
              position: "absolute",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: PRIMARY_GREEN,
              left: `${15 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              filter: "blur(1px)",
            }}
          />
        ))}

        <motion.div
          style={{ 
            y: heroY, 
            opacity: heroOpacity, 
            scale: heroScale,
            rotateX: heroRotate,
            perspective: "1000px",
          }}
        >
          <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto", 
            padding: "0 24px", 
            textAlign: "center",
          }}>
            {/* Animated Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.05 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "100px",
                background: "rgba(52, 199, 89, 0.15)",
                border: "1px solid rgba(52, 199, 89, 0.3)",
                marginBottom: "32px",
                cursor: "pointer",
              }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles size={16} style={{ color: PRIMARY_GREEN }} />
              </motion.div>
              <span style={{ color: PRIMARY_GREEN, fontSize: "14px", fontWeight: 600 }}>
                Plataforma de Trocas Inteligente
              </span>
            </motion.div>

            {/* Main Headline with character animation */}
            <h1 style={{
              fontSize: "clamp(48px, 10vw, 96px)",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.05,
              letterSpacing: "-3px",
              marginBottom: "24px",
            }}>
              <AnimatedText text="Troque o que tem." delay={0.2} />
              <br />
              <GradientText delay={0.8}>Ganhe o que quer.</GradientText>
            </h1>

            {/* Animated Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 1.2 }}
              style={{
                fontSize: "clamp(18px, 2.5vw, 24px)",
                color: "rgba(255, 255, 255, 0.6)",
                maxWidth: "600px",
                margin: "0 auto 48px",
                lineHeight: 1.6,
              }}
            >
              A plataforma que conecta pessoas para trocar itens de forma inteligente, 
              segura e sustentável.
            </motion.p>

            {/* Animated CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              style={{ display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}
            >
              <GlowButton href="/register" variant="primary">
                Começar Agora <ArrowRight size={18} />
              </GlowButton>
              <GlowButton href="#proposito" variant="outline">
                <Play size={16} /> Como Funciona
              </GlowButton>
            </motion.div>

            {/* Animated Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              style={{
                display: "flex",
                gap: "32px",
                justifyContent: "center",
                marginTop: "64px",
                flexWrap: "wrap",
              }}
            >
              {["Sem cartão de crédito", "Cadastro em 2 min", "100% seguro"].map((text, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8 + (i * 0.1) }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "default" }}
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{ 
                      width: "20px", 
                      height: "20px", 
                      borderRadius: "50%", 
                      background: "rgba(52, 199, 89, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ color: PRIMARY_GREEN, fontSize: "12px" }}>✓</span>
                  </motion.div>
                  <span style={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "14px" }}>{text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: "absolute",
            bottom: "40px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ cursor: "pointer" }}
            whileHover={{ scale: 1.2 }}
          >
            <ChevronDown size={32} style={{ color: "rgba(255, 255, 255, 0.3)" }} />
          </motion.div>
        </motion.div>
      </section>

      {/* Propósito Section */}
      <AnimatedSection>
        <section id="proposito" style={{ 
          padding: "160px 24px",
          background: "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
        }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            {/* Section Header with animation */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{ 
                  color: PRIMARY_GREEN, 
                  fontSize: "14px", 
                  fontWeight: 600, 
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  display: "inline-block",
                }}
              >
                Nosso Propósito
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: "clamp(36px, 6vw, 64px)",
                  fontWeight: 700,
                  color: "white",
                  marginTop: "16px",
                  letterSpacing: "-2px",
                  lineHeight: 1.1,
                }}
              >
                Criando valor além<br />do dinheiro
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  fontSize: "20px",
                  color: "rgba(255, 255, 255, 0.5)",
                  maxWidth: "600px",
                  margin: "24px auto 0",
                  lineHeight: 1.6,
                }}
              >
                Uma comunidade onde o valor real das coisas vai além do preço
              </motion.p>
            </motion.div>

            {/* Purpose Cards with stagger */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "32px",
            }}>
              {[
                { 
                  icon: Users, 
                  title: "Conectar Pessoas", 
                  desc: "Aproximamos pessoas que compartilham interesses comuns e buscam trocar itens de forma justa e significativa.",
                  color: PRIMARY_GREEN,
                },
                { 
                  icon: TrendingUp, 
                  title: "Economizar", 
                  desc: "Evite gastos desnecessários trocando itens que não usa mais por aqueles que realmente precisa.",
                  color: "#3b82f6",
                },
                { 
                  icon: Globe, 
                  title: "Sustentabilidade", 
                  desc: "Reduza o desperdício e contribua para um mundo mais sustentável através da reutilização.",
                  color: "#8b5cf6",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: idx * 0.15 }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    boxShadow: `0 30px 60px -20px ${item.color}30`,
                  }}
                  style={{
                    background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                    borderRadius: "24px",
                    padding: "40px",
                    border: `1px solid ${item.color}20`,
                    cursor: "pointer",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <AnimatedIcon icon={item.icon} color={item.color} delay={idx * 0.1} />
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    style={{
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "white",
                      marginTop: "24px",
                      marginBottom: "12px",
                    }}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + idx * 0.1 }}
                    style={{
                      fontSize: "16px",
                      color: "rgba(255, 255, 255, 0.6)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.desc}
                  </motion.p>
                </motion.div>
              ))}
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "48px",
                marginTop: "100px",
                padding: "60px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "24px",
                border: "1px solid rgba(255, 255, 255, 0.05)",
              }}
            >
              <StatCounter value={5000} label="Usuários Ativos" suffix="+" />
              <StatCounter value={12000} label="Trocas Realizadas" suffix="+" />
              <StatCounter value={98} label="Satisfação" suffix="%" />
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Ferramentas Section */}
      <AnimatedSection>
        <section id="ferramentas" style={{ 
          padding: "160px 24px",
          background: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Animated Background Glow */}
          <motion.div 
            animate={{
              opacity: [0.05, 0.1, 0.05],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "800px",
              height: "800px",
              background: `radial-gradient(circle, ${PRIMARY_GREEN}15 0%, transparent 70%)`,
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <motion.span 
                initial={{ opacity: 0, letterSpacing: "0px" }}
                whileInView={{ opacity: 1, letterSpacing: "2px" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ 
                  color: PRIMARY_GREEN, 
                  fontSize: "14px", 
                  fontWeight: 600, 
                  textTransform: "uppercase",
                  display: "inline-block",
                }}
              >
                Nossas Ferramentas
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: "clamp(36px, 6vw, 64px)",
                  fontWeight: 700,
                  color: "white",
                  marginTop: "16px",
                  letterSpacing: "-2px",
                  lineHeight: 1.1,
                }}
              >
                Tudo que você precisa<br />em um só lugar
              </motion.h2>
            </motion.div>

            {/* Bento Grid */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(6, 1fr)",
              gridTemplateRows: "repeat(2, 280px)",
              gap: "24px",
            }} className="tools-bento-grid">
              {[
                { icon: Repeat2, title: "Sistema de Troca", desc: "Crie, gerencie e acompanhe suas trocas em tempo real.", cols: "span 2", featured: true },
                { icon: Heart, title: "Curtidas", desc: "Encontre itens que você ama.", cols: "span 2", featured: false },
                { icon: MessageCircle, title: "Chat em Tempo Real", desc: "Comunique-se diretamente.", cols: "span 2", featured: false },
                { icon: Shield, title: "Sistema de Segurança", desc: "Verificações e proteção para cada troca.", cols: "span 3", featured: false },
                { icon: Zap, title: "Notificações", desc: "Alertas sobre trocas e oportunidades.", cols: "span 3", featured: false },
              ].map((tool, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -8,
                    boxShadow: tool.featured 
                      ? `0 30px 60px -20px ${PRIMARY_GREEN}40`
                      : "0 30px 60px -20px rgba(255,255,255,0.1)",
                  }}
                  style={{
                    gridColumn: tool.cols,
                    background: tool.featured 
                      ? `linear-gradient(135deg, ${PRIMARY_GREEN}25 0%, ${PRIMARY_GREEN}08 100%)`
                      : "rgba(255, 255, 255, 0.03)",
                    borderRadius: "24px",
                    padding: "32px",
                    border: tool.featured 
                      ? `1px solid ${PRIMARY_GREEN}40`
                      : "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="tool-card"
                >
                  <div>
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "14px",
                        background: tool.featured 
                          ? `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #2aa347 100%)`
                          : "rgba(255, 255, 255, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <tool.icon size={26} style={{ color: tool.featured ? "white" : PRIMARY_GREEN }} />
                    </motion.div>
                    <h3 style={{ fontSize: "22px", fontWeight: 600, color: "white", marginBottom: "12px" }}>
                      {tool.title}
                    </h3>
                  </div>
                  <p style={{ fontSize: "15px", color: "rgba(255, 255, 255, 0.5)", lineHeight: 1.6, margin: 0 }}>
                    {tool.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Soluções Section */}
      <AnimatedSection>
        <section id="solucoes" style={{ 
          padding: "160px 24px",
          background: "linear-gradient(180deg, #111111 0%, #0a0a0a 100%)",
        }}>
          <div style={{ maxWidth: "900px", margin: "0 auto" }}>
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              style={{ textAlign: "center", marginBottom: "80px" }}
            >
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                style={{ 
                  color: PRIMARY_GREEN, 
                  fontSize: "14px", 
                  fontWeight: 600, 
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  display: "inline-block",
                }}
              >
                O Que Soluciona
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: "clamp(36px, 6vw, 64px)",
                  fontWeight: 700,
                  color: "white",
                  marginTop: "16px",
                  letterSpacing: "-2px",
                  lineHeight: 1.1,
                }}
              >
                Problemas reais,<br />soluções reais
              </motion.h2>
            </motion.div>

            {/* Solutions List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { problem: "Acúmulo de itens", solution: "Livre-se de coisas que não usa mais e ganhe espaço em casa." },
                { problem: "Gastos com compras", solution: "Troque itens e economize sem gastar dinheiro." },
                { problem: "Isolamento social", solution: "Conecte-se com pessoas que compartilham seus interesses." },
                { problem: "Desperdício de recursos", solution: "Contribua para a economia circular e sustentabilidade." },
                { problem: "Segurança em transações", solution: "Sistema verificado com proteção para cada troca." },
                { problem: "Dificuldade de negociação", solution: "Chat integrado para comunicação fácil." },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ 
                    x: 16, 
                    backgroundColor: `${PRIMARY_GREEN}10`,
                    borderColor: `${PRIMARY_GREEN}30`,
                  }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "24px",
                    padding: "32px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "16px",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    cursor: "pointer",
                  }}
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      minWidth: "48px",
                      height: "48px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #2aa347 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "18px",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {index + 1}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "8px",
                      }}
                    >
                      <span style={{ 
                        color: "rgba(255, 255, 255, 0.4)", 
                        fontSize: "14px",
                        textDecoration: "line-through",
                      }}>
                        {item.problem}
                      </span>
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight size={14} style={{ color: PRIMARY_GREEN }} />
                      </motion.span>
                    </motion.div>
                    <p style={{
                      fontSize: "18px",
                      color: "white",
                      margin: 0,
                      fontWeight: 500,
                    }}>
                      {item.solution}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Final Section */}
      <AnimatedSection>
        <section style={{ 
          padding: "160px 24px",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Animated Background */}
          <motion.div 
            animate={{
              background: [
                `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #1e8e3e 50%, #0d5f2c 100%)`,
                `linear-gradient(135deg, #1e8e3e 0%, #0d5f2c 50%, ${PRIMARY_GREEN} 100%)`,
                `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #1e8e3e 50%, #0d5f2c 100%)`,
              ]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            style={{
              position: "absolute",
              inset: 0,
            }}
          />
          
          {/* Floating Shapes */}
          <motion.div
            animate={{ 
              y: [0, -40, 0],
              rotate: [0, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "10%",
              right: "10%",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              filter: "blur(40px)",
            }}
          />
          <motion.div
            animate={{ 
              y: [0, 30, 0],
              rotate: [0, -5, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              bottom: "20%",
              left: "5%",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.08)",
              filter: "blur(30px)",
            }}
          />

          <div style={{ maxWidth: "900px", margin: "0 auto", position: "relative", textAlign: "center" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            >
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{
                  fontSize: "clamp(40px, 8vw, 80px)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.1,
                  letterSpacing: "-3px",
                  marginBottom: "24px",
                }}
              >
                Pronto para começar
                <br />suas trocas?
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  color: "rgba(255, 255, 255, 0.85)",
                  maxWidth: "600px",
                  margin: "0 auto 48px",
                  lineHeight: 1.6,
                }}
              >
                Junte-se à nossa comunidade de trocadores inteligentes. 
                É grátis, seguro e simples.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ 
                  display: "flex", 
                  gap: "20px", 
                  justifyContent: "center", 
                  flexWrap: "wrap",
                  marginBottom: "48px",
                }}
              >
                <GlowButton href="/register" variant="outline">
                  Criar Conta Agora
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight size={18} />
                  </motion.span>
                </GlowButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 }}
                style={{
                  display: "flex",
                  gap: "24px",
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {["Sem cartão de crédito", "Cadastro em 2 minutos", "100% seguro"].map((text, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    whileHover={{ scale: 1.05 }}
                    style={{ 
                      color: "rgba(255, 255, 255, 0.7)", 
                      fontSize: "14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span style={{ color: "white" }}>✓</span>
                    {text}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Footer */}
      <footer style={{ 
        padding: "80px 24px 40px", 
        background: "#050505",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
              gap: "48px",
              marginBottom: "60px",
            }}
          >
            {/* Brand */}
            <div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}
              >
                <motion.div 
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: `linear-gradient(135deg, ${PRIMARY_GREEN} 0%, #2aa347 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Repeat2 size={22} color="white" />
                </motion.div>
                <span style={{ fontSize: "20px", fontWeight: 700, color: "white" }}>Escambo</span>
              </motion.div>
              <p style={{ color: "rgba(255, 255, 255, 0.4)", fontSize: "14px", lineHeight: 1.6 }}>
                A plataforma de troca mais inteligente do Brasil.
              </p>
            </div>

            {/* Links */}
            {[
              { title: "Produto", links: [{ label: "Propósito", href: "#proposito" }, { label: "Ferramentas", href: "#ferramentas" }, { label: "Soluções", href: "#solucoes" }] },
              { title: "Legal", links: [{ label: "Privacidade", href: "#" }, { label: "Termos de Uso", href: "#" }, { label: "Suporte", href: "#" }] },
              { title: "Começar", links: [{ label: "Criar Conta", href: "/register" }, { label: "Entrar", href: "/login" }] },
            ].map((section, sectionIdx) => (
              <motion.div 
                key={sectionIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sectionIdx * 0.1 }}
              >
                <h4 style={{ color: "white", fontSize: "14px", fontWeight: 600, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>
                  {section.title}
                </h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {section.links.map((link, linkIdx) => (
                    <motion.li 
                      key={linkIdx} 
                      style={{ marginBottom: "12px" }}
                      whileHover={{ x: 4 }}
                    >
                      <Link 
                        href={link.href} 
                        style={{ 
                          color: "rgba(255, 255, 255, 0.4)", 
                          textDecoration: "none", 
                          fontSize: "14px",
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = "white"}
                        onMouseLeave={(e) => e.currentTarget.style.color = "rgba(255, 255, 255, 0.4)"}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Bottom */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            style={{ 
              borderTop: "1px solid rgba(255, 255, 255, 0.05)", 
              paddingTop: "24px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "rgba(255, 255, 255, 0.3)", fontSize: "13px" }}>
              © 2026 Escambo. Todos os direitos reservados.
            </p>
          </motion.div>
        </div>
      </footer>

      {/* Global Styles */}
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        
        .hero-bg-gradient {
          position: absolute;
          inset: 0;
        }
        
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .tools-bento-grid {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto !important;
          }
          
          .tools-bento-grid > div {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </div>
  );
}
