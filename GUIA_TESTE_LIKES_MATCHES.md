# 🧪 GUIA DE TESTE - LIKES E MATCHES

**Objetivo:** Validar que as correções funcionam perfeitamente  
**Tempo Estimado:** 10-15 minutos  
**Dificuldade:** Fácil ✅

---

## 📋 Pré-requisitos

✅ Backend rodando: http://localhost:3000  
✅ Frontend rodando: http://localhost:5173  
✅ MySQL conectado  
✅ Usuários de teste criados

**Usuários Disponíveis:**
- João Silva: `joao@example.com` / `password123`
- Maria Santos: `maria@example.com` / `password123`
- Pedro Oliveira: `pedro.oliveira@example.com` / `password123`

---

## 🎯 Teste 1: Página de Likes

### Objetivo
Validar que a página `/likes` mostra:
- ✅ Nome do usuário que curtiu
- ✅ Avatar do usuário (se disponível)
- ✅ Imagem do item curtido
- ✅ Localização do usuário (cidade/estado)

### Passos

#### 1️⃣ Criar um item (João)
```
1. Acesse: http://localhost:5173
2. Login: joao@example.com / password123
3. Clique no menu e vá para "Meus Itens" ou "Criar Item"
4. Preencha:
   - Título: "Bicicleta Mountain Bike"
   - Descrição: "Bicicleta em ótimo estado"
   - Categoria: "Esportes"
5. Clique em "Criar Item"
6. Upload uma foto (qualquer imagem)
```

#### 2️⃣ Curtir o item (Maria)
```
1. Sair (logout) - clique em seu perfil > Sair
2. Login como Maria: maria@example.com / password123
3. Acesse o feed ou procure pelo item de João
4. Clique em "❤️ Curtir" no item da bicicleta
5. Veja a confirmação de curtida
```

#### 3️⃣ Ver a curtida (João)
```
1. Sair (logout)
2. Login como João: joao@example.com / password123
3. Acesse: http://localhost:5173/likes (ou clique no menu "Curtidas")
4. Verifique que aparece:
   ✅ Nome: "Maria Santos"
   ✅ Avatar: (imagem do avatar se houver)
   ✅ Foto do item: (miniatura da bicicleta)
   ✅ Localização: "Rio de Janeiro, RJ" (ou localização de Maria)
   ✅ Botão "Ver": clique para ir ao detalhe do item
```

#### 4️⃣ Validação ✅
- [ ] Nome "Maria Santos" aparece
- [ ] Foto do item aparece e carrega
- [ ] Localização aparece
- [ ] Botão "Ver" funciona

---

## 🎯 Teste 2: Página de Matches

### Objetivo
Validar que a página `/matches/{id}` mostra:
- ✅ Imagens dos items
- ✅ Nomes dos items
- ✅ Nomes dos usuários
- ✅ Botões funcionando

### Passos

#### 1️⃣ Criar Match (Curtida Mútua)
```
1. Login como João: joao@example.com / password123
2. Vá para o feed
3. Procure um item de Maria
4. Clique em "❤️ Curtir"
5. Agora ambos curtiram um do outro
   → Deve aparecer um MATCH automático! 🎉
```

#### 2️⃣ Acessar página de Matches
```
1. Com João logado
2. Acesse: http://localhost:5173/matches
3. Você verá uma lista de matches
4. Clique em um dos matches
```

#### 3️⃣ Ver Detalhes do Match
```
Você deve ver:
┌────────────────────────────────────────┐
│  Item de João         │  Item de Maria  │
│  ┌──────────────┐     │  ┌──────────┐   │
│  │              │     │  │          │   │
│  │  Foto do     │     │  │  Foto    │   │
│  │  Item 1      │     │  │  Item 2  │   │
│  │              │     │  │          │   │
│  └──────────────┘     │  └──────────┘   │
│  "Bicicleta"          │  "Skate"        │
│  João Silva           │  Maria Santos   │
├────────────────────────────────────────┤
│ [💬 Conversar]  [← Voltar]             │
└────────────────────────────────────────┘

Validar:
✅ Imagem do item 1 aparece
✅ Imagem do item 2 aparece
✅ Nomes dos items aparecem
✅ Nomes dos usuários aparecem
✅ Botões funcionam
```

#### 4️⃣ Testar Botões
```
[💬 Conversar]: Deve abrir o chat com Maria
[← Voltar]: Deve voltar para a lista de matches
```

#### 5️⃣ Validação ✅
- [ ] Imagem Item 1 carrega perfeitamente
- [ ] Imagem Item 2 carrega perfeitamente
- [ ] Nome Item 1 aparece
- [ ] Nome Item 2 aparece
- [ ] Nomes dos usuários aparecem
- [ ] Botão "Conversar" funciona
- [ ] Botão "Voltar" funciona

---

## 🔍 Verificação de Console

Abra o DevTools do navegador (F12) para verificar se não há erros:

```
Console (F12 → Console):
✅ Sem erros vermelhos
✅ Sem warnings sobre "undefined photo"
✅ Sem erros de "Cannot read property"
```

---

## 📊 Casos de Teste

### Caso 1: Likes sem fotos
```
Se um item não tiver foto:
✅ Deve mostrar imagem padrão/placeholder
✅ Não deve quebrar a página
```

### Caso 2: Usuário sem avatar
```
Se um usuário não tiver avatar:
✅ Deve mostrar avatar padrão
✅ Não deve quebrar o layout
```

### Caso 3: Usuário sem localização
```
Se um usuário não tem cidade/estado:
✅ Deve deixar em branco ou N/A
✅ Não deve quebrar
```

---

## 🐛 Se Algo Não Funcionar

### Erro 1: Imagens não carregam
```
Solução:
1. Verifique se backend está rodando: http://localhost:3000/api/health
2. Verifique se as fotos foram salvas em /backend/uploads/
3. Verifique o console (F12) para erros de rede
```

### Erro 2: Dados vazios em /likes
```
Solução:
1. Certifique-se de que alguém curtiu um item seu
2. Verifique em: http://localhost:3000/api/likes/received
3. Use um token válido na header Authorization
```

### Erro 3: Matches não aparecem
```
Solução:
1. Certifique-se que houve curtida mútua
2. Verifique em: http://localhost:3000/api/matches
3. Recarregue a página (Ctrl+R ou Cmd+R)
```

---

## ✅ Checklist Final

### Backend
- [ ] Health check OK: http://localhost:3000/api/health
- [ ] Likes API responde: http://localhost:3000/api/likes/received
- [ ] Matches API responde: http://localhost:3000/api/matches

### Frontend - Likes
- [ ] Página carrega: http://localhost:5173/likes
- [ ] Nome do usuário aparece
- [ ] Foto do item aparece
- [ ] Localização aparece
- [ ] Botão "Ver" funciona

### Frontend - Matches
- [ ] Página carrega: http://localhost:5173/matches
- [ ] Lista de matches aparece
- [ ] Clique abre detalhe
- [ ] Imagens carregam
- [ ] Dados aparecem corretamente
- [ ] Botões funcionam

---

## 🎉 Sucesso!

Se todos os itens acima estão marcados, os bugs foram **100% resolvidos**!

Aproveite a aplicação! 🚀
