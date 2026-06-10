import { useEffect, useMemo, useState } from "react";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { apiBaseUrl, getOrder, getOrders, registerCustomer, requestOtp, requestUploadPlaceholder, submitOrder, verifyOtp } from "./api";
import { Button, Card, Field, LogoHeader, NavGrid, ScreenShell, Status } from "./components";
import { colors } from "./theme";
import { saveSession } from "./storage";
import type { Order, OrderType, RouteState, Screen } from "./types";

type Nav = {
  route: RouteState;
  go: (screen: Screen, selectedOrder?: Order) => void;
};

export function SplashScreen({ go }: Nav) {
  useEffect(() => {
    const id = setTimeout(() => go("onboarding"), 900);
    return () => clearTimeout(id);
  }, [go]);
  return (
    <ScreenShell>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <LogoHeader />
        <Text style={{ color: colors.gold, fontWeight: "800", letterSpacing: 1.4 }}>PREMIUM TRAVEL MONEY</Text>
        <Text style={{ color: colors.slate, marginTop: 14, lineHeight: 22 }}>Secure forex, card, buyback and insurance requests for Delhi NCR travellers.</Text>
      </View>
    </ScreenShell>
  );
}

export function OnboardingScreen({ go }: Nav) {
  return (
    <ScreenShell>
      <LogoHeader />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 30, fontWeight: "900", lineHeight: 36 }}>Travel money without the chase.</Text>
        <Text style={{ color: colors.slate, marginTop: 14, lineHeight: 23 }}>CurrencyKart helps travellers, students, families and businesses request forex, travel cards, currency buyback and insurance assistance with KYC-first partner fulfilment.</Text>
        <Button label="Login with mobile OTP" onPress={() => go("login")} />
        <Button label="Create account" variant="ghost" onPress={() => go("register")} />
      </Card>
      <Text style={{ color: colors.slate, marginTop: 16, fontSize: 12 }}>Staging API: {apiBaseUrl}</Text>
    </ScreenShell>
  );
}

export function LoginScreen({ go }: Nav) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  async function startOtp() {
    if (phone.trim().length < 10) return setMessage("Enter a valid mobile number.");
    setLoading(true);
    setMessage("");
    try {
      const challenge = await requestOtp(phone.trim());
      go("otp", { id: challenge.challengeId, orderNumber: phone.trim(), type: "BUY_FOREX", currencyCode: "INR", amount: 0, status: "OTP_PENDING" });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "OTP request failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Login</Text>
        <Field label="Mobile number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+91 mobile number" />
        {message ? <Status state="error" message={message} /> : null}
        {loading ? <Status state="loading" message="Requesting OTP..." /> : null}
        <Button label="Request OTP" onPress={startOtp} disabled={loading} />
        <Button label="Use staging placeholder session" variant="ghost" onPress={async () => { await saveSession({ token: "staging-placeholder-session", phone, createdAt: new Date().toISOString(), stagingPlaceholder: true }); go("home"); }} />
      </Card>
    </ScreenShell>
  );
}

export function RegisterScreen({ go }: Nav) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit() {
    if (!form.email.includes("@") || form.password.length < 12 || form.name.length < 2 || form.phone.length < 10) {
      setState("error");
      return setMessage("Enter name, valid email, mobile and a 12+ character password.");
    }
    setState("loading");
    try {
      await registerCustomer(form);
      setState("success");
      setMessage("Account created. Continue with OTP login.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Registration failed.");
    }
  }
  return (
    <ScreenShell>
      <LogoHeader compact />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Card>
          <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Register</Text>
          <Field label="Full name" value={form.name} onChangeText={(name) => setForm({ ...form, name })} />
          <Field label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} keyboardType="email-address" />
          <Field label="Mobile" value={form.phone} onChangeText={(phone) => setForm({ ...form, phone })} keyboardType="phone-pad" />
          <Field label="Password" value={form.password} onChangeText={(password) => setForm({ ...form, password })} secureTextEntry />
          {state !== "idle" ? <Status state={state === "loading" ? "loading" : state} message={message || "Working..."} /> : null}
          <Button label="Create account" onPress={submit} disabled={state === "loading"} />
          <Button label="Back to login" variant="ghost" onPress={() => go("login")} />
        </Card>
      </ScrollView>
    </ScreenShell>
  );
}

