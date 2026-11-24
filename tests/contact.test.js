import test from "node:test";
import assert from "node:assert/strict";
import { sendMessage, functionRequest } from "../src/contact.js";

const message = {
  name: "Alex",
  email: "alex@example.com",
  subject: "An app project",
  message: "Let’s work together.",
};

test("sends the existing EmailJS template fields", async () => {
  let request;
  await sendMessage(message, async (url, options) => {
    request = { url, ...JSON.parse(options.body) };
    return { ok: true };
  });
  assert.equal(request.url, "https://api.emailjs.com/api/v1.0/email/send");
  assert.deepEqual(request.template_params, {
    user_name: message.name,
    user_email: message.email,
    user_subject: message.subject,
    user_message: message.message,
  });
});

test("rejects unsuccessful responses instead of claiming success", async () => {
  await assert.rejects(
    sendMessage(message, async () => ({ ok: false, status: 429 })),
    /couldn’t send/i,
  );
});

test("propagates connection failures so the form can retain the message", async () => {
  await assert.rejects(
    sendMessage(message, async () => {
      throw new Error("Offline");
    }),
    /Offline/,
  );
});

test("function proxy reports false when the function is not deployed", async () => {
  const urls = [];
  const result = await functionRequest(message, async (url) => {
    urls.push(url);
    return { ok: false, status: 404 };
  });
  assert.equal(result, false);
  assert.deepEqual(urls, ["/.netlify/functions/contact"]);
});

test("function proxy accepts a confirmed delivery", async () => {
  const result = await functionRequest(message, async () => ({
    ok: true,
    json: async () => ({ ok: true }),
  }));
  assert.equal(result, true);
});

test("function proxy rejects unexpected payloads so delivery falls back", async () => {
  const result = await functionRequest(message, async () => ({
    ok: true,
    json: async () => null,
  }));
  assert.equal(result, false);
});

test("function proxy raises on upstream failures so the form keeps the message", async () => {
  await assert.rejects(
    functionRequest(message, async () => ({ ok: false, status: 429 })),
    /couldn’t send/i,
  );
});
