# 🛠️ PLANO DE AÇÃO - Frontend Next.js

## 📌 Gerado em: 20/03/2026

---

## 🎯 Objetivo
Refatorar frontend Next.js Escambo de score **7.2/10** para **9.0+/10** em **2 semanas**.

---

## 📅 Timeline

### SEMANA 1: Fixes Críticos

#### 🔴 Dia 1-2: Image Optimization (2-3h)
**Por quê:** +40-60% performance, LCP score +15pts

**Arquivos a refatorar:**
1. `FeedCard.tsx` - 1 imagem grande
2. `ItemCard.tsx` - 1 imagem grande
3. `LikesPage.tsx` - 2+ imagens em grid
4. `MatchesPage.tsx` - 1+ avatares
5. `ProfilePage.tsx` - 1 avatar grande
6. `EditProfilePage.tsx` - 1 avatar editar
7. `MyItemsPage.tsx` - Múltiplas thumbs

**Procedure:**
```bash
1. Instalar dependências (já tem next/image)
2. Para cada arquivo:
   a. Adicionar: import Image from 'next/image'
   b. Trocar <img> por <Image>
   c. Adicionar width/height
   d. Adicionar loading="lazy"
   e. Adicionar placeholder="blur"
   f. Testar renderização
3. Executar build: npm run build
4. Testar em mobile (Chrome DevTools)
5. Verificar Lighthouse
```

**Template completo:**
```jsx
import Image from 'next/image';
import { useState } from 'react';

// Em componente:
const [imageError, setImageError] = useState(false);

<Image
  src={photoUrl}
  alt={item.title}
  width={400}
  height={400}
  className="w-full h-full object-cover"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3C/svg%3E"
  onError={() => setImageError(true)}
/>
```

---

#### 🔴 Dia 3-4: Criar 3 Páginas Faltando (3-4h)

**1. `/notifications/page.tsx` (150 linhas)**

```tsx
// Estrutura
'use client';

import { Header } from '@/components/layout/Header';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { motion } from 'framer-motion';

interface Notification {
  id: number;
  type: 'like' | 'match' | 'message' | 'trade_accepted';
  user: {
    id: number;
    name: string;
    avatar_url?: string;
  };
  item?: {
    id: number;
    title: string;
  };
  message: string;
  timestamp: Date;
  read: boolean;
}

// Features:
- Lista paginada com timestamps
- Types: like, match, message, trade_accepted
- Ícones por tipo
- Avatar do usuário
- Marca como lido ao clicar
- Delete individual
- Clear all button
- Empty state
- Real-time updates com WebSocket (opcional)

// Tempo: 1-2h
```

**2. `/settings/page.tsx` (200 linhas)**

```tsx
// Estrutura
'use client';

// Seções:
1. NOTIFICAÇÕES
   - Toggle: Likes
   - Toggle: Matches
   - Toggle: Messages
   - Toggle: Trades
   - Toggle: Push Notifications

2. PRIVACIDADE
   - Select: Quem vê meu perfil (público, amigos, privado)
   - Select: Quem pode enviar mensagens
   - Toggle: Mostrar localização
   - Toggle: Mostrar telefone

3. PREFERÊNCIAS
   - Select: Idioma (PT-BR, EN)
   - Toggle: Dark Mode
   - Select: Tema de cores

4. SUPORTE
   - Links: Termos, Privacidade, FAQ
   - Button: Contato
   - Button: Deletar conta (com confirmação)

// Tempo: 1-2h
```

**3. `/help/page.tsx` (120 linhas)**

```tsx
// Estrutura
'use client';

// Seções com Accordion:
1. FAQ
   - "Como funciona a plataforma?"
   - "É seguro trocar?"
   - "Como sou avaliado?"
   - "Posso desfazer uma troca?"

2. COMO USAR
   - Passo a passo para criar item
   - Dicas de fotos
   - Melhores práticas

3. CONTATO
   - Email support
   - Formulário de contato
   - Redes sociais

4. SOBRE
   - Versão do app
   - Link site
   - Créditos

// Tempo: 1h
```

---

#### 🔴 Dia 5: Grids Responsivos (1h)

**Arquivo 1: `likes/page.tsx`**
```jsx
// De:
<div className="grid grid-cols-2 gap-3">

// Para:
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
```

**Arquivo 2: `create-item/page.tsx`**
```jsx
// De:
<div className="grid grid-cols-3 gap-3 mb-6">

// Para:
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
```

**Testar em:**
- 320px (iPhone SE)
- 375px (iPhone 12)
- 768px (iPad)
- 1024px (Desktop)

---

### SEMANA 2: Melhorias & Polish

#### 🟡 Dia 1-2: Breakpoints Responsivos (2h)

**Arquivo 1: `FeedCard.tsx`**
```jsx
// Header
<div className="p-4"> → <div className="p-3 sm:p-4 md:p-5">

// Title
<h3 className="text-lg"> → <h3 className="text-base sm:text-lg md:text-xl">

// Badge
px-3 py-1 → px-2 sm:px-3 py-0.5 sm:py-1

// Actions
gap-4 → gap-3 sm:gap-4
text-sm → text-xs sm:text-sm
```

**Arquivo 2: `ItemCard.tsx`**
```jsx
// Buttons
w-14 h-14 → w-12 h-12 sm:w-14 sm:h-14
w-16 h-16 → w-14 h-14 sm:w-16 sm:h-16

// Overlay text
text-lg → text-base sm:text-lg md:text-xl
```

**Arquivo 3: `CreateItemPage.tsx`**
```jsx
// Inputs
p-4 → p-3 sm:p-4
text-sm → text-xs sm:text-sm

// Category buttons
grid-cols-2 → grid-cols-2 md:grid-cols-3
```

