import * as SecureStore from "expo-secure-store";

const sessionKey = "currencykart.session";

export type MobileSession = {
  token: string;
  phone?: string;
  createdAt: string;
  stagingPlaceholder?: boolean;
};

export async function saveSession(session: MobileSession) {
  await SecureStore.setItemAsync(sessionKey, JSON.stringify(session));
}

export async function getSession() {
  const value = await SecureStore.getItemAsync(sessionKey);
  return value ? (JSON.parse(value) as MobileSession) : null;
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(sessionKey);
}
