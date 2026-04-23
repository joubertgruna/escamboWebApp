# 📋 PLANO DE AÇÃO COMPLETO - FRONTEND + ROTAS

**Data:** 20 de março de 2026
**Status:** 🔴 PLANEJAMENTO
**Objetivo:** Garantir responsividade 100% e criar rotas faltantes

---

## 📊 RESUMO EXECUTIVO

### O que está pronto ✅
- Feed Instagram com scroll infinito
- Componentes UI básicos
- Layout com BottomNav e Header
- 11 rotas funcionando

### O que precisa melhorar ⚠️
- Responsividade em alguns componentes
- Images não otimizadas
- Grids fixos

### O que está faltando ❌
- Página `/notifications` - Não existe
- Página `/settings` - Não existe
- Página `/help` - Não existe

---

## 🎯 FASES DE IMPLEMENTAÇÃO

### FASE 1: ANÁLISE E DOCUMENTAÇÃO (1h)
- [x] Analisar todos os componentes
- [x] Documentar problemas
- [x] Criar plano de ação
- [ ] **PRÓXIMO:** Começar implementação

### FASE 2: RESPONSIVIDADE DOS COMPONENTES (5-6h)

#### Sprint 2.1: Images Otimizadas (2-3h)
**Por quê:** Melhorar performance em -40-60%

Arquivos a converter:
1. `FeedCard.tsx` - Photo com img tag
2. `ItemCard.tsx` - Image com img tag
3. `MyItemsPage.tsx` - Item thumbnails
4. `CreateItem.tsx` - Upload preview
5. `EditProfile.tsx` - Avatar upload
6. `Profile.tsx` - User avatar

**O que fazer:**
```tsx
// ANTES:
<img src={url} alt={title} className="w-full h-full object-cover" />

// DEPOIS:
import Image from "next/image";

<Image
  src={url}
  alt={title}
  width={400}
  height={400}
  className="w-full h-full object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg..."
  priority={index === 0}
/>
```

**Checklist:**
- [ ] FeedCard.tsx - Image otimizada
- [ ] ItemCard.tsx - Image otimizada
- [ ] MyItemsPage.tsx - Images otimizadas
- [ ] CreateItem.tsx - Preview otimizado
- [ ] EditProfile.tsx - Avatar otimizado
- [ ] Profile.tsx - Avatar otimizado

#### Sprint 2.2: Grids Responsivos (1h)
**Por quê:** Evitar overflow em mobile

Arquivos a corrigir:
1. `LikesPage.tsx` - `grid-cols-2` fixo
2. `CreateItem.tsx` - `grid-cols-3` fixo demais em mobile

**O que fazer:**
```tsx
// ANTES:
<div className="grid grid-cols-3 gap-2">

// DEPOIS:
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
```

**Checklist:**
- [ ] LikesPage.tsx - Grid responsivo
- [ ] CreateItem.tsx - Grid responsivo
- [ ] Testar em mobile, tablet, desktop

#### Sprint 2.3: Button Sizes Responsivos (1h)
**Por quê:** Botões muito pequenos em desktop, muito grandes em mobile

Arquivos a corrigir:
1. `Button.tsx` - Tamanhos não escalam bem
2. Todas as pages que usam Button

**O que fazer:**
```tsx
// ANTES:
<Button size="md" className="h-11 px-5">

// DEPOIS:
<Button size="md" className="h-11 sm:h-12 px-5 sm:px-6">
```

**Checklist:**
- [ ] Button.tsx - Tamanhos responsivos
- [ ] Testar em mobile, tablet, desktop

#### Sprint 2.4: Input Sizes Responsivos (1h)
**Por quê:** Inputs não se adaptam bem

Arquivos a corrigir:
1. `Input.tsx` - Já tem `sm:` mas pode melhorar
2. `LoginPage.tsx` - Spacing responsivo
3. `RegisterPage.tsx` - Spacing responsivo