---

#### 🟡 Dia 3: Suspense Boundaries (1h)

**Adicionar em `layout.tsx`:**
```tsx
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/Loading';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Suspense fallback={<PageLoading />}>
          {children}
        </Suspense>
      </body>
    </html>
  );
}
```

**Adicionar em rotas principais:**
```tsx
// Em feed/page.tsx, likes/page.tsx, etc
<Suspense fallback={<ItemCardSkeleton count={6} />}>
  <FeedContent />
</Suspense>
```

---

#### 🟡 Dia 4: Skeleton Loading (1h)

**Tornar responsivo:**
```jsx
// De:
<div className="h-24 w-24 bg-gray-200 rounded-lg animate-pulse" />

// Para:
<div className="h-20 sm:h-24 md:h-32 w-20 sm:w-24 md:w-32 bg-gray-200 rounded-lg animate-pulse" />
```

**Adicionar shimmer:**
```jsx
<div className="h-24 w-24 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer rounded-lg" />
```

---

#### 🟢 Dia 5: Polish & Testing (1h)

- [ ] Testar em mobile (Chrome DevTools)
- [ ] Testar em tablet
- [ ] Testar em desktop
- [ ] Executar Lighthouse
- [ ] Verificar console errors
- [ ] Testar keyboard navigation
- [ ] Testar touch interactions

---

## 📊 Resultados Esperados

### Performance
```
LCP:          2.5s → 1.8s  (↓ 27%)
FID:          100ms → 50ms (↓ 50%)
CLS:          0.1 → 0.05  (↓ 50%)
Score geral:  7.2 → 9.0   (↑ 25%)
```

### Responsividade
```
❌ 12 grids/padding/button sizes fixos → ✅ Todos responsivos
❌ 7 <img> não otimizadas → ✅ Todas como next/image
❌ 3 páginas faltando → ✅ Todas implementadas
```

---

## 📝 Checklist de Execução

### Semana 1
```
□ Dia 1-2: Converter imagens (2-3h)
  □ FeedCard.tsx
  □ ItemCard.tsx
  □ LikesPage.tsx
  □ MatchesPage.tsx
  □ ProfilePage.tsx
  □ EditProfilePage.tsx
  □ MyItemsPage.tsx
  □ Testar build e Lighthouse
  
□ Dia 3-4: Criar páginas (3-4h)
  □ /notifications/page.tsx (1-2h)
  □ /settings/page.tsx (1-2h)
  □ /help/page.tsx (1h)
  □ Testar rotas
  
□ Dia 5: Grids responsivos (1h)
  □ LikesPage: grid-cols-2 md:grid-cols-3
  □ CreateItem: grid-cols-2 sm:grid-cols-3
  □ Matches: scroll indicators
  □ Testar todos tamanhos
```

### Semana 2
```
□ Dia 1-2: Breakpoints (2h)
  □ FeedCard padding
  □ ItemCard buttons
  □ CreateItem inputs
  □ Testar responsividade
  
□ Dia 3: Suspense (1h)
  □ Layout boundary
  □ Route boundaries
  □ Testar loading states
  
□ Dia 4: Skeleton (1h)
  □ Tornar responsivo
  □ Adicionar shimmer
  □ Testar em todas resoluções
  
□ Dia 5: Testing (1h)
  □ DevTools mobile
  □ Lighthouse
  □ Keyboard nav
  □ Touch interactions
```

---

## 🎬 Como Executar

### 1. Setup Git
```bash
cd /Users/joubertgabriel/Documents/CodePlace/EscamboWebApp
git checkout -b feature/frontend-optimization
```

### 2. Dia 1-2: Images
```bash
# Converter arquivo por arquivo
# Formato: 
# 1. Abrir FeedCard.tsx
# 2. Adicionar import Image
# 3. Trocar <img> por <Image>
# 4. Testar npm run dev
```

### 3. Dia 3-4: Pages
```bash
# Criar novo arquivo
touch src/app/\(main\)/notifications/page.tsx
touch src/app/\(main\)/settings/page.tsx
touch src/app/\(main\)/help/page.tsx

# Copiar templates do documento de análise
# Testar em navegador
```

### 4. Dia 5: Grids
```bash
# Atualizar 2-3 arquivos com novo grid breakpoints
# Testar em diferentes resoluções
```

### 5. Semana 2
```bash
# Refactor incremental
# Testar após cada mudança
# npm run build verificar erros
```

### 6. Final
```bash
# Commit
git add .
git commit -m "refactor: frontend optimization and responsive design"
git push origin feature/frontend-optimization

# Pull Request para review
```

---

## 🔍 Validação

**Após cada dia, executar:**
```bash
npm run dev          # Testar localmente
npm run build        # Verificar erros de build
npm run lint         # Verificar code quality
```

**Lighthouse checklist:**
- [ ] Performance: 85+
- [ ] Accessibility: 90+
- [ ] Best Practices: 90+
- [ ] SEO: 95+

---

## 🚀 Deploy

```bash
# Após todo work concluído
npm run build
npm run start

# Verificar em staging antes de production
# Executar testes E2E
# Monitor performance em production
```

---

## 📞 Suporte

**Dúvidas sobre:**
- ❓ Image optimization → Check Next.js docs
- ❓ Responsive design → Check Tailwind docs
- ❓ Performance → Check Lighthouse report
- ❓ Bugs → Check console errors + DevTools

---

**Plano gerado:** 20/03/2026  
**Status:** 🔴 Pronto para iniciar  
**Duração estimada:** 10-12 horas  
**Score esperado ao final:** 9.0+/10
