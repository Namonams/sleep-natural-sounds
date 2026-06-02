# Roadmap — Pipeline Full Autonome (ordi éteint)

## Objectif final
Envoyer sources Pixabay → pipeline complet automatique → vidéo publiée sur YouTube
Sans toucher l'ordi.

## Phases

### Phase 1 — Maintenant (gratuit)
- Encode FFmpeg local la nuit (ordi allumé, toi tu dors)
- Upload + programmation = automatique via API
- Dashboard H24 via GitHub Actions + GitHub Pages

### Phase 2 — VPS ~3€/mois (après YPP ou dès que prêt)
Providers recommandés:
- **Hetzner CX22** — 3.29€/mois — 2 vCPU / 4 GB RAM / 40 GB SSD — meilleur rapport
- **OVH VPS Starter** — 3.99€/mois — option française, RGPD
- **Contabo VPS 1** — 4.99€/mois — plus de RAM

Setup VPS (1h):
1. Ubuntu 22.04
2. FFmpeg + Node.js installés
3. Scripts full_pipeline.ps1 adaptés en bash
4. Cron job: détecte nouvelles sources → encode → upload → programme
5. Dashboard GitHub Actions = stats live

Résultat: tu déposes audio+vidéo sur un dossier → tout le reste est automatique.

### Phase 3 — Scale (multi-vidéos)
- Plusieurs niches en parallèle
- File d'attente automatique
- 3-4 vidéos/semaine sans intervention

## Option GitHub Actions (gratuit, limité)
- Free tier = 2000 min/mois pour repo public
- Encode ultrafast = ~90 min CPU pour 11h vidéo
- ~22 vidéos/mois encodables gratuitement
- Limite: sources Pixabay (lourdes) difficiles à transférer

## Décision
VPS = solution la plus propre et scalable. Investissement 3€/mois.
