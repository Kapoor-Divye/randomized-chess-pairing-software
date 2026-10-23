// Hardware and OS-level entropy harvesting using Web Cryptography API

// Generates an unbiased random integer within the range [min, max)
// Uses rejection sampling to completely prevent modulo bias
export function getSecureRandomInt(min, max) {
  const range = max - min;
  if (range <= 0) return min;

  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);

  const buffer = new Uint32Array(1);
  do {
    window.crypto.getRandomValues(buffer);
  } while (buffer[0] >= limit);

  return min + (buffer[0] % range);
}

// Fisher-Yates (Knuth) Shuffle driven by CSPRNG indices
// Runs in O(N) time with uniform permutation distribution
export function csprngShuffle(array) {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i--) {
    const j = getSecureRandomInt(0, i + 1);
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
}