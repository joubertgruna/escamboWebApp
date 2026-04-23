# 🚀 Deploy Rápido - Escambo

## Opções de Deploy

### 1️⃣ Deploy Web (5 minutos)

**Vercel (Grátis):**
```bash
# Dar permissão de execução
chmod +x deploy-web.sh

# Executar
./deploy-web.sh
```

**Ou manualmente:**
```bash
cd frontend-next
npm install -g vercel
vercel login
vercel --prod
```

### 2️⃣ Deploy Android (30 minutos)

**Método Simples - PWABuilder:**
1. Acesse: https://www.pwabuilder.com/
2. Digite: https://seu-app.vercel.app
3. Baixe o pacote Android
4. Upload no Google Play Console

**Método com Capacitor:**
```bash
# Dar permissão de execução
chmod +x build-android.sh

# Executar
cd frontend-next
../build-android.sh
```

### 3️⃣ Deploy iOS (1 hora - requer Mac)

```bash
# Dar permissão de execução
chmod +x build-ios.sh

# Executar (no Mac)
cd frontend-next
../build-ios.sh
```

## 📋 Checklist

Antes de fazer deploy, verifique:

- [ ] `.env.production` configurado
- [ ] Todas as APIs testadas
- [ ] Imagens otimizadas
- [ ] PWA validado (Lighthouse)
- [ ] CORS configurado no backend
- [ ] SSL/HTTPS ativo

## 🔗 Links Úteis

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Play Console**: https://play.google.com/console
- **Apple Developer**: https://developer.apple.com
- **PWABuilder**: https://www.pwabuilder.com/

## 📞 Suporte

Leia o guia completo: `DEPLOY_GUIDE.md`
