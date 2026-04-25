const blockedTokens = [
  "viagra",
  "casino",
  "crypto giveaway",
  "free money",
  "porn",
  "loan offer"
];

export function detectSpam(message: string): boolean {
  const text = message.toLowerCase();
  return blockedTokens.some((token) => text.includes(token));
}
