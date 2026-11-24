import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("the first portrait alone loads and fits on phones, tablets, and desktops", async ({
  page,
}) => {
  await page.goto("/");
  const portraits = page.locator(".about-portrait");
  await expect(portraits).toHaveCount(1);
  await expect(portraits).toHaveAttribute(
    "alt",
    "Axel Asa outdoors in a wide-brimmed hat",
  );
  for (const width of [280, 375, 768, 1440, 2560]) {
    await page.setViewportSize({ width, height: 1200 });
    for (const portrait of await portraits.all()) {
      await portrait.scrollIntoViewIfNeeded();
      await portrait.evaluate((image) => image.decode());
      const size = await portrait.evaluate(async (image) => {
        const source = new Image();
        source.src = image.currentSrc;
        await source.decode();
        return {
          width: image.clientWidth,
          height: image.clientHeight,
          sourceWidth: source.naturalWidth,
        };
      });
      expect(size.width).toBeGreaterThanOrEqual(Math.min(200, width - 40));
      expect(size.sourceWidth).toBeGreaterThanOrEqual(size.width);
      expect(Math.abs(size.width / size.height - 0.8)).toBeLessThan(0.01);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.setViewportSize({ width: 1440, height: 1200 });
  for (const theme of ["dark", "light"]) {
    await page.locator("html").evaluate((html, theme) => {
      html.dataset.theme = theme;
    }, theme);
    const results = await new AxeBuilder({ page })
      .include("#about")
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
  await page.locator("html").evaluate((html) => {
    html.dataset.theme = "dark";
  });
  await page.evaluate(() => document.activeElement?.blur());
  await page.locator(".about").screenshot({
    path: "test-results/about-studio-portrait.png",
    animations: "disabled",
  });
});
