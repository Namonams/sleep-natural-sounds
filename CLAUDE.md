# Sleep Natural Sounds — CLAUDE.md
# Le 2nd Cerveau du Projet | Mise à jour: 2026-06-02

## 📺 ÉTAT CHAÎNE — MIS À JOUR CHAQUE SESSION
| Vidéo | ID YouTube | Statut | Date |
|-------|-----------|--------|------|
| Pink Noise for Babies 11h | `10KZSY5Y-MM` | **PUBLIC** — publié 2026-06-02 07:00 | 2026-06-02 |
| Ancient Campfire 11h | `i3OvPXCjI4A` | Uploadé 2026-06-08 · Schedulé **mardi 09/06 07:00** | 2026-06-08 |
| White Noise (silencieuse) | `PW4yXKyGFL4` | **À SUPPRIMER** | 2026-05-19 |

**⚠️ RÈGLE MAJ DASHBOARD**: Mettre à jour ce tableau ET `dashboard/index.html` (statut vidéo) à chaque session ET toutes les 3 échanges si changement de statut YT.

---

## 🌙 Vision & Mission

**Canal**: Sleep Natural Sounds (`sleepnaturalsounds@gmail.com`)
**Concept**: Chaîne YouTube de sons ambiants 10-11h — zéro pub, qualité maximale, croissance organique.
**Cadence**: 1 vidéo/semaine, publication mardi 07:00 Paris (règle fixe — jamais lundi).
**Durée standard**: **11h exactement** pour TOUTES les vidéos — aucune exception.
**Horizon monétisation**: 6-12 mois (1000 abonnés + 4000h watch time).
**Philosophie**: **Ihsan** — chaque vidéo produite avec excellence et éthique. Pas de raccourci.

---

## 🤝 Protocole Khalwa & co — Chaque session = toute la Team

**Architecture miroir NamoBraso Maestro SEO — adapté YouTube/Vidéo.**

```
KHALWA (Maestro / Orchestrateur)
    ├── Agent Vidéaste     → Pipeline FFmpeg, production 10-11h
    ├── Agent Graphiste    → Canva MCP, thumbnails, visuels
    ├── Agent Copywriter   → Titres, descriptions, SEO, blog
    ├── Agent Analyste     → YouTube analytics, veille, métriques
    ├── Agent Publisher    → Upload API, Studio, métadonnées
    └── Agent Dev          → Scripts, dashboard, site web
```

### Protocole d'exécution chaque session:
1. **Khalwa lit ce CLAUDE.md** → identifie état du projet
2. **Ouvrir dashboard** (deux options):
   - Local: `Start-Process "http://localhost:3000"` (relancer `node dashboard/server.js` si besoin)
   - Cloud H24: `Start-Process "https://namonams.github.io/sleep-natural-sounds"` ← accessible ordi éteint
3. **Chaque agent scanne son domaine** → signale ce qui est bloquant ou à améliorer
4. **Critique collective** sur chaque livrable avant validation
5. **Décision finale** = Khalwa + confirmation utilisateur
6. **Filtre Ihsan** → aucune action sans qualité maximale

### Mise à jour dashboard obligatoire:
- **Début de session**: ouvrir dashboard + sync état réel
- **Toutes les 3 échanges**: si statut vidéo change → update `dashboard/index.html` SEED + `CLAUDE.md` tableau chaîne
- **Chaque step pipeline**: log dans dashboard (encode → upload → public)
- **Format step**: `[HH:MM] ÉTAPE — résultat — prochain`

---

## ⚠️ PROTOCOLE MULTI-AGENT OBLIGATOIRE — CHAQUE TÂCHE

**RÈGLE ABSOLUE**: Avant d'exécuter N'IMPORTE QUELLE tâche, les 5 agents examinent en parallèle et donnent leur feu vert ou bloquant. Zéro exécution sans ce passage.

### Format obligatoire avant chaque action:

