export type ChecklistDocument = {
  type: "PAN" | "PASSPORT" | "VISA" | "TICKET" | "ADDRESS_PROOF" | "OTHER";
  label: string;
  required: boolean;
  reason: string;
};

export function getDocumentChecklist(orderType: string, purpose: string): ChecklistDocument[] {
  const normalizedPurpose = purpose.toLowerCase();
  const checklist: ChecklistDocument[] = [
    { type: "PAN", label: "PAN card", required: true, reason: "Identity and transaction verification" },
    { type: "ADDRESS_PROOF", label: "Current address proof", required: true, reason: "KYC and service-address verification" }
  ];

  if (orderType !== "SELL_FOREX") {
    checklist.push(
      { type: "PASSPORT", label: "Valid passport", required: true, reason: "International travel verification" },
      { type: "TICKET", label: "Confirmed air ticket", required: true, reason: "Travel-date and destination verification" }
    );
  }

  if (orderType === "SELL_FOREX") {
    checklist.push({ type: "PASSPORT", label: "Passport travel pages", required: true, reason: "Recent travel and currency-source review" });
  }

  if (orderType === "FOREX_CARD" || orderType === "CARD_RELOAD") {
    checklist.push({ type: "VISA", label: "Visa, where applicable", required: false, reason: "Partner card issuance or reload review" });
  }

  if (normalizedPurpose.includes("student") || normalizedPurpose.includes("study") || normalizedPurpose.includes("education")) {
    checklist.push({ type: "OTHER", label: "University offer or enrolment letter", required: true, reason: "Education-purpose verification" });
  }

  if (normalizedPurpose.includes("business") || normalizedPurpose.includes("corporate")) {
    checklist.push({ type: "OTHER", label: "Employer travel letter", required: true, reason: "Business travel-purpose verification" });
  }

  if (normalizedPurpose.includes("medical")) {
    checklist.push({ type: "OTHER", label: "Hospital appointment or medical estimate", required: true, reason: "Medical travel-purpose verification" });
  }

  return checklist;
}
