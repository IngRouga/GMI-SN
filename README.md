# Global Market Investment — Site officiel

Site statique **HTML / CSS / JS** (aucun framework, aucune étape de build), bilingue FR (par défaut) / EN.
Déploiement : pousser le dossier sur GitHub → Cloudflare Pages (framework : *None*, build command : vide, output : `/`).

## Pages
| Fichier | Page |
|---|---|
| `index.html` | Accueil |
| `a-propos.html` | À propos |
| `trading-forex.html` | Trading Forex (+ sessions en direct, calculateur de position) |
| `prop-firm.html` | Préparation Prop Firm |
| `coaching-prive.html` | Coaching privé (+ formulaire de demande) |
| `formations.html` | Catalogue des formations |
| `communaute.html` | Communauté Telegram |
| `contact.html` | Contact (+ formulaire) |
| `404.html` | Page introuvable |

## À confirmer avec le client → `assets/js/config.js`
Tout se règle dans **un seul fichier** :
- **Téléphone** : `+221 78 422 23 2` semble incomplet (8 chiffres après +221 au lieu de 9). Mettre le bon numéro, puis `phoneConfirmed: true`.
- **WhatsApp** : vide = boutons WhatsApp masqués.
- **E-mail, adresse, horaires, réseaux sociaux** : vides = masqués automatiquement.
- **Formulaires** : `formEndpoint` (ex. Formspree `https://formspree.io/f/XXXX`). Vide = la demande est mise en forme puis copiée et envoyée par le visiteur au support Telegram.
- **Durées et tarifs des formations** : `programs` (vide = « À confirmer »).

## Contenus à fournir par le client
- Témoignages écrits réels (la section a été retirée en attendant ; à rajouter dès réception).
- Histoire de l’entreprise : date de création, fondateur(s) (voir le commentaire dans `a-propos.html`).
- Noms et rôles des membres de l’équipe.
- Nom exact de la communauté : le brief mentionne « Global Market International » (Telegram) et « Global Market Investment » (entreprise).

## Langues
Chaque texte existe en double : `<span class="fr">…</span><span class="en">…</span>`. Le choix est mémorisé (localStorage) ; `?lang=en` force l’anglais dans un lien.

Site conçu par RougaTech.
