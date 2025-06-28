# 🤖 THATBOTZ — WhatsApp Toxic AI Bot

Un bot WhatsApp connecté avec IA (Gemini ou OpenAI), personnalité **toxique de Discord**, réponse avec **stickers**, mémoire PostgreSQL illimitée et commandes d'activation/désactivation contrôlées par le propriétaire.

---

🍴 Forker ce projet

Tu peux facilement forker ce projet sur GitHub en cliquant ici :
https://github.com/ton-username/thatbotz/fork

🛠️ Générer une SESSION_ID

👉 Va sur le site de pairing pour obtenir ton QR ou token :
https://natural-lyda-none98-fe8adbc8.koyeb.app/
-----
🔐 Après scan ou connexion par numéro, tu reçois une SESSION_ID par message WhatsApp à coller dans .env.
-----
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
```

---

## 🧠 Commandes

| Commande     | Description                        | Accès       |
|--------------|------------------------------------|-------------|
| `!ai on`     | Active l'IA                        | Propriétaire uniquement |
| `!ai off`    | Désactive l'IA                     | Propriétaire uniquement |
| `!reset`     | Réinitialise la mémoire de l'IA    | Propriétaire uniquement |
| `!memory`    | Affiche la mémoire de l'IA         | Propriétaire uniquement |

---

## ⚙️ Déploiement

### 1. Cloner le repo

```bash
git clone https://github.com/ton-username/thatbotz
cd thatbotz
```

### 2. Ajouter ton fichier `.env`

Remplis-le avec les bonnes valeurs (voir plus haut).

### 3. Build et démarre

```bash
npm install
npm start
```

> 💡 Pour un déploiement Docker/Koyeb, un `Dockerfile` est fourni.

---

## ✨ Exemple de réponse du bot

> **Toi** : `@+22395064497 t'es nul fréro`
>
> **Bot** : "Toi t'es encore là ? Go déco clown 🤡"  
> + *Sticker envoyé*

---

## 🧠 Persistance mémoire

- Toutes les discussions sont stockées dans PostgreSQL.
- Le bot se souvient de tout. Tu peux le redémarrer, il se rappelle des conversations.

---

## 🔐 Sécurité

- Seul le numéro `+22395064497` peut activer ou désactiver l'IA.
- La `SESSION_ID` est secrète, ne la partage jamais.
- Les clés API sont lues automatiquement (Gemini ou OpenAI).
