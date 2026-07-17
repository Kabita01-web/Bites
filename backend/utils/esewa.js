import crypto from "node:crypto";
import axios from "axios";

// -----------------------------------------------------------------------
// Based on eSewa's ePay v2 integration pattern (form-redirect + HMAC-SHA256
// signature). I've cross-checked this against several independent
// integration write-ups and it's consistent across all of them, but I
// can't guarantee it matches eSewa's official docs to the letter — please
// verify against https://developer.esewa.com.np before relying on this
// in production, and test thoroughly in UAT first.
// -----------------------------------------------------------------------

// UAT (test) values, per eSewa's published test credentials:
//   ESEWA_PRODUCT_CODE = "EPAYTEST"
//   ESEWA_SECRET_KEY   = "8gBm/:&EnhH.1/q"
// Swap both for your real merchant credentials in production.

/**
 * Generates the HMAC-SHA256 signature eSewa requires on the payment form.
 * The canonical message string MUST be built in exactly this field order:
 *   total_amount=<amount>,transaction_uuid=<uuid>,product_code=<code>
 * with no extra spaces — eSewa's docs are strict about this exact format.
 */
export const generateEsewaSignature = ({
  totalAmount,
  transactionUuid,
  productCode,
}) => {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  const signature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  return {
    signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
  };
};

/**
 * Verifies a signature by recomputing it from the same fields and doing a
 * timing-safe comparison. Use this both for our own outgoing form (sanity
 * check) and for validating eSewa's callback payload.
 */
export const verifyEsewaSignature = ({
  totalAmount,
  transactionUuid,
  productCode,
  signature,
}) => {
  const { signature: expected } = generateEsewaSignature({
    totalAmount,
    transactionUuid,
    productCode,
  });

  const a = Buffer.from(expected);
  const b = Buffer.from(signature || "");

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
};

/**
 * Decodes the base64 `data` query parameter eSewa appends to success_url.
 * Returns the parsed JSON object, which (per the sources I checked)
 * typically includes: transaction_code, status, total_amount,
 * transaction_uuid, product_code, signed_field_names, signature.
 */
export const decodeEsewaCallbackData = (encodedData) => {
  const decoded = Buffer.from(encodedData, "base64").toString("utf-8");
  return JSON.parse(decoded);
};

/**
 * Calls eSewa's transaction status-check API as a second, server-to-server
 * confirmation on top of signature verification (defense in depth — don't
 * rely on the callback alone, since a callback URL could in theory be hit
 * directly without a real payment).
 */
export const checkEsewaTransactionStatus = async ({
  totalAmount,
  transactionUuid,
  productCode,
}) => {
  const baseUrl =
    process.env.ESEWA_STATUS_CHECK_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://epay.esewa.com.np/api/epay/transaction/status/"
      : "https://rc-epay.esewa.com.np/api/epay/transaction/status/");

  const { data } = await axios.get(baseUrl, {
    params: {
      product_code: productCode,
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
    },
  });

  // Expected shape (per published examples): { product_code, transaction_uuid,
  // total_amount, status, ref_id }. status is typically one of:
  // COMPLETE, PENDING, FULL_REFUND, PARTIAL_REFUND, AMBIGUOUS, NOT_FOUND, CANCELED
  return data;
};

/**
 * Generates a unique merchant order id in the format
 * BITES-ORDER-{timestamp}-{random}, used as eSewa's `transaction_uuid`.
 */
export const generateMerchantOrderId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `BITES-ORDER-${timestamp}-${random}`;
};
