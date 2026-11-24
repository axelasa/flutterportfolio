import test from "node:test";
import assert from "node:assert/strict";
import { projectStore } from "../src/project-store.js";

const project = {
  app: "com.craftmyskin.craftmyskin",
  appStore: "https://apps.apple.com/us/app/craftmyskin/id6764001837",
};

for (const userAgent of [
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
  "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
  "Mozilla/5.0 (iPod touch; CPU iPhone OS 18_0 like Mac OS X)",
]) {
  test(`selects App Store for ${userAgent}`, () => {
    assert.deepEqual(projectStore(project, { userAgent }), {
      name: "App Store",
      url: project.appStore,
    });
  });
}

test("recognizes iPad desktop browsing mode", () => {
  assert.equal(
    projectStore(project, {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
      platform: "MacIntel",
      maxTouchPoints: 5,
    }).name,
    "App Store",
  );
});

for (const device of [
  { userAgent: "Mozilla/5.0 (Linux; Android 15)" },
  { userAgent: "Mozilla/5.0 (Windows NT 10.0)" },
  {
    userAgent: "Mozilla/5.0 (Macintosh)",
    platform: "MacIntel",
    maxTouchPoints: 0,
  },
]) {
  test(`preserves Google Play for ${device.userAgent}`, () => {
    assert.deepEqual(projectStore(project, device), {
      name: "Google Play",
      url: "https://play.google.com/store/apps/details?id=com.craftmyskin.craftmyskin",
    });
  });
}

test("uses Google Play when an Apple link is not provided", () => {
  assert.equal(
    projectStore({ app: "other.app" }, { userAgent: "iPhone" }).url,
    "https://play.google.com/store/apps/details?id=other.app",
  );
});

test("preserves explicit URLs and handles missing browser information", () => {
  assert.equal(
    projectStore({ url: "https://example.com/app" }, undefined).url,
    "https://example.com/app",
  );
});

test("links web projects to their live site", () => {
  assert.deepEqual(
    projectStore({ website: "https://cougarsrfc.com" }, { userAgent: "iPhone" }),
    { name: "cougarsrfc.com", url: "https://cougarsrfc.com" },
  );
});
