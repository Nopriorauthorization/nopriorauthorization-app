import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

function base64UrlEncode(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function sign(input, secret) {
  return base64UrlEncode(
    crypto.createHmac("sha256", secret).update(input).digest()
  );
}

function issueToken({ productSlug, buyerEmail, orderRef, expiresInDays, secret }) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + expiresInDays * 24 * 60 * 60;
  const payload = {
    productSlug,
    buyerEmail,
    orderRef: orderRef || undefined,
    issuedAt,
    expiresAt,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, secret)}`;
}

function usage() {
  console.log(
    "Usage: node scripts/issue-delivery-link.mjs <productSlug> <buyerEmail> [orderRef]"
  );
}

const [, , productSlug, buyerEmail, orderRef] = process.argv;
if (!productSlug || !buyerEmail) {
  usage();
  process.exit(1);
}

const secret = process.env.DELIVERY_TOKEN_SECRET || process.env.NEXTAUTH_SECRET;
if (!secret) {
  console.error("Missing DELIVERY_TOKEN_SECRET or NEXTAUTH_SECRET");
  process.exit(1);
}

const baseUrl =
  process.env.NEXTAUTH_URL || "https://nopriorauthorization.com";
const token = issueToken({
  productSlug,
  buyerEmail,
  orderRef,
  expiresInDays: 30,
  secret,
});

console.log(`${baseUrl.replace(/\/$/, "")}/delivery/${token}`);