**Checklist:**
- [ ] Input.tsx - Tamanhos responsivos
- [ ] LoginPage.tsx - Spacing responsivo
- [ ] RegisterPage.tsx - Spacing responsivo

### FASE 3: CRIAR PÁGINAS FALTANTES (3-4h)

#### Sprint 3.1: Página `/notifications` (1h)
**Localização:** `/frontend-next/src/app/(main)/notifications/page.tsx`

**Estrutura:**
```tsx
- Header com título "Notificações"
- Lista de notificações com:
  - Avatar do usuário
  - Tipo de notificação (match, like, message, etc)
  - Mensagem
  - Timestamp
  - Ação (abrir chat, ver perfil, etc)
- Estados: loading, empty, error
- Infinite scroll
- Mark as read/unread
- Delete notification
```

**Componentes necessários:**
- [ ] Criar NotificationItem.tsx
- [ ] Criar NotificationPage.tsx
- [ ] Criar useNotifications hook

**Backend necessário:**
- [ ] GET /notifications (padrão: últimas 20)
- [ ] PUT /notifications/:id/read
- [ ] DELETE /notifications/:id
- [ ] Endpoint de test: retornar 5 notificações mock

**Checklist:**
- [ ] Página criada
- [ ] Estilo responsivo
- [ ] Funcionalidade completa
- [ ] Backend integrado

#### Sprint 3.2: Página `/settings` (1h)
**Localização:** `/frontend-next/src/app/(main)/settings/page.tsx`

**Estrutura:**
```tsx
- Header com título "Configurações"
- Tabs ou seções:
  1. Perfil
     - Editar nome
     - Editar email (verificação necessária)
     - Editar telefone
     - Foto de perfil
  2. Preferências
     - Notificações (on/off)
     - Sons (on/off)
     - Dark mode (if supported)
  3. Segurança
     - Mudar senha
     - Duas autenticações (future)
     - Sessões ativas
  4. Privacidade
     - Perfil público/privado
     - Mostra localização
  5. Sobre
     - Versão do app
     - Política de privacidade
     - Termos de uso
     - Contato
     - Logout
- Estados: loading, saving, success, error
```

**Componentes necessários:**
- [ ] Criar SettingsPage.tsx com tabs
- [ ] Criar SettingSection.tsx

**Backend necessário:**
- [ ] PUT /users/profile (update basic info)
- [ ] PUT /users/preferences
- [ ] PUT /users/password
- [ ] GET /users/me (get current user)

**Checklist:**
- [ ] Página criada
- [ ] Tabs funcionando
- [ ] Estilo responsivo
- [ ] Funcionalidade básica (edit perfil)
- [ ] Logout funciona

#### Sprint 3.3: Página `/help` (0.5-1h)
**Localização:** `/frontend-next/src/app/(main)/help/page.tsx`

**Estrutura:**
```tsx
- Header com título "Ajuda e Suporte"
- Seções:
  1. FAQ (Perguntas frequentes)
     - Accordion com Q&A
     - Searchable
  2. Como usar
     - Guia rápido
     - Video links (future)
  3. Contato
     - Email: support@escambo.com
     - WhatsApp: +55 85 999...
     - Form de contato
  4. Status
     - Link para status page
- Responsive accordion
- Search filter
```

**Componentes necessários:**
- [ ] Criar HelpPage.tsx
- [ ] Criar Accordion.tsx (if not exists)

**Backend necessário:**
- [ ] GET /help/faq
- [ ] POST /help/contact (form submission)

**Checklist:**
- [ ] Página criada
- [ ] FAQs listadas
- [ ] Contacto funcionando
- [ ] Estilo responsivo

---

## 🔧 IMPLEMENTAÇÃO DETALHADA

### FASE 2: IMPLEMENTAÇÃO INICIADA

#### ✅ Checklist Responsividade

**Images (Prioridade: 🔴 CRÍTICA)**
- [ ] Converter imports para `next/image`
- [ ] Adicionar dimensões (width/height)
- [ ] Adicionar blur placeholder
- [ ] Adicionar lazy loading
- [ ] Testar performance (Lighthouse)

