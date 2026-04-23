# ⚡ TESTES 1 e 2 - EXECUÇÃO RÁPIDA

**Status:** 🔴 EM PROGRESSO  
**Hora de Início:** 06/03/2025 ~  
**Objetivo:** Validar Toast + Som de Notificação

---

## 🚀 PASSO 1: Preparar Abas do Navegador

### Aba 1 (João)
```
URL: http://localhost:5173/login
Login: joao@example.com / password123
Objetivo: Entrar como João e ir para chat
```

### Aba 2 (Maria)
```
URL: http://localhost:5173/login
Login: maria@example.com / password123
Objetivo: Entrar como Maria e ir para chat
```

---

## 🎯 TESTE 1: Toast Notification

### Checklist de Execução

- [ ] **Passo 1:** Abrir http://localhost:5173 em 2 abas separadas
  
- [ ] **Passo 2:** Aba 1 - Fazer login como João
  ```
  Email: joao@example.com
  Senha: password123
  Clique: Login
  Aguarde carregar dashboard
  ```

- [ ] **Passo 3:** Aba 2 - Fazer login como Maria
  ```
  Email: maria@example.com
  Senha: password123
  Clique: Login
  Aguarde carregar dashboard
  ```

- [ ] **Passo 4:** Aba 1 (João) - Abrir chat
  ```
  Clique em "Matches" no menu
  Procure por "Maria Santos"
  Clique para abrir chat
  Aguarde carregar histórico
  ```

- [ ] **Passo 5:** Aba 2 (Maria) - Enviar mensagem
  ```
  Clique em "Matches" no menu
  Procure por "João Silva"
  Clique para abrir chat
  
  No input, escreva: "Olá João, tudo bem?"
  Clique em "Enviar" ou tecle Enter
  ```

- [ ] **VALIDAÇÃO - Aba 1 (João):**
  ```
  ✅ Pop-up aparece no canto INFERIOR DIREITO
  ✅ Contém: "Maria Santos: Olá João..."
  ✅ Desaparece após 3-5 segundos
  ✅ OU desaparece ao clicar
  
  Descrição esperada:
  ┌──────────────────────────────┐
  │  💬 Mensagem recebida        │
  │  Maria Santos: Olá João...   │
  └──────────────────────────────┘
  ```

---

## 🔊 TESTE 2: Som de Notificação

### Preparação
```
✅ Som do navegador ativado
✅ Volume do computador ligado (não mudo)
✅ Usar fones ou speakers
✅ Mesma setup do Teste 1 ainda ativa
```

### Checklist de Execução

- [ ] **Passo 1:** Manter setup do Teste 1
  ```
  Aba 1 (João): Chat aberto
  Aba 2 (Maria): Chat aberto
  Ambos no mesmo chat
  ```

- [ ] **Passo 2:** Aba 2 (Maria) - Enviar próxima mensagem
  ```
  No input, escreva: "Como vai o trabalho?"
  Clique em Enviar
  ```

- [ ] **VALIDAÇÃO - Aba 1 (João):**
  ```
  🔊 OUVIR: "ding-ding" (dois tons altos)
     Frequência 1: 800Hz (tom mais baixo)
     Frequência 2: 1000Hz (tom mais alto)
     Duração: ~150ms total
     Som toca SIMULTANEAMENTE com toast
  
  ✅ Som é discreto (não desconfortável)
  ✅ Som é diferente do alert padrão
  ✅ Consegue ouvir claramente
  ```

- [ ] **Passo 3:** Aba 2 (Maria) - Enviar mais uma mensagem
  ```
  No input, escreva: "Responde aqui!"
  Clique em Enviar
  ```

- [ ] **VALIDAÇÃO:**
  ```
  ✅ Som toca novamente
  ✅ Consistente com primeiro som
  ✅ Toast aparece junto
  ✅ Mensagem aparece no chat
  ```

---

## 📊 Resultados

### Teste 1 - Toast Notification
```
Status: [ ] ❌ Falhou | [ ] ✅ Passou

Detalhes:
- Toast apareceu? _______________
- Contém nome do remetente? _______________
- Desapareceu após tempo? _______________
```

### Teste 2 - Som
```
Status: [ ] ❌ Falhou | [ ] ✅ Passou

Detalhes:
- Som foi ouvido? _______________
- Som é discreto? _______________
- Som toca com toast? _______________
```

---

## 🆘 Se Algo Não Funcionar

### Toast não aparece
```
1. Abra DevTools (F12)
2. Vá para Console
3. Procure por erros em vermelho
4. Recarregue a página (Ctrl+R)
5. Tente novamente
```

### Som não funciona
```
1. Verifique volume do navegador (🔊)
2. Verifique volume do computador
3. Tente usar fones ao invés de speakers
4. Abra DevTools (F12) → Console
5. Procure por: "Audio context error"
```

### Mensagem não chega
```
1. Verifique se backend está rodando
   curl http://localhost:3000/api/health
   
2. Abra DevTools (F12) → Network
3. Procure por request para /api/messages
4. Veja o status (deve ser 200 ou 201)
```

---

## 📝 Notas

- Ambos os testes usam o mesmo setup
- Toast e Som acontecem AO MESMO TEMPO
- Leva <1 segundo para notificação aparecer
- Se erro, verifique console do navegador

---

## ✅ Próximos Passos

Se ambos os testes passarem:
- [ ] Você pode proceder para Teste 3 (Push Notification)
- [ ] Ou testar Teste 4 (Aba Inativa)

Se algum falhar:
- [ ] Verifique troubleshooting acima
- [ ] Verifique console do navegador
- [ ] Tente recarregar ambas as abas
