import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "CurrencyKart",
  slug: "currencykart",
  scheme: "currencykart",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#07111F"
  },
  android: {
    package: "in.currencykart.app",
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#07111F"
    }
  },
  extra: {
    apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? "https://staging.currencykart.in"
  }
};

export default config;