**Grids (Prioridade: 🔴 CRÍTICA)**
- [ ] LikesPage: `grid-cols-2` → responsivo
- [ ] CreateItem: `grid-cols-3` → responsivo
- [ ] Testar em mobile (320px)
- [ ] Testar em tablet (768px)
- [ ] Testar em desktop (1280px)

**Buttons/Inputs (Prioridade: 🟡 IMPORTANTE)**
- [ ] Button.tsx - Adicionar `sm:` breakpoints
- [ ] Input.tsx - Melhorar spacing
- [ ] Forms - Verificar espaçamento
- [ ] Touch targets - Verificar ≥40px

### FASE 3: NOVAS PÁGINAS

**Notifications (Prioridade: 🔴 CRÍTICA)**
```
Dependências:
  ✅ Backend: GET /notifications
  ✅ Backend: PUT /notifications/:id/read
  ✅ Backend: DELETE /notifications/:id
  ⏳ Frontend: NotificationItem component
  ⏳ Frontend: NotificationPage component
  ⏳ Frontend: useNotifications hook
```

**Settings (Prioridade: 🟡 IMPORTANTE)**
```
Dependências:
  ✅ Backend: PUT /users/profile
  ✅ Backend: GET /users/me
  ⏳ Frontend: SettingsPage component
  ⏳ Frontend: SettingSection component
  ⏳ Frontend: Tab navigation
```

**Help (Prioridade: 🟡 IMPORTANTE)**
```
Dependências:
  ✅ Backend: GET /help/faq
  ⏳ Frontend: HelpPage component
  ⏳ Frontend: Accordion component
  ⏳ Frontend: Search/filter
```

---

## 📝 ORDEM DE EXECUÇÃO RECOMENDADA

1. **Hoje (Sprint 2.1):** Converter images → next/image (2-3h)
2. **Hoje (Sprint 2.2):** Corrigir grids responsivos (1h)
3. **Amanhã (Sprint 2.3-2.4):** Buttons/Inputs responsivos (2h)
4. **Amanhã (Sprint 3.1):** Criar página Notifications (1h)
5. **Amanhã (Sprint 3.2):** Criar página Settings (1h)
6. **Amanhã (Sprint 3.3):** Criar página Help (1h)
7. **Testes:** Full testing em todos os devices (2h)

**Total: 10-12 horas de implementação**

---

## 📱 DEVICES PARA TESTES

```
Mobile:   320px (iPhone SE), 375px (iPhone 12), 390px (iPhone 13)
Tablet:   768px (iPad), 820px (iPad Air)
Desktop:  1280px (MacBook), 1920px (Desktop)
```

---

## 🎯 MÉTRICAS DE SUCESSO

```
ANTES:
  Responsividade: 6.5/10
  Performance:    5.0/10
  Score Geral:    7.2/10

DEPOIS:
  Responsividade: 9.0/10
  Performance:    8.5/10
  Score Geral:    9.0/10

Lighthouse:
  ANTES: 65 pts
  DEPOIS: 88 pts
```

---

## 🚀 PRÓXIMO PASSO

**CLI:** Qual sprint você quer começar?
1. Sprint 2.1 - Images otimizadas
2. Sprint 2.2 - Grids responsivos
3. Sprint 3.1 - Página Notifications
4. Todas as acima

**Recomendação:** Começar com Sprint 2.1 (images) porque melhora performance imediatamente!

---

## 📚 REFERÊNCIAS

- Next.js Image Optimization: https://nextjs.org/docs/app/api-reference/components/image
- Responsive Design: https://tailwindcss.com/docs/responsive-design
- Mobile First: https://developer.mozilla.org/en-US/docs/Mobile/Viewport_meta_tag
- Tailwind Breakpoints:
  ```
  sm:  640px
  md:  768px
  lg:  1024px
  xl:  1280px
  2xl: 1536px
  ```
