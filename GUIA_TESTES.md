# 🧪 Guia Rápido de Testes - Escambo App

## ✅ Setup Inicial

A aplicação está rodando em:
- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3000
- **Database**: MySQL em localhost:3306

---

## 🎯 Fluxo de Testes Recomendado

### 1. **Página Home / Landing**
- [ ] Página carrega sem erros
- [ ] Layout responsivo (testar mobile)
- [ ] Botão "Começar" leva para login/register
- [ ] Verificar cores e design

### 2. **Autenticação**

#### 2.1 Página de Login
```
- [ ] Formulário carrega
- [ ] Email validado
- [ ] Senha validada
- [ ] Botão "Entrar" funciona
- [ ] Erro exibido se credenciais erradas
- [ ] Botão "Criar Conta" navega para registro
```

#### 2.2 Página de Registro
```
- [ ] Formulário carrega
- [ ] Nome obrigatório
- [ ] Email validado
- [ ] Senha com força mínima
- [ ] Confirmação de senha
- [ ] Botão "Registrar" funciona
- [ ] Após sucesso, redireciona para Home
```

#### 2.3 Persistência
```
- [ ] Token salvo no localStorage
- [ ] Reload da página mantém login
- [ ] Logout limpa token
- [ ] Login novamente funciona
```

### 3. **Perfil do Usuário**

#### 3.1 Página Profile
```
- [ ] Dados do usuário exibem
- [ ] Avatar/foto carrega
- [ ] Estatísticas exibem (likes, matches, items)
- [ ] Botão editar funciona
- [ ] Logout funciona
```

### 4. **Gerenciamento de Itens**

#### 4.1 Página Browse
```
- [ ] Lista de itens carrega
- [ ] 2 itens mock aparecem
- [ ] Grid layout responsivo
- [ ] Clicar no item abre detalhe
- [ ] Botão curtir funciona
```

#### 4.2 Página Item Detail
```
- [ ] Dados do item carregam
- [ ] Carrossel de fotos funciona
- [ ] Informações exibem corretamente
- [ ] Botão curtir
- [ ] Botão propor troca
- [ ] Voltar funciona
```

#### 4.3 Página Meus Itens
```
- [ ] 2 itens mock carregam
- [ ] Botão "+ Novo Item" funciona
- [ ] Botão editar abre form
- [ ] Botão deletar remove item
- [ ] Confirmação antes de deletar
```

#### 4.4 Criar/Editar Item
```
- [ ] Formulário carrega
- [ ] Validações funcionam
- [ ] Upload de foto (mock)
- [ ] Categoria selecionável
- [ ] Condição selecionável
- [ ] Descrição editável
- [ ] Salvar cria/atualiza item
- [ ] Cancelar volta
```

### 5. **Matches**

#### 5.1 Página Matches
```
- [ ] 1 match mock carrega
- [ ] Status exibe (pending/accepted)
- [ ] Avatar do outro usuário
- [ ] Botão chatear navega
- [ ] Botão aceitar/rejeitar funciona
```

### 6. **Chat**

#### 6.1 Página Chat
```
- [ ] Mensagens carregam (1 mock)
- [ ] Histórico exibe
- [ ] Input de mensagem funciona
- [ ] Enviar mensagem (Ctrl+Enter ou botão)
- [ ] Nova mensagem aparece
- [ ] Scroll automático para última
- [ ] Timestamps exibem
```

### 7. **Erros e Edge Cases**

#### 7.1 Validações
```
- [ ] Campo email vazio = erro
- [ ] Email inválido = erro
- [ ] Senha curta = erro
- [ ] Formulário muda cor ao enviar
```

#### 7.2 Network
```
- [ ] Desligar backend = erro visível
- [ ] Reconectar funciona
- [ ] Loading states exibem
- [ ] Retry buttons funcionam
```

#### 7.3 Responsividade
```
- [ ] Mobile (320px) - layout ok
- [ ] Tablet (768px) - layout ok
- [ ] Desktop (1024px) - layout ok
- [ ] Touch inputs funcionam em mobile
```

---

## 🔍 Verificações Técnicas

### Console do Navegador (F12)
```
- [ ] Sem erros vermelhos
- [ ] Sem warnings importantes
- [ ] Network tab - requests succeeding
- [ ] Performance - load time < 2s
```

### API Endpoints
```
✅ GET  /api/health              - Status: 200
✅ POST /api/auth/login          - Status: 200
✅ GET  /api/items/mine          - Status: 200 (returns 2 items)
✅ GET  /api/items/:id           - Status: 200
✅ GET  /api/matches             - Status: 200 (returns 1 match)
✅ GET  /api/messages/:matchId   - Status: 200
```

### Armazenamento Local
```
localStorage:
- [ ] token armazenado após login
- [ ] token removido após logout

sessionStorage:
- [ ] Verificar se usado corretamente
```

---

## 📱 Testes Mobile

Use o DevTools do navegador (F12 → Toggle device toolbar)

```
- [ ] iPhone 12 Pro (390px)
- [ ] iPhone SE (375px)
- [ ] iPad (768px)
- [ ] Samsung Galaxy S21 (360px)
```

Verificações:
- [ ] Texto legível
- [ ] Botões clicáveis
- [ ] Imagens carregam
- [ ] Não há scroll horizontal
- [ ] Inputs recebem focus
- [ ] Teclado não quebra layout

---

## 🚀 Performance

```bash
# Testar velocidade da API
curl -w "Time: %{time_total}s\n" http://localhost:3000/api/items/mine

# Testar tamanho do bundle
cd frontend-next && npm run build
```

---

## 📊 Checklist Final

- [ ] Home page carrega
- [ ] Login funciona
- [ ] Itens carregam
- [ ] Matches exibem
- [ ] Chat funciona
- [ ] Logout funciona
- [ ] Sem erros console
- [ ] Responsivo em mobile

**Se todos checkmarks estão ✅, a aplicação está pronta para features!**

---

## 🐛 Bugs Encontrados

Quando encontrar um bug, documente assim:

```
### Bug #001: [Título]
- **Descrição**: O que não funciona
- **Passos para reproduzir**: 
  1. ...
  2. ...
- **Resultado esperado**: ...
- **Resultado atual**: ...
- **Severity**: Critical/High/Medium/Low
- **Solução**: (preenchido depois)
```

---

**Última atualização**: 17/03/2026 18:35
