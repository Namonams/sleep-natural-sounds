# Guide Pixabay — Téléchargement Vidéo & Audio

## Pourquoi Pixabay

- Licence **Pixabay License** : libre de droits, usage commercial OK, pas de CC-BY requis
- Pas de Content ID sur YouTube (contrairement à Pexels ou certains Unsplash)
- Vidéos haute qualité jusqu'en 4K

---

## Télécharger une Vidéo

1. Va sur **pixabay.com/videos**
2. Recherche en anglais : `fireplace`, `campfire`, `rain forest`, `ocean waves`, `snow storm`
3. Filtres recommandés :
   - **Orientation** : Landscape (horizontal)
   - **Duration** : 30+ secondes (plus la source est longue, moins de répétitions)
   - **Resolution** : 1080p minimum (4K si disponible)
4. Clique sur la vidéo → télécharge la **résolution maximale disponible**
5. Renomme le fichier simplement : `feu.mp4`, `pluie.mp4`, `foret.mp4`
6. Place dans le dossier `assets/` du projet

**Critères de sélection qualité :**
- [ ] Plan fixe ou très légèrement animé (pas de zoom brutal)
- [ ] Pas de filigrane ou logo visible
- [ ] Lumière cohérente et naturelle
- [ ] Aucun son intégré à la vidéo (ou son neutre ignorable)

**Mots-clés de recherche efficaces :**
```
fireplace crackling     → feu cheminée
campfire night          → feu de camp nuit
rain forest             → pluie forêt
ocean waves             → vagues océan
snowstorm winter        → tempête neige
waterfall nature        → cascade
autumn leaves wind      → feuilles automne
night sky stars         → ciel étoilé
fog forest morning      → brume forêt
stream creek flow       → ruisseau
```

---

## Télécharger un Audio

1. Va sur **pixabay.com/sound-effects**
2. Recherche : `fireplace`, `rain`, `forest night`, `ocean waves`, `wind storm`
3. Filtres :
   - Duration : **60 secondes minimum** (meilleure qualité de boucle)
   - Qualité : préfère les uploads marqués "High Quality"
4. Télécharge en **WAV** si disponible (meilleure qualité), sinon MP3
5. Renomme : `feu_son.mp3`, `pluie_son.wav`, etc.
6. Place dans `assets/`

**Sources audio alternatives libres de droits :**
- **Freesound.org** : filtrer par "CC0" (domaine public, aucune attribution)
- **BBC Sound Effects** : sounds.bbcrewind.co.uk — certains en RemAsterPL licence
- **OpenGameArt.org** : sons nature en CC0

**À ÉVITER :**
- Epidemic Sound sans safelist (voir guides/monetization_risks.md)
- Sons YouTube Audio Library (certains ont des restrictions)
- Sons avec voix humaines intégrées
- Sons déjà utilisés sur des chaînes concurrentes importantes

---

## Vérification Durée Fichier

Après téléchargement, vérifie la durée exacte :

```powershell
# Dans PowerShell, depuis le dossier sleep-channel
ffprobe -v quiet -print_format json -show_format "assets\feu.mp4" | ConvertFrom-Json | Select-Object -ExpandProperty format | Select-Object duration
```

Ou : clic droit sur le fichier → Propriétés → Détails → Durée

**Durée source idéale :**
- 60-300 secondes : acceptable (nécessite beaucoup de répétitions)
- 300-600 secondes : bon (boucle propre)
- 600+ secondes : excellent (moins de coutures visibles)

---

## Structure assets/ recommandée

```
assets/
├── video/
│   ├── feu_medieval.mp4
│   ├── pluie_foret.mp4
│   └── ocean_nuit.mp4
├── audio/
│   ├── feu_crackling.mp3
│   ├── pluie_forte.wav
│   └── ocean_vagues.mp3
└── thumbnails/
    ├── medieval-fireplace-thumb.png
    └── (exports Canva ici)
```
