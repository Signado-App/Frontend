export async function checkPwnedPassword(password: string): Promise<boolean> {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hash = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`,
  );
  const text = await response.text();

  return text.split("\n").some((line) => {
    const [hashSuffix] = line.split(":");
    return hashSuffix.trim() === suffix;
  });
}
