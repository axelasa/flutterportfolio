import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Entrance animations fade text in; wait for them so axe measures final colours.
const settle = (page) =>
  page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (a) =>
            a.timeline instanceof DocumentTimeline &&
            a.effect.getTiming().iterations !== Infinity,
        )
        .map((a) => a.finished),
    ),
  );

for (const device of [
  {
    name: "iPhone",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
    store: "App Store",
  },
  {
    name: "iPad desktop mode",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15)",
    platform: "MacIntel",
    maxTouchPoints: 5,
    store: "App Store",
  },
  {
    name: "Android",
    userAgent: "Mozilla/5.0 (Linux; Android 15)",
    store: "Google Play",
  },
]) {
  test(`store links select the correct destination on ${device.name}`, async ({
    page,
  }) => {
    await page.addInitScript((device) => {
      Object.defineProperty(navigator, "userAgent", {
        get: () => device.userAgent,
      });
      if (device.platform)
        Object.defineProperty(navigator, "platform", {
          get: () => device.platform,
        });
      if (device.maxTouchPoints)
        Object.defineProperty(navigator, "maxTouchPoints", {
          get: () => device.maxTouchPoints,
        });
    }, device);
    await page.goto("/");
    for (const project of [
      {
        name: "CraftMySkin",
        apple: "https://apps.apple.com/us/app/craftmyskin/id6764001837",
        google:
          "https://play.google.com/store/apps/details?id=com.craftmyskin.craftmyskin",
      },
      {
        name: "LCT Africa",
        apple: "https://apps.apple.com/us/app/lct-africa/id1641866282",
        google: "https://play.google.com/store/apps/details?id=net.lctafrica",
      },
    ]) {
      const url = device.store === "App Store" ? project.apple : project.google;
      const card = page.locator(".project").filter({
        has: page.getByRole("heading", { name: project.name, exact: true }),
      });
      await expect(
        card.getByRole("link", { name: `View on ${device.store}` }),
      ).toHaveAttribute("href", url);
      await card
        .getByRole("button", { name: `Read the ${project.name} case study` })
        .click();
      await expect(
        page
          .getByRole("dialog")
          .getByRole("link", { name: `View on ${device.store}` }),
      ).toHaveAttribute("href", url);
      await page.keyboard.press("Escape");
    }
  });
}

test("defaults to dark mode, remembers light mode, and filters the real projects", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
    "content",
    "#f5f3ec",
  );
  await expect(page.locator(".project")).toHaveCount(5);
  await page.getByRole("button", { name: "Healthcare" }).click();
  await expect(page.locator(".project")).toHaveCount(2);
  await expect(page.getByRole("heading", { name: "My1Health" })).toBeVisible();
  await page.getByRole("button", { name: "Beauty" }).click();
  await expect(page.locator(".project")).toHaveCount(1);
  await expect(
    page.getByRole("heading", { name: "CraftMySkin" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".project")).toHaveCount(5);
});

for (const width of [280, 320, 375, 600, 768, 1024, 1440, 2560]) {
  test(`fits ${width}px in both themes without horizontal overflow`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const theme of ["dark", "light"]) {
      await page.locator("html").evaluate((html, value) => {
        html.dataset.theme = value;
      }, theme);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Send message" }),
      ).toBeEnabled();
      await page.locator(".project img").evaluateAll((imgs) =>
        imgs.forEach((img) => {
          img.loading = "eager";
        }),
      );
      await expect
        .poll(() =>
          page
            .locator(".project img")
            .evaluateAll((imgs) =>
              imgs.every((img) => img.complete && img.naturalWidth > 0),
            ),
        )
        .toBe(true);
    }
  });
}

test("mobile menu navigates, closes, and supports Escape", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await expect(page.getByRole("navigation")).toBeHidden();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByRole("navigation")).toBeVisible();
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.getByRole("navigation")).toBeHidden();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("navigation")).toBeHidden();
});

