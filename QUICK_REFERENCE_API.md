# 🔧 Quick Reference - API Response Handling

## ⚡ Padrão Rápido

### ❌ ERRADO
```typescript
// ❌ Nunca faça isso
const data = await itemService.getById(id);
console.log(data.title); // TypeError!
```

### ✅ CORRETO
```typescript
// ✅ Sempre faça assim
const response = await itemService.getById(id);
const item = response.data;
console.log(item.title); // ✓
```

---

## 📋 Propriedades Corretas por Tipo

### Item
```typescript
const response = await itemService.getById(id);
const item = response.data;

item.title              // ✓
item.description        // ✓
item.category           // ✓
item.condition          // ✓
item.trade_for          // ✓ (NÃO: desired_items)
item.photos             // ✓
item.user               // ✓
```

### Match
```typescript
const response = await matchService.getById(id);
const match = response.data;

match.user1_id          // ✓ (NÃO: user1)
match.user2_id          // ✓ (NÃO: user2)
match.my_item           // ✓ (NÃO: item1)
match.other_item        // ✓ (NÃO: item2)
match.other_user        // ✓ (NÃO: user1 ou user2)
match.status            // ✓
match.last_message      // ✓
match.unread_count      // ✓
```

### Message
```typescript
const response = await matchService.getMessages(id);
const messages = response.data;

messages[0].id          // ✓
messages[0].content     // ✓
messages[0].created_at  // ✓
messages[0].read_at     // ✓ (NÃO: read)
messages[0].user_id     // ✓
```

---

## 🎨 Componentes Props

### Avatar - Props Corretas
```typescript
// ✅ Correto
<Avatar src={url} size="lg" />

// ❌ Errado (remove prop 'name')
<Avatar src={url} name={name} size="lg" /> // ERROR!
```

### Header - Props Corretas
```typescript
// ✅ Correto
<Header title="Title" rightContent={element} />

// ❌ Errado (muda 'rightAction' para 'rightContent')
<Header title="Title" rightAction={element} /> // ERROR!
```

---

## 🔄 Padrão de Listagem

### ❌ Errado
```typescript
const items = await itemService.getAll();
items.forEach(item => {
  console.log(item.title); // TypeError!
});
```

### ✅ Correto
```typescript
const response = await itemService.getAll();
const items = response.data;
items.forEach(item => {
  console.log(item.title); // ✓
});
```

---

## 📝 Padrão de Formulário

### ❌ Errado
```typescript
// NÃO use object literal para upload
const data = {
  title: formData.title,
  description: formData.description,
  photos: files
};
await itemService.create(data); // ERRO!
```

### ✅ Correto
```typescript
// USE FormData para upload
const form = new FormData();
form.append("title", formData.title);
form.append("description", formData.description);
files.forEach(file => form.append("photos", file));
const response = await itemService.create(form);
const item = response.data;
```

---

## 🛡️ Null Safety

### ❌ Errado
```typescript
if (!formData.title.trim()) {
  // TypeError se title for undefined!
}
```

### ✅ Correto
```typescript
if (!formData.title || !formData.title.trim()) {
  // Seguro!
}
```

---

## 📍 Checklist de Correção

Quando receber erro similar:

- [ ] Verificar se está extraindo `.data` da resposta
- [ ] Validar que propriedade não é `undefined` antes de usar
- [ ] Conferir nomes de propriedade vs tipos em `/types`
- [ ] Remover props inválidas de componentes
- [ ] Testar compilação: `npm run build`
- [ ] Validar no navegador

---

## 🚀 Atalhos de Busca

### Procurar por erros similares:
```bash
# Buscar por "await service" sem ".data"
grep -r "await.*Service\." src/ | grep -v "response.data"

# Buscar por propriedades incorretas
grep -r "desired_items" src/
grep -r "match\.user1" src/
grep -r "\.read[^_]" src/
```

---

## 📞 Se Encontrar Um Erro Similar

1. **Localize a linha do erro**
   ```
   TypeError: Cannot read property 'X' of undefined
   Location: file.tsx:123
   ```

2. **Identifique o padrão**
   - É chamada de serviço? → Extrair `.data`
   - É acesso a propriedade? → Conferir nome vs tipos
   - É prop de componente? → Validar prop names

3. **Aplique a correção**
   ```typescript
   // Padrão geral
   const response = await service.method();
   const data = response.data;
   // Use data com segurança
   ```

4. **Valide a correção**
   ```bash
   npm run build  # Deve passar
   curl http://localhost:5174/page  # Deve carregar
   ```

---

**Última atualização**: Session Final  
**Status**: ✅ Todos os erros corrigidos  
**Build**: ✅ Zero erros TypeScript
