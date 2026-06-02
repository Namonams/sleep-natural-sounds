# Channel Visual Style — Sleep & Nature Sounds

Basé sur: VoltAgent/awesome-design-md + ItsssssJack/power-design + Higgsfield image aesthetics

---

## Identité Visuelle

**Concept**: Dark cinematic ambience — lumière chaude sur fond obscur.
Même approche que The Guild of Ambience et les top chaînes sleep.

### Palette (règle 60-30-10)
| Rôle | Couleur | Hex | Usage |
|------|---------|-----|-------|
| Fond principal (60%) | Noir profond | `#0D0A08` | Background thumbnail |
| Élément chaud (30%) | Ambre/feu | `#E8A050` | Flamme, lumière, lueur |
| Texte / accent (10%) | Blanc pur | `#F8F4EF` | Titre, sous-titre |

*Variation pluie/forêt :* remplace ambre par bleu-nuit `#1A2744` ou vert forêt `#1A3020`

---

## Thumbnail — Règles (power-design)

**F-pattern eye-tracking**: lumière en haut, texte en bas-gauche.
**Glanceable en ≤3 secondes**: 2 éléments max + texte.
**Un seul accent** par thumbnail.

### Structure obligatoire
```
┌─────────────────────────────────┐
│   [SOURCE DE LUMIÈRE]           │  ← flamme, lune, lampe (top ou center)
│                                 │
│         [IMAGE]                 │  ← ambiance sombre, profondeur
│                                 │
│  TITRE BOLD              [EMOJI]│  ← blanc, bas-gauche, 48px+
└─────────────────────────────────┘
```

### Canva — Réglages exacts
- **Taille**: 1280 × 720 px (YouTube recommandé)
- **Police titre**: Bold sans-serif (Bebas Neue, Anton, ou Montserrat ExtraBold)
- **Taille texte**: Titre ≥ 80px, sous-titre ≥ 48px
- **Contraste**: toujours blanc sur sombre (jamais jaune sur blanc)
- **Whitespace**: ≥ 40% de la surface vide (pas de remplissage)

### Template par thème
| Thème | Fond | Lumière | Accent |
|-------|------|---------|--------|
| Fireplace | `#0D0A08` noir | Flamme ambre `#E8A050` | Blanc `#F8F4EF` |
| Rain | `#080D12` bleu-noir | Fenêtre éclairée `#C8D8E8` | Blanc |
| Forest | `#080D09` vert-noir | Lune `#D4C8A0` ou feu | Blanc |
| Ocean | `#06090D` marine | Lune sur eau `#8AB0C8` | Blanc |
| Winter | `#0A0C10` nuit | Lueur cheminée `#D4785A` | Blanc |

---

## L'Image Canva — Ce qui marche

### Pour une image "qui bouge bien" (floating effect)
- Image avec **beaucoup de détail dans toute la surface** (pas juste au centre)
- Zone centrale = sujet fort (flamme, fenêtre, arbre)
- Bords = obscurité progressive (vignette naturelle ou ajoutée)
- L'animation scale 115% + crop oscillant révèle les bords → mouvement naturel

### Éléments visuels qui fonctionnent
- Feu: plan serré sur flammes dans une cheminée en pierre
- Pluie: fenêtre avec buée + pluie qui coule + lumière douce intérieure
- Forêt: sous-bois la nuit avec rayons de lune filtrant
- Montagne: cabin isolée dans la neige, une seule fenêtre éclairée
- Océan: plage nocturne, lune réfléchie sur eau calme

### Ce qui ne marche PAS
- Photo de stock trop générique (flamme Photoshop clipart)
- Image trop claire ou trop colorée (incohérent avec sleep)
- Texte dans l'image (conflit avec thumbnail overlay)
- Plusieurs sources de lumière égales (pas de hiérarchie visuelle)

---

## Animation — Choix du mouvement

`make_video.ps1` utilise **floating** (scale + crop oscillant):
- Effet: lévitation douce, comme une caméra qui respire
- Cycle x: 60s | Cycle y: 90s → non synchronisé = organique
- Amplitude: 15% de l'image (subtil mais visible)

**Pourquoi pas zoom (zoompan)?**
- Zoompan FFmpeg = très lent à encoder (10-30 min pour 60s)
- Crop oscillant = même résultat visuel, 5x plus rapide

---

## Insights GitHub intégrés

**Higgsfield AI** (image-to-video pro):
→ L'approche image statique animée est un format professionnel validé
→ Séquence: define style → create visual → add identity → score virality
→ Notre équivalent: thème univers → image Canva → animation FFmpeg → upload

**VoltAgent/awesome-design-md**:
→ "Dark cinematic UI, warm accent" = formule gagnante (Claude, ElevenLabs)
→ Plain-text design systems = ce fichier, pour garder la cohérence

**ItsssssJack/power-design**:
→ Glanceable ≤3s: titre principal doit être lu en un coup d'œil
→ 60-30-10: fond noir (60%), lumière ambre (30%), texte blanc (10%)
→ F-pattern: lumière haut-centre, texte bas-gauche

**NicoSKOOL/the-four-systems**:
→ Système SEO en 4 modules: keyword research → content → audit → refresh
→ Appliqué: semaine 1 = keyword research, semaines 2-N = contenu, mois 3 = audit métriques
