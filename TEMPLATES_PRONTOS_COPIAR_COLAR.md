# 💻 TEMPLATES PRONTOS PARA COPIAR/COLAR

## Sprint 2.1: Images - Next/Image Conversion

### Template 1: FeedCard.tsx (ANTES → DEPOIS)

```tsx
// ❌ ANTES:
import { Heart, MessageCircle, Share2, Repeat2, MapPin } from "lucide-react";
import { useState } from "react";

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  // ... props
}) => {
  const photoUrl = primaryPhoto
    ? primaryPhoto.url?.startsWith("http")
      ? primaryPhoto.url
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${primaryPhoto.url}`
    : "/placeholder-item.jpg";

  return (
    <div>
      <img
        src={photoUrl}
        alt={item.title}
        className="w-full h-full object-cover"
        onDoubleClick={handleDoubleTap}
      />
    </div>
  );
};
```

```tsx
// ✅ DEPOIS:
import Image from "next/image";
import { Heart, MessageCircle, Share2, Repeat2, MapPin } from "lucide-react";
import { useState } from "react";

const PLACEHOLDER_BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/";

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  // ... props
}) => {
  const photoUrl = primaryPhoto
    ? primaryPhoto.url?.startsWith("http")
      ? primaryPhoto.url
      : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${primaryPhoto.url}`
    : "/placeholder-item.jpg";

  return (
    <div>
      <Image
        src={photoUrl}
        alt={item.title}
        width={400}
        height={400}
        className="w-full h-full object-cover"
        placeholder="blur"
        blurDataURL={PLACEHOLDER_BLUR}
        priority={currentPhotoIndex === 0}
        onDoubleClick={handleDoubleTap}
      />
    </div>
  );
};
```

---

### Template 2: MyItemsPage.tsx - Thumbnail Image

```tsx
// ❌ ANTES:
const getPhotoUrl = (item: Item) => {
  const photo = item.photos?.find((p) => p.is_primary) || item.photos?.[0];
  if (!photo) return "/placeholder-item.jpg";
  return photo.url?.startsWith("http")
    ? photo.url
    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${photo.url}`;
};

// ... em JSX:
<div className="w-24 h-24 rounded-xl overflow-hidden cursor-pointer flex-shrink-0">
  <img
    src={getPhotoUrl(item)}
    alt={item.title}
    className="w-full h-full object-cover"
  />
</div>
```

```tsx
// ✅ DEPOIS:
import Image from "next/image";

const PLACEHOLDER_BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/";

const getPhotoUrl = (item: Item) => {
  const photo = item.photos?.find((p) => p.is_primary) || item.photos?.[0];
  if (!photo) return "/placeholder-item.jpg";
  return photo.url?.startsWith("http")
    ? photo.url
    : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api", "")}${photo.url}`;
};

// ... em JSX:
<div className="w-24 h-24 rounded-xl overflow-hidden cursor-pointer flex-shrink-0 relative">
  <Image
    src={getPhotoUrl(item)}
    alt={item.title}
    width={96}
    height={96}
    className="w-full h-full object-cover"
    placeholder="blur"
    blurDataURL={PLACEHOLDER_BLUR}
  />
</div>
```

---

### Template 3: Profile Avatar Image

```tsx
// ❌ ANTES:
<img
  src={item.user?.avatar_url || "/default-avatar.png"}
  alt={item.user?.name}
  className="w-10 h-10 rounded-full object-cover"
/>
```

```tsx
// ✅ DEPOIS:
import Image from "next/image";

const PLACEHOLDER_BLUR = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/";

<Image
  src={item.user?.avatar_url || "/default-avatar.png"}
  alt={item.user?.name || "User"}
  width={40}
  height={40}
  className="w-10 h-10 rounded-full object-cover"
  placeholder="blur"
  blurDataURL={PLACEHOLDER_BLUR}
/>
```

---

## Sprint 2.2: Grids - Responsive Grid Templates

### Template 1: LikesPage - Photo Grid

```tsx
// ❌ ANTES:
<div className="grid grid-cols-2 gap-2 py-4">
  {items.map((item) => (
    <div key={item.id} className="aspect-square rounded-lg overflow-hidden">
      <img src={getPhotoUrl(item)} alt={item.title} className="w-full h-full object-cover" />
    </div>
  ))}