```
🌙 KHALWA     → Objectif clair? Risques? Rollback possible?
🎬 VIDÉASTE   → Sources vérifiées (ffprobe)? Taille estimée? Durée estimée? Test 10s d'abord?
📝 CONTENU    → Métadonnées prêtes? Titre/description/tags validés?
🎨 VISUEL     → Thumbnail prête et cohérente avec le contenu?
📊 ANALYTICS  → Bonne niche? Timing correct? Concurrent check?
```

**Chaque agent répond:**
- ✅ GO — avec les chiffres réels (pas d'estimation inventée)
- ⚠️ ATTENTION — problème détecté, voici la solution
- 🚫 STOP — bloquant, ne pas continuer sans correction

**Exemples de ce qui DOIT être détecté avant d'exécuter:**

| Erreur passée | Agent qui devait catcher | Check obligatoire |
|---------------|--------------------------|-------------------|
| Loudnorm sur 11h → crash | 🎬 Vidéaste | Test loudnorm sur 10s source d'abord |
| Source 3 Mbps/60fps → encode 7h | 🎬 Vidéaste | `ffprobe` bitrate+fps AVANT pipeline |
| Upload 15 GB → ECONNRESET | 🎬 Vidéaste | Estimer taille output avant encode |
| ETA inventé | 🌙 Khalwa | Chiffres réels uniquement ou "inconnu" |
| Kill encode sans confirm | 🌙 Khalwa | Jamais tuer process sans GO explicite |
| Vidéo silencieuse uploadée | 🎬 Vidéaste | Test audio 10s avant toute action suivante |

### Règles Khalwa:
- Ne jamais uploader public sans vérifier audio + monétisation
- Vérifier disk space avant tout pipeline (`Get-PSDrive C`)
- Consolider avant de reporter — pas de résultats bruts
- Signaler les bloquants (ex: son non vérifié → action humaine requise)
- **RÈGLE TERMINALE**: Toute commande terminal = exécutée directement par la Team. Exception unique: OAuth2 browser.
- **RÈGLE PROCESS**: Jamais tuer/relancer un process actif sans GO explicite de l'utilisateur.
- **RÈGLE CHIFFRES**: Jamais donner une estimation sans la baser sur des données réelles (ffprobe, taille fichier, vitesse mesurée).

---

## 🚀 PIPELINE STANDARD — SOURCE → VIDÉO PUBLIQUE (~30 min)

**Principe**: encoder correctement UNE SEULE FOIS pendant le pipeline. Zéro re-encode après.

### Étape 0 — Preflight (AGENT VIDÉASTE — obligatoire)
```powershell
ffprobe source_video.mp4  # → bitrate, fps, durée, résolution
ffprobe source_audio.mp3  # → durée, volume moyen
(Get-PSDrive C).Free/1GB  # → disk libre > 20 GB ?
```
Règles de décision:
- Bitrate vidéo > 1.5 Mbps OU fps > 30 → encode `-crf 28 -preset fast -r 24`
- Bitrate vidéo ≤ 1.5 Mbps ET fps ≤ 30 → `-c:v copy` (rapide)
- Volume audio < -30 dB → loudnorm sur source courte d'abord, puis loop copy
- Taille estimée output = `(bitrate_cible × durée_sec) / 8` → afficher AVANT de lancer

### Étape 1 — Pipeline FFmpeg (~10-15 min)
```
full_pipeline.ps1 -VideoFile ... -AudioFile ... -OutputName ... -Hours 11
→ Output YT-ready: ~2-4 GB, 1280x720, 24fps, audio -14 LUFS
```

### Étape 2 — Team en parallèle pendant pipeline (~5 min)
```
AGENT CONTENU  → titre, description, tags dans content/[slug].md
AGENT VISUEL   → thumbnail Canva MCP → export PNG → assets/thumbnails/
```

### Étape 3 — Upload API (~5 min à 30 MB/s)
```
node scripts/upload_youtube.js
→ Upload + thumbnail auto
→ Vidéo = Non répertoriée
```

### Étape 4 — Toi (5 min)
```
1. Écouter 10s début + milieu + fin → audio OK?
2. Studio → Revenus → activer monétisation
3. Vérifier thumbnail + titre
4. Programmer ou passer en Public
```

### Étape 5 — Programmation publication (Team via API)
```javascript
// scripts/schedule_video.js
// Programmer automatiquement: privacyStatus='private' + publishAt
node scripts/schedule_video.js
// → Modifier VIDEO_ID + PUBLISH_AT avant chaque vidéo
```
**Règle publication:**
- Même jour chaque semaine (ex: lundi)
- Même heure (ex: 07:00 AM Paris CEST = UTC+2)
- Régularité = signal fort algorithme YouTube

**"Définir comme Première"** = Premiere YouTube (countdown + notif abonnés). Utile quand > 500 abonnés. Pour l'instant: publication simple programmée.

### Étape 6 — Nettoyage post-upload
```
Supprimer output/*_FINAL.mp4 (version non-optimisée, déjà uploadé)
Garder output/*_WEB.mp4 jusqu'à confirmation Public
Garder assets/audio/* (sources réutilisables)
```

**Total réel: ~30 min** (vs 13h au premier essai à cause du re-encode tardif)

### Connexion upload
- Wifi récent: ~30 MB/s → 4 min pour 6 GB ✅
- Ancien wifi: ~1.5 MB/s → ECONNRESET sur gros fichiers ❌

---

## 👥 L'Équipe — Khalwa & co

### 🌙 Khalwa (Orchestrateur Principal)
**Rôle**: Chef de projet, décisions stratégiques, coordination des agents.
**Atouts pour ce projet**:
- Mémoire persistante du projet (`memory/` + ce fichier)
- Vision long terme: YouTube → Blog SEO → Site O2Switch → Spotify/DistroKid
- Garant de la philosophie Ihsan sur chaque livrable
**Invocation**: Session principale Claude Code

---

### 🎬 Agent Vidéaste (Pipeline FFmpeg)
**Rôle**: Production des vidéos 10-11h.
**Atouts**:
- Maîtrise FFmpeg concat demuxer + stream_loop
- Résout: UTF-8 BOM, apostrophe dans path, disk space management
- Pipeline: `full_pipeline.ps1` (vidéo source) ou `make_video.ps1` (image Canva)
**Commande**:
```powershell
cd "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel"
.\scripts\full_pipeline.ps1
# ou pour image animée:
.\scripts\make_video.ps1
```
**Contraintes connues**:
- C: drive = 237.9 GB total — vérifier espace avant pipeline (besoin ~25 GB)
- Sources copiées dans `C:\tmp_sleep\` (chemin sans espaces ni apostrophe)
- Nettoyage `C:\tmp_sleep\` automatique après pipeline

---

### 🎨 Agent Graphiste (Canva MCP)
**Rôle**: Création thumbnails, bannières, visuels.
**Atouts**:
- Accès MCP Canva (`mcp__claude_ai_Canva__*`)
- Création + export direct depuis conversation Claude
- Designs existants:
  - Thumbnail baby sleep: `DAHKAjVVHaM` → `assets/thumbnails/baby-sleep-thumb.png`
  - Thumbnail campfire: `DAHJo1ABqC4` → `assets/thumbnails/ancient-campfire-thumb.png`
  - Bannière canal: `DAHKAisCE88` → `assets/thumbnails/channel-banner.png`
**Standards visuels**: `assets/channel_style.md`
- Palette: `#0D0A08` (fond 60%) · `#E8A050` (accent 30%) · `#F8F4EF` (texte 10%)
- Format thumbnail: 1280×720px, texte bold sans-serif ≥80px

---

### 📝 Agent Copywriter (Contenu SEO)
**Rôle**: Titres, descriptions, tags, articles blog.
**Atouts**:
- Templates SEO prêts: `content/descriptions.txt`
- 130+ tags triés par thème: `content/tags.txt`
- 20 titres storytelling: `content/titles.txt`
- Structure titre optimale: `[Emoji] [Univers] | [Détail sensoriel] | [Durée] Deep Sleep`
- Règle SEO: mot-clé principal en position 1-2, "Sleep" ou "Deep Sleep" obligatoire
**Fichier vidéo complet**: `content/baby_sleep_video.md` (modèle à dupliquer)

---

### 📊 Agent Analyste (Veille & Performance)
**Rôle**: Analyse concurrentielle, métriques YouTube, ajustements stratégiques.
**Atouts**:
- Accès WebFetch + WebSearch
- Veille canal cible: **Danny Why** (@danny_why) — Claude Code × YouTube faceless channels
- KPIs: CTR >2% (excellent >5%), Watch time/viewer >30min (excellent >2h)
**Actions hebdo**:
- J+7 après publication: CTR < 2% → changer thumbnail
- Mensuel: vérifier progression monétisation dans Dashboard

---

### 🚀 Agent Publisher (YouTube API)
**Rôle**: Upload automatisé, métadonnées.
**Atouts**:
- Script Node.js: `scripts/upload_youtube.js`
- OAuth2 Desktop + token cache: `scripts/.yt_token.json`
- Credential: `scripts/client_secrets.json` (projet `sleep-channel-yt`)
**⚠️ État actuel**: OAuth2 configuré sur sleepnaturalsounds@gmail.com.
Supprimer `scripts/.yt_token.json` si token expiré → relancer pour re-auth.
**Usage**:
```bash
node scripts/upload_youtube.js
```

---

### 💻 Agent Développeur (Code & Outils)
**Rôle**: Scripts, dashboard, site web, automatisations.
**Atouts**:
- Dashboard CRM: `dashboard/index.html` (localStorage, offline)
- Site web public: `website/index.html` (prêt O2Switch)
- Architecture future: WordPress sur domaine principal + sous-domaine `dashboard.`
**Stack**: PowerShell + Node.js + HTML/CSS/JS vanilla (zéro dépendance externe)

---

## ⚡ Pipeline Optimisé — 1 Vidéo/Semaine

### Jour J-2 (Production) — ~1h total machine
```
1. Télécharger source Pixabay (video + audio MP3)
   → assets/video/[nom].mp4 + assets/audio/[nom].mp3
   
2. Créer thumbnail dans Canva MCP
   → Agent Graphiste → export → assets/thumbnails/[nom]-thumb.png

3. Lancer pipeline:
   .\scripts\full_pipeline.ps1
   Questions: [chemin video] [chemin audio] [nom-slug] [heures=11]
   → output/[nom]_11h_FINAL.mp4
   
4. Vérifier vidéo finale (VLC): 00:00 + 5:30:00 + 10:50:00
```

### Jour J-1 (Contenu) — ~20 min
```
5. Dupliquer content/baby_sleep_video.md → content/[nom-slug].md
6. Remplir: titre, description (200 chars = indexés), 35 tags, chapitres
7. Sources: content/titles.txt + content/descriptions.txt + content/tags.txt
```

### Jour J (Publication) — ~30 min actif + upload en fond
```
8. YouTube Studio → Créer → Importer
9. Remplir pendant upload: titre, description, tags, thumbnail
10. Catégorie: Musique | Langue: English (US)
11. Audience: NON conçue pour enfants (nécessaire pour monétisation)
12. Autoriser intégration: Oui | Remix: Non
13. Visibilité: Non répertoriée d'abord

14. Studio → Revenus → activer monétisation (dès éligible YPP)
15. Vérifier son après processing → passer en Public

16. Mettre à jour Dashboard: dashboard/index.html
```

### Jour J+1 (Amplification) — ~15 min
```
17. Répondre à CHAQUE commentaire (signal algorithme)
18. Pinterest: épingle thumbnail avec titre optimisé
19. Reddit: r/sleep, r/ambientmusic, r/beyondthebump (niche bébé)
```

### Jour J+7 (Analyse)
```
20. CTR < 2% après 500 impressions → changer thumbnail
21. Watch time < 30 min → vérifier audio (saut/artefact)
22. Mettre à jour métriques Dashboard
```

---

## 📁 Fichiers Clés du Projet

| Fichier | Rôle |
|---------|------|
| `scripts/full_pipeline.ps1` | Pipeline principal (vidéo source → 11h) |
| `scripts/make_video.ps1` | Pipeline image animée → 10h |
| `scripts/upload_youtube.js` | Upload API YouTube automatisé |
| `content/baby_sleep_video.md` | **Modèle** métadonnées vidéo complet |
| `content/titles.txt` | 20 titres storytelling par thème |
| `content/descriptions.txt` | 5 templates description SEO |
| `content/tags.txt` | 130+ tags triés par thème |
| `assets/channel_style.md` | Design system visuel + règles thumbnail |
| `assets/pixabay_guide.md` | Guide téléchargement sources libres |
| `guides/pre_publish.md` | Checklist 15 points avant upload |
| `guides/seo_guide.md` | Stratégie SEO complète |
| `guides/monetization_risks.md` | Anti-démonétisation |
| `dashboard/index.html` | CRM local (stats, pipeline, calendrier) |
| `website/index.html` | Site web public prêt O2Switch |
| `output/` | Vidéos finales (10-15 GB chacune) |

---

## 🎯 Vidéos Produites

| # | Titre | Fichier | YouTube ID | Statut |
|---|-------|---------|-----------|--------|
| 1 | Baby Sleep White Noise 11h | `baby-sleep-white-noise_11h_FINAL.mp4` | `PW4yXKyGFL4` | Non répertoriée |
| 2 | Ancient Campfire 10h | `ancient-campfire_10h_FINAL.mp4` | — | Produite |

---

## 🔍 Veille Concurrentielle

### Canal Principal à Suivre: Danny Why (@danny_why)
**Pourquoi**: Canal YouTube sur Claude Code × chaînes faceless AI. Exactement notre méthode.
**Vidéos clés**:
- "Claude Code + YouTube = $62,000/Month"
- "Claude Code just LEAKED YouTube's Algorithm!"
- "This Hidden AI YouTube Channel Made $100,000 in 3 Months"
- "YouTube is BANNING Faceless AI YouTube Channels?" (risque à monitorer)
- "How I Use Claude Code to Create 2D Animations"

**Modèle de référence**: The Guild of Ambience (27 vidéos → 138M vues)
**Inspiration technique**: Zeyneb Madi (@zeyneb-madi) — plugins Claude pour monétisation

### Patterns Gagnants (niche sleep)
- Titre: `(No Ads)` en préfixe → signal fort intention
- Durée: 10-11h > 8h > 3h (watch time maximum)
- Écran noir: batterie + lumière = avantage concurrentiel
- Niche bébé: intention maximale, partage organique, commentaires = preuve sociale

---

## 📊 Données Marché

| Indicateur | Valeur |
|------------|--------|
| CPM YouTube sleep (premium) | ~€15-20 |
| RPM effectif estimé | €5-15/1000 vues |
| Objectif rentabilité (€500/mois) | ~50K vues/mois |
| Référence: Guild of Ambience | 27 vidéos → 138M vues |
| Seuil YPP (annonces) | 1000 abonnés + 4000h watch time |
| Seuil YPP (basique) | 500 abonnés + 3 vidéos publiées |

---

## 🔗 Sources GitHub Intégrées

| Repo | Insight appliqué |
|------|-----------------|
| `VoltAgent/awesome-design-md` | Dark cinematic UI, warm accent = formule gagnante |
| `ItsssssJack/power-design` | Règle 60-30-10, F-pattern, glanceable ≤3s |
| `NicoSKOOL/the-four-systems` | SEO 4 modules: keyword → content → audit → refresh |
| `Higgsfield AI` | Image statique animée = format professionnel validé |

---

## ⚙️ Config Technique

```
FFmpeg: tools/ffmpeg-master-latest-win64-gpl/bin/ (portable, v N-124445)
Node.js: scripts/ (googleapis, OAuth2 Desktop)
Canva MCP: mcp__claude_ai_Canva__* (designs dans compte Canva)
OAuth2 Project: sleep-channel-yt
Canal YouTube: sleepnaturalsounds@gmail.com
Disk C: total 237.9 GB — garder >20 GB libre (pipeline besoin ~25 GB)
```

---

## 📋 Checklist Avant Chaque Nouvelle Session

```
□ Lire ce CLAUDE.md
□ Vérifier espace disque: Get-PSDrive C
□ Vérifier vidéos output/ en attente d'upload
□ Regarder métriques dashboard/index.html
□ Identifier prochaine vidéo à produire (calendrier 1/sem)
```

---

## ⚠️ Règles Absolues

1. **Monétisation AVANT Public** — toujours passer par Non répertoriée d'abord
2. **Sources Pixabay** — vérifier licence libre avant tout usage
3. **Disk space** — vérifier >20 GB libre avant pipeline. Supprimer fichiers inutiles en priorité.
4. **Nettoyage permanent** — supprimer tout fichier tmp/corrompu/inutilisé dès que possible
5. **Vérif audio** — tester volume source avant pipeline (doit etre > -30 dB)
6. **Ihsan** — qualité > quantité. Chaque vidéo = meilleure possible.
7. **No ads dans le contenu** — c'est notre promesse de marque

## 🗑️ Nettoyage — Ce qui doit être supprimé après usage
- `C:\tmp_sleep\` — vider après chaque pipeline terminé
- `output/*_FINAL.mp4` — supprimer LOCAL après upload YouTube confirmé
- Sources Pixabay brutes dans `assets/audio/` — garder seulement si réutilisées
- Fichiers 0 bytes ou corrompus — supprimer immédiatement


---

## 📈 XP LOG — Second Cerveau Vivant
> Jamais effacé. Chaque session = données cumulées. Lire avant d'agir.

| Date | Action | Résultat | Leçon |
|------|--------|----------|-------|
| 2026-06-02 | Publication V1 Pink Noise | ✅ 1 sub, 11 vues, 2 likes | Première vidéo publique — audience existe |
| 2026-06-08 | Fix GitHub Actions sync YT | ✅ BOM + token + write perms | 3 bugs en cascade : secret encodage BOM, token 7j app Testing, workflow sans `contents: write` |
| 2026-06-08 | OAuth re-auth | ✅ Token valide, invalid_grant résolu | App Google mode Testing = refresh tokens expirent 7j → passer en Production |
| 2026-06-08 | Upload V2 Ancient Campfire | ✅ Video ID `i3OvPXCjI4A`, 3.1 min @ 19 MB/s | API upload fonctionne, thumbnail auto-uploadée |
| 2026-06-08 | Rapport mensuel auto | ✅ Workflow + GitHub issue notification | 1er du mois 07:00 UTC → JSON cumulatif + issue créée |
| 2026-06-08 | Campfire encode corrompu | ⚠️ moov atom manquant → YouTube reject | Disk full (2GB libre) = encode interrompu avant écriture moov. **RÈGLE : vérifier >10GB libre avant tout pipeline 11h** |
| 2026-06-08 | CORRECTION date publication | ⚠️ Lundi → Mardi 09/06 | RÈGLE : chaque MARDI 07:00 Paris. Corriger dans TOUS les fichiers. |
| 2026-06-08 | Dashboard calendrier fix | ✅ "Mardi 9 juin", date 09/06, status uploaded | Seed data figée = data incohérente. Règle : seed data = toujours synchronisée avec réalité |

### Règles déduites de l'XP
- **Token Google** : re-OAuth tous les 7 jours si app en mode Testing → passer app en **Production** (Google Cloud Console → OAuth consent screen)
- **Secrets GitHub** : toujours setter via `cmd /c "gh secret set X < file"` sur Windows (pas pipe PowerShell → BOM)
- **Publication** : MARDI 07:00 Paris, jamais lundi
- **Dashboard** : après chaque upload/publication → mettre à jour `editorialCal` + status vidéo dans index.html
- **Méditation** : à intégrer dans la rotation — V3 ou V4 = thème méditation/zen



### Règle critique ajoutée 2026-06-08
- **AVANT tout pipeline 11h** : `(Get-PSDrive C).Free/1GB` → doit être **>10 GB** (output ~3GB + tmp ~1GB + marge)
- **Movflags** : utiliser `+frag_keyframe+empty_moov` pour les encodes longs → survit aux interruptions
- **Vidéo YouTube "Traitement abandonné"** = fichier MP4 sans moov atom = encode interrompu → supprimer et re-encoder
