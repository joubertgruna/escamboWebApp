"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, ArrowLeft, ArrowRight, Shield, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

export default function RegisterPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const { login } = useAuthStore();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const steps = [
    { number: 1, title: "Dados básicos", description: "Informe seu nome e e-mail" },
    { number: 2, title: "Sua senha", description: "Escolha uma senha segura" },
    { number: 3, title: "Localização", description: "Onde você está?" },
  ];

  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 2) return "bg-orange-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength <= 1) return "Fraca";
    if (passwordStrength <= 2) return "Razoável";
    if (passwordStrength <= 3) return "Boa";
    return "Forte";
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      error("Informe seu nome");
      return false;
    }
    if (!formData.email.trim()) {
      error("Informe seu e-mail");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      error("E-mail inválido");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      error("Informe uma senha");
      return false;
    }
    if (formData.password.length < 6) {
      error("A senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      error("As senhas não conferem");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!formData.city.trim()) {
      error("Informe sua cidade");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });
      login(response.user, response.token);
      success("Conta criada com sucesso!");
      router.push("/feed");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao criar conta. Tente novamente.";
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background with particles */}
      <div className="auth-background">
        <div className="auth-gradient-orb auth-orb-1" />
        <div className="auth-gradient-orb auth-orb-2" />
        <div className="auth-gradient-orb auth-orb-3" />
        <div className="auth-pattern" />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -80 - (i * 10), 0],
              x: [0, Math.sin(i * 0.8) * 30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 10 + i * 1.5,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
            style={{
              position: "absolute",
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              borderRadius: "50%",
              background: i % 3 === 0 ? "#34c759" : `rgba(255, 255, 255, ${0.3 + (i % 4) * 0.1})`,
              left: `${5 + i * 8}%`,
              top: `${20 + (i % 5) * 15}%`,
              filter: "blur(0.5px)",
              pointerEvents: "none",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="auth-container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.4 }} 
          className="auth-form-card"
          style={{ maxWidth: "440px", width: "100%", margin: "20px" }}
        >
          {/* Header with back button and progress */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <button
                onClick={handleBack}
                className="auth-input-toggle"
                style={{ padding: "8px", borderRadius: "10px", background: "rgba(255,255,255,0.05)" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <span style={{ fontSize: "14px", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>
                Passo <span style={{ color: "#34c759" }}>{step}</span> de {steps.length}
              </span>
              <div style={{ width: "37px" }} />
            </div>
            
            {/* Progress Bar */}
            <div style={{ display: "flex", gap: "8px" }}>
              {steps.map((s) => (
                <div key={s.number} style={{ flex: 1 }}>
                  <div
                    style={{
                      height: "4px",
                      borderRadius: "2px",
                      background: s.number <= step ? "#34c759" : "rgba(255,255,255,0.1)",
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div className="auth-mobile-logo" style={{ marginBottom: "24px" }}>
            <Logo size="sm" showText={true} textColor="white" />
          </div>

          {/* Step Title */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="auth-form-header"
              style={{ marginBottom: "32px" }}
            >
              <h2>{steps[step - 1]?.title}</h2>
              <p>{steps[step - 1]?.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Form Steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="auth-form"
            >
              <div className="auth-form-fields">
                {step === 1 && (
                  <>
                    <div className="auth-input-group">
                      <label>Nome completo</label>
                      <div className="auth-input-wrapper">
                        <User className="auth-input-icon" />
                        <input
                          type="text"
                          placeholder="Seu nome"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="auth-input"
                          autoComplete="name"
                        />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>E-mail</label>
                      <div className="auth-input-wrapper">
                        <Mail className="auth-input-icon" />
                        <input
                          type="email"
                          placeholder="seu@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="auth-input"
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="auth-input-group">
                      <label>Senha</label>
                      <div className="auth-input-wrapper">
                        <Lock className="auth-input-icon" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="auth-input"
                          autoComplete="new-password"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-toggle">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {formData.password && (
                        <div className="auth-password-strength">
                          <div className="auth-strength-bars">
                            {[1,2,3,4,5].map((level) => (
                              <div key={level} className={cn("auth-strength-bar", passwordStrength >= level && getStrengthColor())} />
                            ))}
                          </div>
                          <span className={cn(
                            "auth-strength-text",
                            passwordStrength <= 1 && "text-red-500",
                            passwordStrength === 2 && "text-orange-500",
                            passwordStrength === 3 && "text-yellow-600",
                            passwordStrength >= 4 && "text-green-500"
                          )}>
                            {getStrengthText()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="auth-input-group">
                      <label>Confirmar senha</label>
                      <div className="auth-input-wrapper">
                        <Lock className="auth-input-icon" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Repita a senha"
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="auth-input"
                          autoComplete="new-password"
                        />
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <Check className="auth-input-check" />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="auth-input-group">
                      <label>Telefone <span className="auth-optional">(opcional)</span></label>
                      <div className="auth-input-wrapper">
                        <Phone className="auth-input-icon" />
                        <input
                          type="tel"
                          placeholder="(00) 00000-0000"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="auth-input"
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>Cidade</label>
                      <div className="auth-input-wrapper">
                        <MapPin className="auth-input-icon" />
                        <input
                          type="text"
                          placeholder="Sua cidade"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="auth-input"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Action Button */}
              <div style={{ marginTop: "32px" }}>
                {step < 3 ? (
                  <button onClick={handleNext} className="auth-submit">
                    <span>Continuar</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={handleSubmit} disabled={isLoading} className="auth-submit">
                    {isLoading ? (
                      <div className="auth-spinner" />
                    ) : (
                      <>
                        <span>Criar conta</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Terms (only on last step) */}
              {step === 3 && (
                <p className="auth-terms" style={{ marginTop: "16px" }}>
                  Ao criar uma conta, você concorda com nossos{" "}
                  <Link href="/terms">Termos de Uso</Link> e{" "}
                  <Link href="/privacy">Política de Privacidade</Link>
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div style={{ marginTop: "24px", textAlign: "center" }}>
            <p className="auth-switch-mobile">
              Já tem uma conta?{" "}
              <Link href="/login" style={{ color: "#34c759", fontWeight: 600 }}>
                Entrar
              </Link>
            </p>
          </div>

          {/* Security Badge */}
          <div className="auth-security" style={{ marginTop: "20px" }}>
            <Shield className="w-4 h-4" />
            <span>Conexão segura com criptografia SSL</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