export function OtpScreen({ route, go }: Nav) {
  const phone = route.selectedOrder?.orderNumber ?? "";
  const challengeId = route.selectedOrder?.id ?? "";
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  async function submit() {
    if (code.length !== 6) return setMessage("Enter the 6-digit OTP.");
    try {
      await verifyOtp(phone, code, challengeId);
      await saveSession({ token: challengeId, phone, createdAt: new Date().toISOString(), stagingPlaceholder: true });
      go("home");
    } catch (error) {
      setMessage(error instanceof Error ? `${error.message} You may use staging placeholder session.` : "OTP failed.");
    }
  }
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Verify OTP</Text>
        <Text style={{ color: colors.slate, marginTop: 8 }}>OTP sent to {phone}</Text>
        <Field label="OTP" value={code} onChangeText={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))} keyboardType="numeric" placeholder="6-digit code" />
        {message ? <Status state="error" message={message} /> : null}
        <Button label="Verify and continue" onPress={submit} />
        <Button label="Continue with staging placeholder" variant="ghost" onPress={async () => { await saveSession({ token: "staging-placeholder-session", phone, createdAt: new Date().toISOString(), stagingPlaceholder: true }); go("home"); }} />
        <Button label="Back to login" variant="ghost" onPress={() => go("login")} />
      </Card>
    </ScreenShell>
  );
}

export function HomeScreen({ go }: Nav) {
  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LogoHeader />
        <Card>
          <Text style={{ color: colors.navy, fontSize: 26, fontWeight: "900" }}>Customer app MVP</Text>
          <Text style={{ color: colors.slate, marginTop: 10, lineHeight: 22 }}>Request forex, cards, travel insurance and buyback support with secure KYC-first workflows.</Text>
        </Card>
        <NavGrid go={go} />
        <Button label="Profile" variant="ghost" onPress={() => go("profile")} />
      </ScrollView>
    </ScreenShell>
  );
}