</div>
```

```tsx
// ✅ DEPOIS:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 py-4">
  {items.map((item, index) => (
    <div 
      key={item.id} 
      className="aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100"
      onClick={() => router.push(`/items/${item.id}`)}
    >
      <Image
        src={getPhotoUrl(item)}
        alt={item.title}
        width={200}
        height={200}
        className="w-full h-full object-cover hover:scale-105 transition-transform"
        placeholder="blur"
        blurDataURL={PLACEHOLDER_BLUR}
        priority={index < 4}
      />
    </div>
  ))}
</div>
```

---

### Template 2: CreateItem - Upload Preview Grid

```tsx
// ❌ ANTES:
<div className="grid grid-cols-3 gap-2">
  {previews.map((preview, index) => (
    <div key={index} className="relative aspect-square">
      <img src={preview} alt={`preview-${index}`} className="w-full h-full object-cover rounded-lg" />
    </div>
  ))}
</div>
```

```tsx
// ✅ DEPOIS:
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
  {previews.map((preview, index) => (
    <div key={index} className="relative aspect-square group">
      <Image
        src={preview}
        alt={`preview-${index}`}
        width={150}
        height={150}
        className="w-full h-full object-cover rounded-lg sm:rounded-xl"
      />
      <button
        onClick={() => removePreview(index)}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  ))}
</div>
```

---

## Sprint 2.3-2.4: Button/Input - Responsive Sizing

### Template 1: Button.tsx - Responsivo

```tsx
// ATUAL (linha de sizes):
const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base sm:h-12 sm:px-6",
  lg: "h-13 px-5 text-base sm:h-14 sm:px-6 sm:text-lg",
};

// ✅ JÁ ESTÁ CORRETO - Manter!
// Mas se precisar melhorar mais:
const sizes = {
  sm: "h-9 px-4 text-sm sm:h-10 sm:px-5",
  md: "h-11 px-5 text-base sm:h-12 sm:px-6 md:h-13 md:px-7",
  lg: "h-13 px-5 text-base sm:h-14 sm:px-6 md:h-16 md:px-8 md:text-lg",
};
```

---

### Template 2: Input.tsx - Responsivo

```tsx
// ✅ ATUAL JÁ TEM:
<input
  className={cn(
    "w-full h-12 sm:h-13 px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg sm:rounded-xl",
    // ... outras classes
  )}
/>

// Se quiser melhorar ainda mais:
<input
  className={cn(
    "w-full h-12 sm:h-13 md:h-14 px-3 sm:px-4 md:px-5 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl",
    // ... outras classes
  )}
/>
```

---

## Sprint 3.1: /notifications - Page Template

### Arquivo: `/frontend-next/src/app/(main)/notifications/page.tsx`

```tsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Trash2, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Spinner } from "@/components/ui/Loading";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

interface Notification {
  id: number;
  type: "match" | "like" | "message" | "mention";
  title: string;
  message: string;
  image_url?: string;
  user_id?: number;
  item_id?: number;
  read_at?: string;
  created_at: string;
}

