# 🤖 AI-toxique — WhatsApp Toxic AI Bot

Un bot WhatsApp connecté avec IA (Gemini ou OpenAI), personnalité **toxique de Discord**, réponse avec **stickers**, mémoire PostgreSQL illimitée et commandes d'activation/désactivation contrôlées par le propriétaire.

---

[![🪄 Fork le projet](https://img.shields.io/badge/Fork_sur_GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/hamoudi96/AI-toxique/fork)
[![🔗 Site de pairing WhatsApp](https://img.shields.io/badge/Site_de_Pairing-00bfa6?style=for-the-badge&logo=whatsapp&logoColor=white)](https://natural-lyda-none98-fe8adbc8.koyeb.app/)
[![🚀 Déployer sur Koyeb](https://img.shields.io/badge/D%C3%A9ployer_sur_Koyeb-1d4ed8?style=for-the-badge&logo=koyeb&logoColor=white)](https://app.koyeb.com/)
[![🚀 Déployer sur Render](https://img.shields.io/badge/D%C3%A9ployer_sur_Render-6f42c1?style=for-the-badge&logo=render&logoColor=white)](https://render.com/)

---

## 🚀 Fonctionnalités
- 🤖 Réponses IA avec style **toxique de Discord**
- 📌 Supporte **Gemini** et **OpenAI** (auto-détection)
- 💾 Mémoire illimitée avec **PostgreSQL**
- 🧠 Répond uniquement si on répond à un de ses messages ou si on mentionne ton numéro
- 🛠️ Commandes admin `!ai on`, `!ai off` (seulement pour toi)
- 🎭 Répond avec un message + **sticker aléatoire**
- 🧩 Préfixe configurable (ex: `!`)
- 📦 Déployable sur **Koyeb**, **Render**, **Railway**, etc.

---

## 🧩 Variables d'environnement (`.env`)

```env
SESSION_ID=TON_SESSION_ID
OWNER_NUMBER=+22395064497
OPENAI_API_KEY=ta_clé_openai
GEMINI_API_KEY=ta_clé_gemini
DATABASE_URL=ton_url_postgresql
STICKER_URLS=url1,url2,url3,...
BOT_PREFIX=!
