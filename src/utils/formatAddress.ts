/**
 * Truncates an Ethereum address to a readable short form.
 * @example formatAddress("0x1234567890abcdef...") → "0x1234...cdef"
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
