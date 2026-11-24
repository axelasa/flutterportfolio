export function projectStore(project, device = globalThis.navigator) {
  if (project.website)
    return { name: new URL(project.website).hostname, url: project.website };
  const isIOS =
    /iPhone|iPad|iPod/.test(device?.userAgent || "") ||
    (device?.platform === "MacIntel" && device.maxTouchPoints > 1);
  if (isIOS && project.appStore)
    return { name: "App Store", url: project.appStore };
  return {
    name: "Google Play",
    url:
      project.url ||
      `https://play.google.com/store/apps/details?id=${project.app}`,
  };
}
