# 📱 Guia de Design Responsivo - Escambo

## Problema Resolvido

Os inputs e componentes estavam **estourando/desproporcionais** em telas pequenas por:

1. ❌ Padding fixo sem considerar tamanho de tela
2. ❌ Texto muito grande para mobile
3. ❌ Sem limite de largura máxima
4. ❌ Icons com espaço errado
5. ❌ Botões sem escalabilidade
6. ❌ Overflow horizontal

## ✅ Soluções Implementadas

### 1. **Componente Input**

```tsx
// ❌ ANTES
className="px-4 rounded-xl h-12"
icon && "pl-11"

// ✅ DEPOIS  
className="px-3 sm:px-4 rounded-lg sm:rounded-xl h-12 sm:h-13"
icon && "pl-9 sm:pl-11"
```

**Melhorias:**
- Padding responsivo: `px-3 sm:px-4` (16px → 20px)
- Altura escalonada: `h-12 sm:h-13`
- Ícone posicionado corretamente: `left-3 sm:left-3.5`
- `box-border` para não exceder o container
- Texto escalável: `text-sm sm:text-base`

### 2. **Página de Login**

```tsx
// ❌ ANTES
<div className="flex-1 flex flex-col px-6">

// ✅ DEPOIS
<div className="flex-1 flex flex-col px-4 sm:px-6 max-w-md mx-auto w-full">
```

**Melhorias:**
- Padding mobile: `px-4` (16px)
- Padding desktop: `sm:px-6` (24px)
- Max-width: `max-w-md` (limitado a 448px)
- Centralizado: `mx-auto`
- Largura: `w-full`

### 3. **Botões**

```tsx
// ❌ ANTES
sizes: "h-14 px-6 text-lg"

// ✅ DEPOIS
sizes: "lg: h-13 px-5 text-base sm:h-14 sm:px-6 sm:text-lg"
```

**Melhorias:**
- Mobile-first
- Escala até desktop
- Proporções consistentes

### 4. **Tipografia Responsiva**

```tsx
// ❌ ANTES
<h1 className="text-3xl font-bold">

// ✅ DEPOIS
<h1 className="text-2xl sm:text-3xl font-bold">
```

**Escalas:**
- H1: `text-2xl sm:text-3xl` (26px → 30px)
- P: `text-sm sm:text-base` (14px → 16px)
- Labels: `text-sm sm:text-base` (14px → 16px)

### 5. **Espaçamento Responsivo**

```tsx
// ❌ ANTES
className="space-y-4 p-6"

// ✅ DEPOIS
className="space-y-4 sm:space-y-5 px-4 sm:px-6 py-4 sm:py-6"
```

### 6. **Overflow Prevention**

```tsx
// ❌ ANTES (sem limites)
<div className="min-h-screen flex flex-col">

// ✅ DEPOIS (com controles)
<div className="min-h-screen flex flex-col w-full overflow-x-hidden">
```

---

## 🎯 Breakpoints Usados

| Breakpoint | Valor | Uso |
|-----------|-------|-----|
| `default` | 0px | Mobile (320px+) |
| `sm:` | 640px | Tablets e acima |
| `md:` | 768px | Tablets grandes |
| `lg:` | 1024px | Desktops |

## 📐 Espaçamento

| Tamanho | Mobile | Desktop |
|---------|--------|---------|
| Padding Lateral | 16px (px-4) | 24px (sm:px-6) |
| Espaço Entre Inputs | 16px (space-y-4) | 20px (sm:space-y-5) |
| Padding Vertical | 16px (py-4) | 24px (sm:py-6) |

## 🧩 Componentes Corrigidos

### ✅ Login Page (`src/app/login/page.tsx`)
- [x] Header responsivo
- [x] Inputs com padding correto
- [x] Botão eye/password com posicionamento fixo
- [x] Typography escalável
- [x] Footer responsivo