export function CalculatorScreen({ go }: Nav) {
  const [amount, setAmount] = useState("1000");
  const [currency, setCurrency] = useState("USD");
  const rates: Record<string, number> = { USD: 84.95, EUR: 91.8, GBP: 108.6, AED: 23.35, SGD: 62.9 };
  const total = useMemo(() => (Number(amount) || 0) * (rates[currency] ?? 1), [amount, currency]);
  return (
    <ScreenShell>
      <ScrollView>
        <LogoHeader compact />
        <Card>
          <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Currency calculator</Text>
          <Field label="Currency" value={currency} onChangeText={(value) => setCurrency(value.toUpperCase().slice(0, 3))} />
          <Field label="Foreign amount" value={amount} onChangeText={setAmount} keyboardType="numeric" />
          <View style={{ backgroundColor: colors.navy, borderRadius: 16, padding: 18, marginTop: 16 }}>
            <Text style={{ color: "#BBD4DD" }}>Estimated INR payable</Text>
            <Text style={{ color: colors.white, fontSize: 28, fontWeight: "900", marginTop: 8 }}>INR {total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</Text>
            <Text style={{ color: colors.gold, marginTop: 6 }}>Indicative. Final rate after KYC and rate lock.</Text>
          </View>
          <Button label="Buy forex with this estimate" onPress={() => go("buy")} />
          <Button label="Back home" variant="ghost" onPress={() => go("home")} />
        </Card>
      </ScrollView>
    </ScreenShell>
  );
}

function OrderForm({ go, type, title }: Nav & { type: OrderType; title: string }) {
  const [form, setForm] = useState({ currencyCode: "USD", amount: "1000", purpose: "Holiday travel", destinationCountry: "", travelDate: "", deliveryAddress: "" });
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  async function submit() {
    if (!form.currencyCode || Number(form.amount) <= 0 || form.purpose.length < 2) {
      setState("error");
      return setMessage("Currency, amount and purpose are required.");
    }
    setState("loading");
    try {
      await submitOrder({ ...form, type, amount: Number(form.amount) });
      setState("success");
      setMessage("Request submitted to the staging backend.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? `${error.message} Backend mobile session may need token support.` : "Order submission failed.");
    }
  }
  return (
    <ScreenShell>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LogoHeader compact />
        <Card>
          <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>{title}</Text>
          <Field label="Currency code" value={form.currencyCode} onChangeText={(currencyCode) => setForm({ ...form, currencyCode: currencyCode.toUpperCase().slice(0, 3) })} />
          <Field label="Amount" value={form.amount} onChangeText={(amount) => setForm({ ...form, amount })} keyboardType="numeric" />
          <Field label="Purpose" value={form.purpose} onChangeText={(purpose) => setForm({ ...form, purpose })} />
          <Field label="Destination country" value={form.destinationCountry} onChangeText={(destinationCountry) => setForm({ ...form, destinationCountry })} />
          <Field label="Travel date" value={form.travelDate} onChangeText={(travelDate) => setForm({ ...form, travelDate })} placeholder="YYYY-MM-DD" />
          <Field label="Delivery / pickup address" value={form.deliveryAddress} onChangeText={(deliveryAddress) => setForm({ ...form, deliveryAddress })} />
          {state !== "idle" ? <Status state={state === "loading" ? "loading" : state} message={message || "Working..."} /> : null}
          <Button label="Submit request" onPress={submit} disabled={state === "loading"} />
          <Button label="Back home" variant="ghost" onPress={() => go("home")} />
        </Card>
      </ScrollView>
    </ScreenShell>
  );
}

export function BuyForexScreen(props: Nav) { return <OrderForm {...props} type="BUY_FOREX" title="Buy forex request" />; }
export function SellForexScreen(props: Nav) { return <OrderForm {...props} type="SELL_FOREX" title="Sell forex request" />; }
export function ForexCardScreen(props: Nav) { return <OrderForm {...props} type="FOREX_CARD" title="Forex card request" />; }

export function InsuranceScreen({ go }: Nav) {
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Travel insurance request</Text>
        <Text style={{ color: colors.slate, marginTop: 10, lineHeight: 22 }}>Staging MVP captures insurance interest through support. Full partner quote integration remains a later backend workflow.</Text>
        <Button label="WhatsApp support" onPress={() => go("support")} />
        <Button label="Back home" variant="ghost" onPress={() => go("home")} />
      </Card>
    </ScreenShell>
  );
}

export function OrdersScreen({ go }: Nav) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [state, setState] = useState<"loading" | "success" | "error" | "empty">("loading");
  const [message, setMessage] = useState("Loading orders...");
  useEffect(() => {
    getOrders()
      .then((payload) => {
        const next = payload.orders as Order[];
        setOrders(next);
        setState(next.length ? "success" : "empty");
        setMessage(next.length ? "Orders loaded." : "No orders found yet.");
      })
      .catch((error) => {
        setState("error");
        setMessage(error instanceof Error ? `${error.message} Showing staging placeholder orders.` : "Could not load orders.");
        setOrders([{ id: "demo-order", orderNumber: "CKFX-DEMO-001", type: "BUY_FOREX", currencyCode: "USD", amount: 1000, status: "KYC_PENDING", events: [{ id: "1", title: "Order submitted" }, { id: "2", title: "KYC review pending" }] }]);
      });
  }, []);
  return (
    <ScreenShell>
      <ScrollView>
        <LogoHeader compact />
        <Status state={state} message={message} />
        {orders.map((order) => (
          <Pressable key={order.id} onPress={() => go("orderDetail", order)} style={{ marginTop: 12 }}>
            <Card>
              <Text style={{ color: colors.navy, fontWeight: "900" }}>{order.orderNumber}</Text>
              <Text style={{ color: colors.slate, marginTop: 8 }}>{order.type} | {order.currencyCode} {String(order.amount)}</Text>
              <Text style={{ color: colors.teal, marginTop: 8, fontWeight: "800" }}>{order.status}</Text>
            </Card>
          </Pressable>
        ))}
        <Button label="Back home" variant="ghost" onPress={() => go("home")} />
      </ScrollView>
    </ScreenShell>
  );
}

