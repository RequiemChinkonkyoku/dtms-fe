export const softDelay = async (
  startTime = null,
  base = 1200,
  jitter = 4500
) => {
  const elapsed = startTime ? Date.now() - startTime : 0;
  const delay = base + Math.random() * jitter;
  const remaining = Math.max(0, delay - elapsed);
  return new Promise((res) => setTimeout(res, remaining));
};