### ✅ Register Page (`src/app/register/page.tsx`)
- [x] Progress bar responsiva
- [x] Inputs com padding correto
- [x] Step indicators
- [x] Botões escalonados
- [x] Typography responsiva
- [x] Spacing consistente

### ✅ Input Component (`src/components/ui/Input.tsx`)
- [x] Padding responsivo (px-3 sm:px-4)
- [x] Altura escalável (h-12 sm:h-13)
- [x] Ícone posicionado corretamente
- [x] `box-border` aplicado
- [x] Texto responsivo
- [x] Helper text responsivo

### ✅ Button Component (`src/components/ui/Button.tsx`)
- [x] Tamanho lg responsivo (h-13 → h-14)
- [x] Padding responsivo (px-5 → px-6)
- [x] Texto responsivo (text-base → text-lg)

### ✅ Global CSS (`src/app/globals.css`)
- [x] Body overflow correto
- [x] Width constraints
- [x] Base styles responsivos

---

## 🔍 Checklist para Novos Componentes

Ao criar novos componentes, siga este checklist:

- [ ] Usar `px-4 sm:px-6` para padding horizontal
- [ ] Usar `py-4 sm:py-6` para padding vertical
- [ ] Usar `space-y-4 sm:space-y-5` para gap entre elementos
- [ ] Usar `text-sm sm:text-base` para tipografia padrão
- [ ] Adicionar `w-full` em containers
- [ ] Adicionar `overflow-x-hidden` em divs principais
- [ ] Usar `max-w-md mx-auto` para formulários
- [ ] Testar em mobile (320px), tablet (640px), desktop (1024px)

---

## 📱 Teste no Mobile

### Tamanhos de Teste
- iPhone SE: 375px
- iPhone 12/13: 390px
- iPhone 14 Pro: 393px
- Samsung Galaxy S21: 360px

### Teste Manual
```bash
# Chrome DevTools
1. Abra DevTools (F12)
2. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
3. Teste em iPhone 12 (390px)
4. Teste em iPad (768px)
5. Teste em Desktop (1920px)
```

### Checklist Visual
- [ ] Inputs não transbordam
- [ ] Texto é legível (16px mín)
- [ ] Botões têm tamanho adequado (h≥44px)
- [ ] Padding não é muito grande nem pequeno
- [ ] Sem scroll horizontal
- [ ] Icones estão alinhados
- [ ] Status bar não sobrepõe conteúdo

---

## 🎨 Padrões de Design Mantidos

### Apple Design System
- ✅ Rounded corners: `rounded-lg sm:rounded-xl`
- ✅ Spacing: Proporções 4-8-12-16-24
- ✅ Shadows: Sutis e consistentes
- ✅ Animations: Framer Motion suave

### Tailwind Utilities
- ✅ Mobile-first: padrão é mobile, depois `sm:`
- ✅ Responsive: sempre considerar múltiplos breakpoints
- ✅ Semantic: usar nomes claros das classes

---

## 🚀 Próximos Passos

### Componentes a Revisar
1. Feed page
2. Item detail page
3. Chat page
4. Profile page
5. Navbar/Header
6. Cards
7. Modals

### Padrão a Seguir
```tsx
// Template responsivo completo
<div className="min-h-screen bg-surface flex flex-col w-full overflow-x-hidden">
  {/* Header */}
  <div className="px-4 sm:px-6 py-4 sm:py-6">
    {/* Conteúdo */}
  </div>
  
  {/* Main */}
  <div className="flex-1 px-4 sm:px-6 max-w-2xl mx-auto w-full">
    {/* Conteúdo principal */}
  </div>
  
  {/* Footer */}
  <div className="px-4 sm:px-6 py-4 sm:py-6 border-t">
    {/* Ações */}
  </div>
</div>
```

---

**Data:** 18 de Março de 2026
**Versão:** 1.0
**Responsável:** Gabriel Joubert
