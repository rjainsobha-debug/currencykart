# CurrencyKart Mobile

Expo React Native Android MVP for CurrencyKart customers.

This app connects to the existing CurrencyKart web/API backend and is designed for the cheapest Android staging path: Expo Go locally, EAS preview APK when needed, and no paid Firebase/AWS/mobile services.

## What Is Included

- Splash screen
- Onboarding
- Login
- Register
- OTP verification placeholder flow
- Home
- Currency calculator
- Buy forex request
- Sell forex request
- Forex card request
- Travel insurance request
- My orders
- Order detail with timeline
- KYC/document upload placeholder
- Profile
- Support/WhatsApp

## API Backend

Default staging backend:

```text
EXPO_PUBLIC_API_BASE_URL=https://staging.currencykart.in
```

The app uses:

```text
POST /api/auth/register
POST /api/auth/otp
POST /api/auth/otp/verify
GET /api/orders
POST /api/orders
GET /api/orders/{orderId}
GET /api/document-checklist
POST /api/upload
```

The current backend OTP route verifies the challenge but does not yet issue a mobile bearer token. For staging, the app stores a clearly marked placeholder session in `expo-secure-store`. Do not store PAN, passport, visa, ticket or other sensitive KYC details locally.

## Run Locally With Expo Go

```bash
cd mobile
npm install
npm run start
```

Open the QR code in Expo Go on Android.

## Connect To Staging Backend

Create `mobile/.env`:

```text
EXPO_PUBLIC_API_BASE_URL=https://staging.currencykart.in
```

Restart Expo after changing environment variables.

## Change API URL

Set:

```text
EXPO_PUBLIC_API_BASE_URL=https://your-api-domain
```

You can also adjust the fallback in `app.config.ts`.

## Android Preview APK With EAS Build

EAS is free to configure; build minutes/queues depend on Expo's current free tier.

```bash
cd mobile
npm install
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

The preview profile in `eas.json` builds an APK and points at:

```text
https://staging.currencykart.in
```

## Scripts

```bash
npm run start
npm run android
npm run typecheck
```

## Before Play Store Release

- Add a backend mobile token/session endpoint.
- Replace staging placeholder auth with real token handling.
- Add production document upload with private signed URLs.
- Add real profile/KYC status endpoints for mobile.
- Add Play Store-ready privacy policy, screenshots and app listing.
- Perform Android device QA across network loss, slow API, form errors and accessibility.
- Add release signing and production EAS build profile.
- Keep push notifications out until provider, consent and privacy flows are ready.
