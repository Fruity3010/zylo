# Zylo

Zylo is an Expo mobile app for coordinating everyday errands between people who need help (senders) and people who complete errands (erranders). The app includes onboarding, account creation, errand creation, map-based locations, browsing, active errands, history, payments, support, safety information, and chat screens.

## Runtime Modes

The app supports a backend-connected mode and an offline demo mode. Demo mode is enabled by default so the project can be reviewed without access to the backend repository.

- **Demo mode:** `EXPO_PUBLIC_DEMO_MODE=true` (the default). Login and signup create a demo session on the device, RTK Query returns demo responses, and no Zylo backend is required.
- **Live mode:** `EXPO_PUBLIC_DEMO_MODE=false`. Authentication and service requests use the API configured by `EXPO_PUBLIC_API_BASE_URL`.
- Browse, active, and history views still contain prototype data where screen-level API wiring has not yet been added.
- Authentication tokens and the current user are cached locally with `AsyncStorage`.
- The app does not use Supabase or a websocket client.
- Location search and map tiles still make network requests to public map services when those features are used.

## Built With

- Expo SDK 54
- React Native 0.81 and React 19
- TypeScript
- Expo Router for file-based navigation
- Redux Toolkit and RTK Query for shared server-state access
- React Navigation and React Native Paper for navigation/UI primitives
- `react-native-maps` for native map views
- `expo-location` for device location permissions and current position
- `expo-image-picker` for chat image selection and camera capture
- `@react-native-async-storage/async-storage` for cached session data
- Expo Font with the bundled Bodwars font

## Maps and Location Search

The app uses:

- **Map rendering:** `react-native-maps`.
- **Map tiles:** Stadia Maps tile URLs (`tiles.stadiamaps.com`) selected by the app theme.
- **Address and place search:** OpenStreetMap Nominatim (`nominatim.openstreetmap.org`).
- **Device location:** Expo Location (`expo-location`).

The map screens default to Lagos coordinates when device location is unavailable. Location permissions are declared for iOS and Android in `app.json`. Public geocoding/tile services may have rate limits and should be replaced with an appropriately configured provider before production release.

## Project Structure

```text
app/                         Expo Router screens
  index.tsx                  Landing/onboarding screen
  login.tsx                  Login or demo login
  signup.tsx                 Signup or demo account creation
  dashboard/(tabs)/          Home, browse, active, history, account
  dashboard/                 About, payment, support, safety
components/                  Shared UI and chat components
contexts/                    Authentication and theme providers
services/api/baseApi.ts      RTK Query API client and demo-mode switch
services/api.ts              API request helper used by service wrappers
services/auth.ts             Authentication service
services/chat.ts             Chat service
services/errands.ts          Errand API service
store/                       Redux store and RTK Query integration
src/components/              Errand forms and location controls
assets/                      Images and fonts
constants/                   Colors and font definitions
```

## Requirements

- Node.js 18 or newer
- npm
- Expo Go on a physical device, or an iOS Simulator/Android Emulator

## Install and Run

```bash
cd /Users/campbell/Downloads/zylo-main
npm install
npx expo start
```

From the Expo terminal:

- Press `w` to open the web build.
- Press `i` to open the iOS Simulator.
- Press `a` to open the Android Emulator.
- Scan the QR code with Expo Go to run on a physical phone.

For a physical device, keep the phone and computer on the same network. If discovery fails, run `npx expo start --tunnel`.

### Recruiter Demo

No backend access is needed. Leave demo mode enabled in `.env` (or omit `.env` entirely):

```env
EXPO_PUBLIC_DEMO_MODE=true
```

The demo can be run through Expo Go, the iOS Simulator, or the Android Emulator. The web export is not currently supported because `react-native-maps` uses native-only modules in this project.

### Live Backend

Create a local `.env` file and set:

```env
EXPO_PUBLIC_DEMO_MODE=false
EXPO_PUBLIC_API_BASE_URL=https://api.zylo.app/api
```

The backend must expose the authentication, errand, and chat routes expected by `services/auth.ts`, `services/errands.ts`, and `services/chat.ts`.

## Local Data

The API session token and current user are cached under `auth_token` and `user_data`. Chat data is owned by the backend.

To clear a cached session, log out or clear the Expo app's storage.

## Permissions

The app requests:

- Foreground location access for current position and map centering.
- Camera access when taking a chat photo.
- Photo-library access when selecting a chat image.

If a permission is denied, the rest of the app can still run, but the related location or image feature will not work.

## Development Checks

Run the TypeScript check with:

```bash
npx tsc --noEmit
```

There are no local backend services or VS Code auto-run tasks required by this project.

## Production Follow-up

Before shipping, add secure token storage, configure a supported map/geocoding provider and API keys, connect every prototype screen to RTK Query endpoints, and verify the backend route contracts.
