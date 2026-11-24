// Contact delivery. In production builds the message goes through the
// Netlify Function (netlify/functions/contact.mjs), which keeps the EmailJS
// key server-side and adds rate limiting. When the function is not deployed
// or not configured, or when running in dev, the request falls back to
// calling EmailJS directly so inquiries are never lost.

const FUNCTION_ENDPOINT = "/.netlify/functions/contact";
const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

function directRequest(values, request) {
  return request(EMAILJS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    signal: AbortSignal.timeout(15000),
    body: JSON.stringify({
      service_id: "service_pcasi2i",
      template_id: "template_xdu0ukg",
      user_id: "WAO4wGj4STwDt2c8r",
      template_params: {
        user_name: values.name,
        user_email: values.email,
        user_subject: values.subject,
        user_message: values.message,
      },
    }),
  });
}

// Returns true when the function confirmed delivery, false when the caller
// should fall back to the direct request, and throws on real failures.
export async function functionRequest(values, request) {
  let response;
  try {
    response = await request(FUNCTION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify(values),
    });
  } catch {
    return false; // Function not reachable (static host, offline edge).
  }
  if (response.status === 404 || response.status === 501) return false;
  if (!response.ok)
    throw new Error(
      "Your message couldn’t send. Please try again or connect with me on LinkedIn.",
    );
  const data = await response.json().catch(() => null);
  return data?.ok === true;
}

export async function sendMessage(
  { name, email, subject, message },
  request = fetch,
) {
  const values = { name, email, subject, message };
  if (import.meta.env?.PROD) {
    const delivered = await functionRequest(values, request);
    if (delivered) return;
  }
  const response = await directRequest(values, request);
  if (!response.ok)
    throw new Error(
      "Your message couldn’t send. Please try again or connect with me on LinkedIn.",
    );
}