async function fillContact(page) {
  await page
    .getByLabel("Your name", { exact: true })
    .fill("A potential client");
  await page.getByLabel("Email address").fill("client@example.com");
  await page
    .getByLabel("A little about your project")
    .fill("I would like to discuss building an application.");
}

test("contact validates required fields, retains failed messages, and clears only after success", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Send message" }).click();
  expect(
    await page
      .getByLabel("Your name", { exact: true })
      .evaluate((input) => input.validity.valueMissing),
  ).toBe(true);
  await fillContact(page);
  await page.route("https://api.emailjs.com/**", (route) =>
    route.fulfill({ status: 429, body: "Rate limited" }),
  );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText("Your message couldn’t send.", { exact: false }),
  ).toBeVisible();
  await expect(page.getByLabel("A little about your project")).toHaveValue(
    "I would like to discuss building an application.",
  );
  await page.route("https://api.emailjs.com/**", (route) =>
    route.fulfill({ status: 200, body: "OK" }),
  );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText(
      "Thanks, your message is in. I’ll get back to you within 24 hours.",
    ),
  ).toBeVisible();
  await expect(page.getByLabel("A little about your project")).toHaveValue("");
});

test("has no runtime errors and respects reduced motion", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page
      .locator("html")
      .evaluate((html) => getComputedStyle(html).scrollBehavior),
  ).toBe("auto");
  expect(errors).toEqual([]);
  expect(await page.locator("body").innerText()).not.toContain("—");
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('16px "DM Sans Variable"')),
  ).toBe(true);
});

test("intermediate widths and landscape heights keep content within the viewport", async ({
  page,
}) => {
  await page.goto("/");
  for (let width = 280; width <= 2560; width += 40) {
    await page.setViewportSize({ width, height: 500 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      `overflow at ${width}px`,
    ).toBe(true);
  }
});

test("has no automatic WCAG AA accessibility violations in either theme", async ({
  page,
}) => {
  await page.goto("/");
  for (const theme of ["dark", "light"]) {
    await page.locator("html").evaluate((html, value) => {
      html.dataset.theme = value;
    }, theme);
    await settle(page);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("case study dialog opens, closes, and routes interest to the form", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Read the Capital FM case study" })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Capital FM" }),
  ).toBeVisible();
  await expect(dialog.getByText("The problem")).toBeVisible();
  await expect(dialog.getByText("New release on Google Play")).toBeVisible();
  await expect(
    dialog.getByRole("link", { name: "View on Google Play" }),
  ).toBeVisible();
  await expect(page).toHaveURL(/#case-capital-fm$/);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page).not.toHaveURL(/#case-/);
  await page
    .getByRole("button", { name: "Read the LCT Africa case study" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /Want an app like this/ })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Mobile app", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("opens a deep-linked case study from the URL hash", async ({ page }) => {
  await page.goto("/#case-my1health");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("dialog").getByRole("heading", { name: "My1Health" }),
  ).toBeVisible();
});

test("offers direct lead channels, a sticky CTA, and a WhatsApp shortcut", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const sticky = page.locator(".sticky-cta");
  await expect(sticky).toBeVisible();
  await expect(
    sticky.getByRole("link", { name: "Start your project" }),
  ).toHaveAttribute("href", "#contact");
  await expect(
    sticky.getByRole("link", { name: "Chat on WhatsApp" }),
  ).toHaveAttribute("href", /^https:\/\/wa\.me\//);
  await expect(page.locator(".wa-pill")).toBeHidden();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await expect(page.locator(".sticky-cta")).toBeHidden();
  await expect(
    page.locator(".wa-pill").getByRole("link", { name: "WhatsApp me" }),
  ).toBeVisible();
  await page.goto("/#contact");
  await expect(page.locator(".sticky-cta")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Book a call" }).first(),
  ).toHaveAttribute("href", "https://cal.com/axel-asa-vakuh1");
});

