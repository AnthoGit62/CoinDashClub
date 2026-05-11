# Coin Dash Club

Prototype de jeu mobile gratuit iOS/Android avec economie de pieces, pubs, boutique et abonnement mensuel sans pub.

## Ce qui est deja la

- Jeu mobile Expo/React Native en TypeScript.
- Ecran de jeu jouable: attraper des pieces, eviter les bombes, scorer avant la fin du chrono.
- Portefeuille de pieces sauvegarde localement.
- Boutique avec abonnement mensuel a 4.99 EUR, packs de pieces et recompense par pub.
- Services `ads` et `purchases` en mode mock pour developper sans comptes Apple/Google/AdMob.
- Configuration preparee pour EAS Build, iOS et Android.

## Installation

Expo SDK 55 demande Node.js 20.19.x ou plus recent.

```bash
npm install
npm run start
```

Puis scanner le QR code avec Expo Go, ou lancer:

```bash
npm run android
npm run ios
```

## Monetisation reelle

Les fichiers de monetisation sont volontairement separes:

- `src/config/monetization.ts`: prix, produits, bonus, emplacements de pubs.
- `src/services/ads.ts`: a remplacer par Google AdMob, par exemple via `react-native-google-mobile-ads`.
- `src/services/purchases.ts`: a remplacer par les achats integres App Store / Google Play, ou RevenueCat.

Pour publier et gagner de l'argent il faudra:

1. Creer les apps dans App Store Connect et Google Play Console.
2. Creer les produits: abonnement mensuel, packs de pieces.
3. Creer les blocs de pubs AdMob interstitiel et rewarded.
4. Remplacer les IDs dans `.env` et `monetization.ts`.
5. Tester les achats et les pubs sur vrais appareils.
6. Generer les builds avec EAS.

## Builds mobiles

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

Pour le store:

```bash
eas build --platform all --profile production
eas submit --platform all
```

## Notes business

Le prix de base est dans `src/config/monetization.ts`:

```ts
priceEur: 4.99
```

Tu peux le changer pour ton `X EUR/mois`. L'abonnement actuel retire les pubs, donne un multiplicateur x2, un bonus de 500 pieces et active les bonus quotidiens.