export function OrderDetailScreen({ route, go }: Nav) {
  const selected = route.selectedOrder;
  const [order, setOrder] = useState<Order | undefined>(selected);
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!selected?.id || selected.id === "demo-order") return;
    getOrder(selected.id).then((payload) => setOrder(payload.order as Order)).catch((error) => setMessage(error instanceof Error ? error.message : "Could not refresh order."));
  }, [selected?.id]);
  return (
    <ScreenShell>
      <ScrollView>
        <LogoHeader compact />
        <Card>
          <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>{order?.orderNumber ?? "Order detail"}</Text>
          <Text style={{ color: colors.slate, marginTop: 8 }}>{order?.type} | {order?.currencyCode} {String(order?.amount ?? "")}</Text>
          {message ? <Status state="error" message={message} /> : null}
          <Text style={{ color: colors.navy, fontWeight: "900", marginTop: 18 }}>Timeline</Text>
          {(order?.events?.length ? order.events : [{ id: "submitted", title: "Order submitted" }, { id: "review", title: "KYC and document review" }, { id: "rate", title: "Rate lock / payment review" }]).map((event) => (
            <View key={event.id} style={{ borderLeftWidth: 3, borderLeftColor: colors.teal, paddingLeft: 12, marginTop: 14 }}>
              <Text style={{ color: colors.navy, fontWeight: "800" }}>{event.title}</Text>
              <Text style={{ color: colors.slate, marginTop: 4 }}>{event.message ?? event.createdAt ?? "Status will update from the backend."}</Text>
            </View>
          ))}
          <Button label="Upload KYC document" onPress={() => go("kyc", order)} />
          <Button label="Back to orders" variant="ghost" onPress={() => go("orders")} />
        </Card>
      </ScrollView>
    </ScreenShell>
  );
}

export function KycScreen({ route, go }: Nav) {
  const [message, setMessage] = useState("No file selected.");
  async function pick() {
    const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: false });
    if (result.canceled) return setMessage("Upload cancelled.");
    const file = result.assets[0];
    setMessage(`Selected ${file.name}. Upload URL request is placeholder-only for staging.`);
    try {
      await requestUploadPlaceholder({ type: "OTHER", fileName: file.name, mimeType: file.mimeType ?? "application/octet-stream", size: file.size ?? 1, orderId: route.selectedOrder?.id });
      setMessage(`Upload placeholder prepared for ${file.name}.`);
    } catch {
      setMessage(`Selected ${file.name}. Backend upload requires authenticated web session or mobile token support.`);
    }
  }
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>KYC / document upload</Text>
        <Text style={{ color: colors.slate, marginTop: 10, lineHeight: 22 }}>Do not store PAN, passport, visa or ticket details locally. This MVP only stores session state in secure storage.</Text>
        <Status state="empty" message={message} />
        <Button label="Choose document" onPress={pick} />
        <Button label="Back home" variant="ghost" onPress={() => go("home")} />
      </Card>
    </ScreenShell>
  );
}

export function ProfileScreen({ go }: Nav) {
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Profile</Text>
        <Text style={{ color: colors.slate, marginTop: 10 }}>Customer profile, saved contact and KYC status summary will connect to mobile-ready backend endpoints later.</Text>
        <Button label="Back home" onPress={() => go("home")} />
      </Card>
    </ScreenShell>
  );
}

export function SupportScreen({ go }: Nav) {
  return (
    <ScreenShell>
      <LogoHeader compact />
      <Card>
        <Text style={{ color: colors.navy, fontSize: 24, fontWeight: "900" }}>Support</Text>
        <Text style={{ color: colors.slate, marginTop: 10, lineHeight: 22 }}>Contact the CurrencyKart support desk for order, KYC, serviceability and travel-money assistance.</Text>
        <Button label="Open WhatsApp" variant="gold" onPress={() => Linking.openURL("https://wa.me/919811122222")} />
        <Button label="Email support" variant="ghost" onPress={() => Linking.openURL("mailto:support@currencykart.in")} />
        <Button label="Back home" variant="ghost" onPress={() => go("home")} />
      </Card>
    </ScreenShell>
  );
}