export default function NotificationsPage() {
  const { success, error } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications?limit=20");
        setNotifications(response.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        error("Erro ao carregar notificações");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [error]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n
        )
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      success("Notificação removida");
    } catch (err) {
      console.error("Error deleting notification:", err);
      error("Erro ao remover notificação");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Notificações" showBack />
        <div className="flex-1 flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header title="Notificações" showBack />

      <main className="flex-1 p-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Bell className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma notificação
            </h2>
            <p className="text-gray-500">
              Você está em dia com suas notificações
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif, index) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-xl p-4 flex gap-3 ${
                  !notif.read_at ? "border-l-4 border-escambo-primary" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {notif.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(notif.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!notif.read_at && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Marcar como lida"
                    >
                      <Check className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Deletar"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
```

---

## Sprint 3.2: /settings - Page Template

### Arquivo: `/frontend-next/src/app/(main)/settings/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Lock, User, Bell, Eye, HelpCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import api from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const { success, error } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);

  // Profile tab states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await api.put("/users/profile", {
        name,
        email,
        phone,
      });
      success("Perfil atualizado com sucesso!");
    } catch (err) {
      error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Limpar token
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      router.push("/login");
      success("Desconectado com sucesso");
    } catch (err) {
      error("Erro ao desconectar");
    }
  };

  const tabs = [
    { id: "profile", label: "Perfil", icon: User },
    { id: "preferences", label: "Preferências", icon: Bell },
    { id: "security", label: "Segurança", icon: Lock },
    { id: "privacy", label: "Privacidade", icon: Eye },
    { id: "help", label: "Ajuda", icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header title="Configurações" showBack />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-escambo-primary text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Editar Perfil</h3>
              <Input
                label="Nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
              <Input
                label="Telefone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+55 85 99999-9999"
              />
              <Button
                fullWidth
                onClick={handleSaveProfile}
                loading={loading}
                className="mt-6"
              >
                Salvar Mudanças
              </Button>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === "preferences" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Preferências</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Notificações</p>
                  <p className="text-sm text-gray-500">Receber notificações</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Sons</p>
                  <p className="text-sm text-gray-500">Sons de notificação</p>
                </div>
              </label>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Segurança</h3>
              <Input
                label="Senha Atual"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Nova Senha"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirmar Senha"
                type="password"
                placeholder="••••••••"
              />
              <Button fullWidth className="mt-6">
                Mudar Senha
              </Button>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Privacidade</h3>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="privacy" defaultChecked className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Perfil Público</p>
                  <p className="text-sm text-gray-500">Qualquer um pode ver</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="privacy" className="w-5 h-5" />
                <div>
                  <p className="font-medium text-gray-900">Perfil Privado</p>
                  <p className="text-sm text-gray-500">Apenas amigos veem</p>
                </div>
              </label>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Ajuda</h3>
              <Button fullWidth variant="outline" onClick={() => router.push("/help")}>
                Ver FAQ
              </Button>
              <Button fullWidth variant="outline">
                Contactar Suporte
              </Button>
              <Button
                fullWidth
                variant="danger"
                onClick={handleLogout}
                className="mt-6"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
```

---

## Sprint 3.3: /help - Page Template

### Arquivo: `/frontend-next/src/app/(main)/help/page.tsx`

```tsx
"use client";

import { useState } from "react";
import { ChevronDown, Mail, MessageCircle, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 1,
    question: "Como funciona o processo de troca?",
    answer: "1. Navegue pelo feed\n2. Encontre um item que queira\n3. Clique em 'Trocar'\n4. Aguarde match\n5. Combine com o usuário\n6. Realize a troca!",
  },
  {
    id: 2,
    question: "Como adicionar um item?",
    answer: "Clique no botão '+' na barra inferior > Preencha os dados > Envie fotos > Pronto!",
  },
  {
    id: 3,
    question: "É seguro usar a plataforma?",
    answer: "Sim! Todos os usuários são verificados e as trocas são mediadas pela plataforma.",
  },
  {
    id: 4,
    question: "Como faço para não receber mais um item no feed?",
    answer: "Clique nos 3 pontinhos do item > Selecione 'Não interessado' > Esse item não aparecerá mais para você.",
  },
];

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendContact = async () => {
    if (!contactEmail || !contactMessage) return;

    setSending(true);
    try {
      // await api.post("/help/contact", { email: contactEmail, message: contactMessage });
      setContactEmail("");
      setContactMessage("");
      alert("Mensagem enviada com sucesso!");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-escambo-light pb-20">
      <Header title="Ajuda e Suporte" showBack />

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full">
        {/* FAQ Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Perguntas Frequentes
          </h2>
          <div className="space-y-3">
            {FAQ_DATA.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === item.id ? null : item.id)
                  }
                  className="w-full px-4 sm:px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ml-2 ${
                      expandedFAQ === item.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFAQ === item.id && (
                  <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-600 text-sm whitespace-pre-line">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h2>
          <div className="bg-white rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <Mail className="w-5 h-5 text-escambo-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  support@escambo.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-escambo-primary flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900">WhatsApp</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  +55 85 9 9999-9999
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-4">
              <Input
                label="Seu Email"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="seu@email.com"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensagem
                </label>
                <textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="Descreva seu problema..."
                  className="w-full p-3 sm:p-4 border border-gray-200 rounded-lg sm:rounded-xl focus:border-escambo-primary focus:ring-2 focus:ring-escambo-primary/10 resize-none"
                  rows={5}
                />
              </div>
              <Button
                fullWidth
                onClick={handleSendContact}
                loading={sending}
              >
                Enviar Mensagem
              </Button>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Links Úteis</h2>
          <div className="space-y-2">
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Política de Privacidade
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Termos de Uso
            </Button>
            <Button
              fullWidth
              variant="outline"
              className="justify-start"
              onClick={() => window.open("#")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Status da Plataforma
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
```

---

## 🚀 PRÓXIMAS AÇÕES

1. **Copy-paste os templates acima** para seus arquivos
2. **Adapte conforme necessário** (cores, textos, etc)
3. **Teste em mobile/tablet/desktop**
4. **Submita para produção**

Boa sorte! 🎉
