# Sleep Channel — Workflow YouTube 10H

**Concept**: Image Canva + son Pixabay → vidéo 10h → YouTube.
**Rythme**: 1 vidéo/semaine.
**Modèle**: The Guild of Ambience (27 vidéos, 138M vues — qualité > volume).

---

## WORKFLOW ULTRA-SIMPLE — Publier aujourd'hui

```
Canva image (PNG) + Pixabay son (MP3)
         ↓
   make_video.ps1   ← 3 questions
         ↓
   output/*_FINAL.mp4
         ↓
   YouTube Studio
```

### Étape 1 — Créer l'image dans Canva (15 min)

1. Canva → nouveau design → **1280 × 720 px**
2. Fond noir profond (`#0D0A08`)
3. Image ou illustration centrale : flamme, fenêtre éclairée, forêt nocturne...
4. **Pas de texte** dans l'image (le texte va sur la thumbnail séparée)
5. Exporte en **PNG** → place dans `assets/thumbnails/`
6. Règles visuelles détaillées : `assets/channel_style.md`

> La même image sert à la fois de **fond vidéo** et de base pour la **thumbnail**.

### Étape 2 — Télécharger le son sur Pixabay (5 min)

1. Va sur **pixabay.com/sound-effects**
2. Recherche : `fireplace`, `rain`, `forest night`, `ocean waves`
3. Durée 60s minimum — télécharge en **MP3**
4. Renomme simplement : `feu.mp3`, `pluie.mp3`, etc.
5. Place dans `assets/audio/`
6. Guide complet : `assets/pixabay_guide.md`

### Étape 3 — Lancer le pipeline (3 questions) (5-15 min)

```powershell
# Ouvre PowerShell dans le dossier sleep-channel/
cd "C:\Users\Utilisateur_2\Peace's video natural\sleep-channel"

.\scripts\make_video.ps1
```

Réponds aux 3 questions :
- Image : `assets\thumbnails\feu.png`
- Audio : `assets\audio\feu.mp3`
- Nom   : `medieval-fireplace`

Résultat dans `output/medieval-fireplace_10h_FINAL.mp4`.

**Temps de traitement :**
- Clip 60s (floating animation) : 3-10 min
- Boucle 10h (codec copy) : 30s
- Audio 10h : 3-8 min
- Fusion finale : 1 min
- **Total : ~10-20 min**

### Étape 4 — Préparer le contenu YouTube (10 min)

| Fichier | Ce que tu copies |
|---------|-----------------|
| `content/titles.txt` | 1 titre storytelling |
| `content/descriptions.txt` | 1 template selon le thème |
| `content/tags.txt` | 25-35 tags |
| `content/chapters.txt` | Timestamps à coller dans la description |

### Étape 5 — Thumbnail (5 min)

1. Dans Canva, reprends l'image de base
2. Ajoute le titre en texte blanc bold (Bebas Neue ou Montserrat ExtraBold)
3. Exporte PNG 1280×720
4. Règles visuelles précises dans `assets/channel_style.md`

### Étape 6 — Upload YouTube (15 min)

1. studio.youtube.com → Create → Upload video
2. Pendant l'upload : titre, description, tags, thumbnail
3. Catégorie : **Music** | Langue : **English (United States)**
4. **Active la monétisation AVANT de publier**
5. Assigne à une playlist thématique
6. Checklist complète : `guides/pre_publish.md`

### Étape 7 — Post-publication (10 min)

- Réponds à chaque commentaire dans l'heure
- Partage sur Pinterest (épingle thumbnail)
- Poste sur Reddit : r/ambientmusic, r/sleep
- Reviens dans 48h voir le CTR dans Analytics

---

## Structure du Projet

```
sleep-channel/
├── scripts/
│   ├── make_video.ps1         ← ENTRÉE PRINCIPALE (image → 10h)
│   ├── full_pipeline.ps1      ← Alternative si tu as une vidéo source MP4
│   ├── build_video.ps1        ← Sous-module (appelé par full_pipeline)
│   ├── loop_audio.ps1         ← Sous-module
│   └── merge_final.ps1        ← Sous-module
├── content/
│   ├── titles.txt             ← 20 titres storytelling
│   ├── descriptions.txt       ← 5 templates SEO
│   ├── tags.txt               ← 130+ tags triés par thème
│   └── chapters.txt           ← Templates timestamps
├── guides/
│   ├── pre_publish.md         ← Checklist 15 points avant upload
│   ├── seo_guide.md           ← Stratégie SEO complète
│   └── monetization_risks.md ← Anti-démonétisation juillet 2025
├── assets/
│   ├── channel_style.md       ← Design system visuel + insights GitHub
│   ├── pixabay_guide.md       ← Guide téléchargement sources
│   ├── thumbnails/            ← Exports Canva (PNG 1280×720)
│   ├── audio/                 ← Sons Pixabay
│   └── video/                 ← Vidéos source si mode full_pipeline
└── output/                    ← Fichiers finaux (auto-créé)
```

---

## Données Marché

| Indicateur | Valeur |
|------------|--------|
| CPM YouTube Premium (niche sleep) | ~20$ |
| RPM effectif estimé | 3-8$/1000 vues |
| Seuil rentabilité (500$/mois) | ~100K vues/mois |
| Modèle référence | Guild of Ambience: 27 vidéos → 138M vues |
| Fréquence cible | 1 vidéo/semaine |
| Horizon première monétisation | 6-12 mois (1000 abonnés + 4000h watch) |

**Diversification an 2+ :** Spotify via DistroKid · Patreon · Licensing

---

## FAQ Problèmes Courants

**"FFmpeg introuvable"**
→ `winget install ffmpeg` ou télécharge sur ffmpeg.org → ajoute au PATH Windows

**"Image trop petite ou déformée"**
→ Exporte depuis Canva en 1920×1080 ou 1280×720 minimum
→ Le script scale automatiquement à 1920×1080

**"La vidéo finale fait 15 GB"**
→ Normal pour 10h en H.264. YouTube accepte jusqu'à 256 GB.
→ Upload peut prendre 30-90 min selon ta connexion

**"Son coupé / saut dans l'audio"**
→ Le fichier source audio a peut-être un silence ou click à la fin
→ Utilise Audacity pour lisser les débuts/fins avant de relancer

**"Content ID claim"**
→ Si source Pixabay: dispute avec le numéro de licence
→ Si source autre: vérifie la licence dans `assets/pixabay_guide.md`
