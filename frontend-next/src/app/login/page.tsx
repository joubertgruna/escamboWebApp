"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, Shield, Sparkles, ArrowRight, Check } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { useAuthStore } from "@/store/auth";
import { authService } from "@/services/auth";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error } = useToast();
  const { login } = useAuthStore();

  const initialTab = searchParams.get("tab") === "register" ? "register" : "login";
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    const password = registerData.password;
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  }, [registerData.password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) { error("Preencha todos os campos"); return; }
    setIsLoading(true);
    try {
      const response = await authService.login(loginData.email, loginData.password);
      login(response.user, response.token);
      success("Login realizado com sucesso!");
      router.push("/feed");
    } catch (err: any) {
      error(err.response?.data?.message || "Credenciais inválidas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.name || !registerData.email || !registerData.password) { error("Preencha todos os campos obrigatórios"); return; }
    if (registerData.password.length < 6) { error("A senha deve ter pelo menos 6 caracteres"); return; }
    if (registerData.password !== registerData.confirmPassword) { error("As senhas não conferem"); return; }
    setIsLoading(true);
    try {
      const response = await authService.register({ name: registerData.name, email: registerData.email, password: registerData.password, phone: registerData.phone });
      login(response.user, response.token);
      success("Conta criada com sucesso!");
      router.push("/feed");
    } catch (err: any) {
      error(err.response?.data?.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="auth-page">
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

      <div className="auth-container">
        <div className="auth-branding">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="auth-branding-content">
            <div className="auth-logo">
              <Logo size="lg" showText={true} textColor="white" />
            </div>
            <h1 className="auth-tagline">Troque o que você tem<br /><span className="auth-tagline-highlight">pelo que você quer</span></h1>
            <p className="auth-description">A plataforma mais segura para trocar itens com pessoas próximas a você.</p>
            <div className="auth-features">
              <div className="auth-feature">
                <div className="auth-feature-icon"><Shield className="w-5 h-5" /></div>
                <div><h3>100% Seguro</h3><p>Verificação de usuários e chat protegido</p></div>
              </div>
              <div className="auth-feature">
                <div className="auth-feature-icon"><Sparkles className="w-5 h-5" /></div>
                <div><h3>Simples e Rápido</h3><p>Encontre matches em segundos</p></div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="auth-form-container">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="auth-form-card">
            <div className="auth-mobile-logo">
              <Logo size="sm" showText={true} textColor="white" />
            </div>

            <div className="auth-tabs">
              <button onClick={() => setActiveTab("login")} className={cn("auth-tab", activeTab === "login" && "auth-tab-active")}>Entrar</button>
              <button onClick={() => setActiveTab("register")} className={cn("auth-tab", activeTab === "register" && "auth-tab-active")}>Criar conta</button>
              <div className="auth-tab-indicator" style={{ transform: activeTab === "login" ? "translateX(0)" : "translateX(100%)" }} />
            </div>

            <AnimatePresence mode="wait">
              {activeTab === "login" ? (
                <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }} onSubmit={handleLogin} className="auth-form">
                  <div className="auth-form-header"><h2>Bem-vindo de volta!</h2><p>Entre com suas credenciais para continuar</p></div>
                  <div className="auth-form-fields">
                    <div className="auth-input-group">
                      <label>E-mail</label>
                      <div className="auth-input-wrapper">
                        <Mail className="auth-input-icon" />
                        <input type="email" placeholder="seu@email.com" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="auth-input" autoComplete="email" />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>Senha</label>
                      <div className="auth-input-wrapper">
                        <Lock className="auth-input-icon" />
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="auth-input" autoComplete="current-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-toggle">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                      </div>
                    </div>
                    <div className="auth-forgot"><Link href="/forgot-password">Esqueceu a senha?</Link></div>
                  </div>
                  <button type="submit" disabled={isLoading} className="auth-submit">{isLoading ? <div className="auth-spinner" /> : <><span>Entrar</span><ArrowRight className="w-5 h-5" /></>}</button>
                  <p className="auth-switch-mobile">Não tem uma conta? <button type="button" onClick={() => setActiveTab("register")}>Criar conta</button></p>
                </motion.form>
              ) : (
                <motion.form key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} onSubmit={handleRegister} className="auth-form">
                  <div className="auth-form-header"><h2>Criar sua conta</h2><p>Comece a trocar itens gratuitamente</p></div>
                  <div className="auth-form-fields auth-form-fields-register">
                    <div className="auth-input-group">
                      <label>Nome completo</label>
                      <div className="auth-input-wrapper">
                        <User className="auth-input-icon" />
                        <input type="text" placeholder="Seu nome" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} className="auth-input" autoComplete="name" />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>E-mail</label>
                      <div className="auth-input-wrapper">
                        <Mail className="auth-input-icon" />
                        <input type="email" placeholder="seu@email.com" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} className="auth-input" autoComplete="email" />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>Telefone <span className="auth-optional">(opcional)</span></label>
                      <div className="auth-input-wrapper">
                        <Phone className="auth-input-icon" />
                        <input type="tel" placeholder="(00) 00000-0000" value={registerData.phone} onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })} className="auth-input" autoComplete="tel" />
                      </div>
                    </div>
                    <div className="auth-input-group">
                      <label>Senha</label>
                      <div className="auth-input-wrapper">
                        <Lock className="auth-input-icon" />
                        <input type={showPassword ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} className="auth-input" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="auth-input-toggle">{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                      </div>
                      {registerData.password && (
                        <div className="auth-password-strength">
                          <div className="auth-strength-bars">{[1,2,3,4,5].map((level) => <div key={level} className={cn("auth-strength-bar", passwordStrength >= level && getStrengthColor())} />)}</div>
                          <span className={cn("auth-strength-text", passwordStrength <= 1 && "text-red-500", passwordStrength === 2 && "text-orange-500", passwordStrength === 3 && "text-yellow-600", passwordStrength >= 4 && "text-green-500")}>{getStrengthText()}</span>
                        </div>
                      )}
                    </div>
                    <div className="auth-input-group">
                      <label>Confirmar senha</label>
                      <div className="auth-input-wrapper">
                        <Lock className="auth-input-icon" />
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="Repita a senha" value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} className="auth-input" autoComplete="new-password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="auth-input-toggle">{showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                        {registerData.confirmPassword && registerData.password === registerData.confirmPassword && <Check className="auth-input-check" />}
                      </div>
                    </div>
                  </div>
                  <p className="auth-terms">Ao criar uma conta, você concorda com nossos <Link href="/terms">Termos de Uso</Link> e <Link href="/privacy">Política de Privacidade</Link></p>
                  <button type="submit" disabled={isLoading} className="auth-submit">{isLoading ? <div className="auth-spinner" /> : <><span>Criar conta</span><ArrowRight className="w-5 h-5" /></>}</button>
                  <p className="auth-switch-mobile">Já tem uma conta? <button type="button" onClick={() => setActiveTab("login")}>Entrar</button></p>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="auth-security"><Shield className="w-4 h-4" /><span>Conexão segura com criptografia SSL</span></div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="auth-page"><div className="auth-background"><div className="auth-gradient-orb auth-orb-1" /><div className="auth-gradient-orb auth-orb-2" /></div><div className="flex items-center justify-center min-h-screen"><div className="auth-spinner" /></div></div>}>
      <AuthContent />
    </Suspense>
  );
}
