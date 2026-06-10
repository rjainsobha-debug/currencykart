import { useCallback, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  BuyForexScreen,
  CalculatorScreen,
  ForexCardScreen,
  HomeScreen,
  InsuranceScreen,
  KycScreen,
  LoginScreen,
  OnboardingScreen,
  OrderDetailScreen,
  OrdersScreen,
  OtpScreen,
  ProfileScreen,
  RegisterScreen,
  SellForexScreen,
  SplashScreen,
  SupportScreen
} from "./src/screens";
import type { Order, RouteState, Screen } from "./src/types";

export default function App() {
  const [route, setRoute] = useState<RouteState>({ screen: "splash" });
  const go = useCallback((screen: Screen, selectedOrder?: Order) => setRoute({ screen, selectedOrder }), []);
  const props = { route, go };

  return (
    <>
      <StatusBar style={route.screen === "splash" ? "light" : "dark"} />
      {route.screen === "splash" ? <SplashScreen {...props} /> : null}
      {route.screen === "onboarding" ? <OnboardingScreen {...props} /> : null}
      {route.screen === "login" ? <LoginScreen {...props} /> : null}
      {route.screen === "register" ? <RegisterScreen {...props} /> : null}
      {route.screen === "otp" ? <OtpScreen {...props} /> : null}
      {route.screen === "home" ? <HomeScreen {...props} /> : null}
      {route.screen === "calculator" ? <CalculatorScreen {...props} /> : null}
      {route.screen === "buy" ? <BuyForexScreen {...props} /> : null}
      {route.screen === "sell" ? <SellForexScreen {...props} /> : null}
      {route.screen === "card" ? <ForexCardScreen {...props} /> : null}
      {route.screen === "insurance" ? <InsuranceScreen {...props} /> : null}
      {route.screen === "orders" ? <OrdersScreen {...props} /> : null}
      {route.screen === "orderDetail" ? <OrderDetailScreen {...props} /> : null}
      {route.screen === "kyc" ? <KycScreen {...props} /> : null}
      {route.screen === "profile" ? <ProfileScreen {...props} /> : null}
      {route.screen === "support" ? <SupportScreen {...props} /> : null}
    </>
  );
}
