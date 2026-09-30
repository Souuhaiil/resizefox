# ResizeFox — exemples autonomes Canvas et landing SEO

Ouvrir `index.html` dans un navigateur : le JavaScript et le CSS sont locaux, sans CDN ni installation supplémentaire pour utiliser l’exemple. Ce dossier n’est pas publié automatiquement par Next.js et ne modifie pas les outils existants.

## Fichiers

- `image-tool.js` : logique JavaScript pur, Canvas, sélection/dépôt, ratio, pourcentages, préréglages, qualité, aperçu, poids réels et téléchargement.
- `index.html` : template complet en français, métadonnées, guide, tableau, FAQ visible et JSON-LD identique, emplacement publicitaire et navigation légale.
- `input.css` : source Tailwind CSS et quelques styles de composants.
- `styles.css` : CSS compilé, directement utilisable.
- `build-css.mjs` : compilation avec les dépendances déjà installées dans le projet.

Après modification des classes HTML, lancer depuis la racine :

```sh
node examples/canvas-landing/build-css.mjs
```

## Limites explicites

Le curseur qualité agit sur JPG/WebP, pas PNG. Le poids réel apparaît après génération, sans estimation trompeuse ni garantie de réduction. JPG remplace la transparence par du blanc. Les préréglages imposent les dimensions, sans recadrage. HEIC, rognage interactif, traitement par lots et outils PDF ne font pas partie de ces deux premiers exemples.

Limites applicatives : entrée 25 Mo / 40 mégapixels, sortie 8192 pixels par côté / 24 mégapixels. Le navigateur doit décoder le fichier avant de connaître sa résolution ; une image très volumineuse peut donc consommer de la mémoire avant ce contrôle. Les capacités réelles dépendent de l’appareil. Une nouvelle sélection ou une modification invalide le résultat précédent ; les URL temporaires sont libérées.

## Intégration au site

Pour publier comme page statique, copier HTML, JS et CSS ensemble dans le répertoire public approprié, puis adapter la route et les chemins. Pour une intégration React, reprendre les événements dans un composant client plutôt que charger ce script avant que ses éléments existent.

La canonical `/redimensionner-image` est une destination proposée : la remplacer par l’URL réellement publiée. Le footer utilise les routes existantes `/privacy`, `/terms`, `/about`, `/contact` ; les alias `/privacy-policy` et `/terms-of-service` du brief ne sont pas créés ici. Les liens absolus exigent le site pour fonctionner, ils ne fonctionnent pas en ouvrant uniquement le fichier local.

## Publicité et consentement — configuration restante

Les exemples de balises AdSense sont commentés. Aucun script publicitaire ou Analytics n’est chargé par cette page. Remplacer les identifiants de démonstration et intégrer le code exact fourni par une CMP certifiée, configurée pour le domaine, avant activation. Le bloc commenté n’est pas une intégration CMP fonctionnelle et ne garantit pas la conformité RGPD ou l’approbation AdSense.

Configurer le message de consentement dans le service retenu, les partenaires, les finalités, le refus et le retrait ; relier l’activation des services au dispositif de consentement documenté par le fournisseur. Tester les choix accepter/refuser/retirer et les requêtes tierces, puis adapter les textes légaux au fonctionnement effectif. Le formulaire de contact reste celui du site et n’a pas été modifié ni vérifié dans ce livrable.

Attention : le layout Next.js existant charge déjà AdSense et des tags Google. Le présent exemple autonome ne modifie pas cette configuration ; il ne constitue donc pas un audit de conformité du site existant.

Google décrit ses exigences CMP ici : https://support.google.com/adsense/answer/13554116?hl=fr

Le JSON-LD FAQ répond au format demandé, mais ne garantit ni indexation ni résultat enrichi. Consulter les mises à jour officielles : https://developers.google.com/search/updates

## Vérification manuelle avant publication

1. Charger un JPG, modifier largeur et hauteur avec/sans verrouillage, puis tester les pourcentages et préréglages.
2. Exporter en JPG, PNG et WebP ; ouvrir les téléchargements et contrôler leurs dimensions et leur taille.
3. Vérifier une image transparente, les qualités 0 et 100 et l’absence d’effet qualité en PNG.
4. Essayer un fichier corrompu, HEIC, plusieurs fichiers déposés et des dimensions hors limites.
5. Changer de fichier pendant le traitement : aucun ancien résultat ne doit réapparaître.
6. Vérifier le clavier, l’affichage mobile et l’absence de requête contenant le fichier dans les outils réseau du navigateur.
