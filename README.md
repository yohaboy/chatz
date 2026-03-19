# ChatZ - AI Chat Application

A professional AI-focused chat application built with Expo (latest).

## Features
- **Multi-step Signup Flow**:
  1. User Info (Email, Password, Age, Gender)
  2. Agent Template Selection
  3. Agent Customization (Name, Age, Personality: Romantic, Friend, Emotional)
- **Professional Login**: With standard credentials and Google Auth support.
- **Bottom Navigation**: Home, Chats, Groups, Profile, and Settings.
- **Professional UI**: Light cyan theme, white-ish background, black text, and minimal rounded corners.
- **API Integration**: Complete integration with provided backend endpoints.

## Tech Stack
- **Framework**: Expo (SDK 55)
- **Navigation**: Expo Router (File-based)
- **Icons**: Lucide React Native
- **Styling**: React Native StyleSheet (Monochrome + Cyan)
- **API Client**: Axios with Token Interceptors
- **Auth**: Expo Secure Store & Expo Auth Session

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Update `.env` with your backend URL and Google Client ID:
   ```env
   EXPO_PUBLIC_BASE_API_URL=http://your-backend-api.com
   EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
   ```

3. **Run the app**:
   ```bash
   npx expo start
   ```

## Folder Structure
- `app/`: Routing and Screens.
- `api/`: Backend service integration.
- `components/`: Reusable UI components.
- `context/`: Authentication state management.
- `constants/`: Theme and color definitions.
