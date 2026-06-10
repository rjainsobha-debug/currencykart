import type { ReactNode } from "react";
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors, spacing } from "./theme";
import type { Screen } from "./types";

export function LogoHeader({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.logoRow}>
      <Image source={require("../assets/logo-mark.png")} style={compact ? styles.logoSmall : styles.logo} />
      <View>
        <Text style={styles.logoText}>CurrencyKart</Text>
        <Text style={styles.logoSub}>Travel Money, Delivered Smartly</Text>
      </View>
    </View>
  );
}

export function ScreenShell({ children }: { children: ReactNode }) {
  return <View style={styles.shell}>{children}</View>;
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Button({ label, onPress, variant = "primary", disabled = false }: { label: string; onPress: () => void; variant?: "primary" | "ghost" | "gold"; disabled?: boolean }) {
  return (
    <Pressable onPress={onPress} disabled={disabled} style={[styles.button, variant === "ghost" && styles.ghostButton, variant === "gold" && styles.goldButton, disabled && styles.disabled]}>
      <Text style={[styles.buttonText, variant === "ghost" && styles.ghostText]}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, value, onChangeText, placeholder, keyboardType = "default", secureTextEntry = false }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder ?? label} keyboardType={keyboardType} secureTextEntry={secureTextEntry} style={styles.input} placeholderTextColor="#8A97A8" />
    </View>
  );
}

export function Status({ state, message }: { state: "loading" | "success" | "error" | "empty"; message: string }) {
  return (
    <View style={[styles.status, state === "error" && styles.statusError, state === "success" && styles.statusSuccess]}>
      {state === "loading" ? <ActivityIndicator color={colors.royal} /> : null}
      <Text style={[styles.statusText, state === "error" && { color: colors.danger }]}>{message}</Text>
    </View>
  );
}

export function NavGrid({ go }: { go: (screen: Screen) => void }) {
  const items: Array<[Screen, string]> = [
    ["calculator", "Calculator"],
    ["buy", "Buy forex"],
    ["sell", "Sell forex"],
    ["card", "Forex card"],
    ["insurance", "Insurance"],
    ["orders", "My orders"],
    ["kyc", "KYC upload"],
    ["support", "Support"]
  ];
  return (
    <View style={styles.grid}>
      {items.map(([screen, label]) => (
        <Pressable key={screen} onPress={() => go(screen)} style={styles.tile}>
          <Text style={styles.tileTitle}>{label}</Text>
          <Text style={styles.tileHint}>Open</Text>
        </Pressable>
      ))}
    </View>
  );
}

export const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: colors.mist, padding: spacing.page, paddingTop: 54 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  logo: { height: 54, width: 54, borderRadius: 14 },
  logoSmall: { height: 42, width: 42, borderRadius: 12 },
  logoText: { color: colors.navy, fontSize: 24, fontWeight: "800" },
  logoSub: { color: colors.slate, fontSize: 12, fontWeight: "600" },
  card: { backgroundColor: colors.white, borderRadius: spacing.radius, padding: 18, borderWidth: 1, borderColor: colors.line, shadowColor: colors.ink, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
  button: { minHeight: 50, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.navy, paddingHorizontal: 18, marginTop: 12 },
  goldButton: { backgroundColor: colors.gold },
  ghostButton: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.line },
  disabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontWeight: "800", fontSize: 15 },
  ghostText: { color: colors.navy },
  fieldWrap: { marginTop: 12 },
  label: { color: colors.navy, fontSize: 13, fontWeight: "800", marginBottom: 7 },
  input: { minHeight: 50, borderRadius: 14, borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, color: colors.navy, backgroundColor: colors.white },
  status: { borderRadius: 14, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.white, padding: 12, marginTop: 12, flexDirection: "row", gap: 10, alignItems: "center" },
  statusSuccess: { backgroundColor: "#ECFDF5", borderColor: "#BFEAD8" },
  statusError: { backgroundColor: "#FFF1F0", borderColor: "#F3C2BD" },
  statusText: { color: colors.slate, fontSize: 13, flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 16 },
  tile: { width: "47%", backgroundColor: colors.white, borderRadius: 16, padding: 15, borderWidth: 1, borderColor: colors.line },
  tileTitle: { color: colors.navy, fontWeight: "800", fontSize: 15 },
  tileHint: { color: colors.teal, fontSize: 12, fontWeight: "700", marginTop: 10 }
});