test("chip selections compose the inquiry and success offers next steps", async ({
  page,
}) => {
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Mobile app", exact: true }).click();
  await page.getByRole("button", { name: "$2k to $5k", exact: true }).click();
  await fillContact(page);
  let sent;
  await page.route("https://api.emailjs.com/**", async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({ status: 200, body: "OK" });
  });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText(
      "Thanks, your message is in. I’ll get back to you within 24 hours.",
    ),
  ).toBeVisible();
  expect(sent.template_params.user_subject).toContain("Mobile app");
  expect(sent.template_params.user_subject).toContain("$2k to $5k");
  const next = page.locator(".success-next");
  await expect(next.getByRole("link", { name: "Book a call" })).toHaveAttribute(
    "href",
    "https://cal.com/axel-asa-vakuh1",
  );
  await expect(
    next.getByRole("link", { name: "Chat on WhatsApp" }),
  ).toHaveAttribute("href", /^https:\/\/wa\.me\//);
});

test("FAQ entries expand and answer cost questions", async ({ page }) => {
  await page.goto("/#faq");
  const first = page.locator(".faq-item").first();
  await first.locator("summary").click();
  await expect(first).toHaveAttribute("open", "");
  await expect(first.getByText(/quoted per scope/)).toBeVisible();
  const international = page
    .locator(".faq-item")
    .filter({ hasText: "Do you work with clients outside Kenya?" });
  await international.locator("summary").click();
  await expect(international.locator("p")).toContainText(
    "the UAE and Saudi Arabia",
  );
});

test("project images retain their original colors in both themes", async ({
  page,
}) => {
  await page.goto("/");
  for (const theme of ["dark", "light"]) {
    await page.locator("html").evaluate((html, value) => {
      html.dataset.theme = value;
    }, theme);
    const image = page.locator(".project-image img").first();
    await expect(image).toHaveCSS("filter", "none");
    await image.hover();
    await expect(image).toHaveCSS("filter", "none");
  }
});

test("hero reel shows real project screens at their natural proportions", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".hero-reel-image")).toHaveCount(10);
  // The second track is a lazy, aria-hidden duplicate for the seamless loop.
  const screens = page.locator(".hero-reel-track:first-child .hero-reel-image");
  await expect
    .poll(() =>
      screens.evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0),
      ),
    )
    .toBe(true);
  for (const width of [280, 375, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1000 });
    const ratios = await screens.evaluateAll((images) =>
      images.map((image) =>
        Math.abs(
          image.clientWidth / image.clientHeight -
            image.naturalWidth / image.naturalHeight,
        ),
      ),
    );
    for (const ratio of ratios) expect(ratio).toBeLessThan(0.02);
  }
});

test("case study dialog has no automatic WCAG AA violations", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Read the My1Health case study" })
    .click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await settle(page);
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("capture desktop and mobile layouts for visual review", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await page.locator(".project img").evaluateAll((imgs) =>
    imgs.forEach((img) => {
      img.loading = "eager";
    }),
  );
  await expect
    .poll(() =>
      page
        .locator(".project img")
        .evaluateAll((imgs) =>
          imgs.every((img) => img.complete && img.naturalWidth > 0),
        ),
    )
    .toBe(true);
  await page.screenshot({
    path: "test-results/desktop-dark.png",
    fullPage: true,
  });
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.screenshot({
    path: "test-results/desktop-light.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.screenshot({
    path: "test-results/mobile-dark.png",
    fullPage: true,
  });
});

test("case study dialog chains to the next project and wraps around", async ({
  page,
}) => {
  await page.goto("/#case-capital-fm");
  const dialog = page.getByRole("dialog");
  const titles = [];
  for (let i = 0; i < 5; i++) {
    titles.push(await dialog.getByRole("heading", { level: 2 }).innerText());
    await dialog.getByRole("button", { name: /Next case study/ }).click();
  }
  expect(new Set(titles).size).toBe(5);
  await expect(dialog.getByRole("heading", { level: 2 })).toHaveText(
    "Capital FM",
  );
  await expect(page).toHaveURL(/#case-capital-fm$/);
});
