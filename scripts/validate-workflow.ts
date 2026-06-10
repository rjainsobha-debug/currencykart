import assert from "node:assert/strict";
import { OrderStatus } from "@prisma/client";
import { assertOrderTransition, createInvoiceNumber, isRateLockActive } from "../lib/order-workflow";
import { getDocumentChecklist } from "../lib/document-checklist";
import { createAdminTwoFactorToken, verifyAdminTwoFactorToken } from "../lib/admin-2fa";

assert.doesNotThrow(() => assertOrderTransition(OrderStatus.DRAFT, OrderStatus.SUBMITTED));
assert.doesNotThrow(() => assertOrderTransition(OrderStatus.KYC_APPROVED, OrderStatus.RATE_LOCKED));
assert.throws(() => assertOrderTransition(OrderStatus.DRAFT, OrderStatus.COMPLETED));
assert.equal(isRateLockActive(new Date(Date.now() + 60_000)), true);
assert.equal(isRateLockActive(new Date(Date.now() - 60_000)), false);
assert.match(createInvoiceNumber("CKFX-20260606-ABC123"), /^INV-\d{4}-ABC123$/);
assert.equal(getDocumentChecklist("BUY_FOREX", "Student education").some((item) => item.label.includes("University")), true);
assert.equal(getDocumentChecklist("SELL_FOREX", "Returned from holiday").some((item) => item.type === "PASSPORT"), true);
const twoFactorToken = createAdminTwoFactorToken("admin-test", 60);
assert.equal(verifyAdminTwoFactorToken(twoFactorToken.value, "admin-test"), true);
assert.equal(verifyAdminTwoFactorToken(twoFactorToken.value, "another-admin"), false);

console.log("Workflow validation passed.");
