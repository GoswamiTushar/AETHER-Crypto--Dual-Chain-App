import BigNumber from 'bignumber.js';

// Never use scientific notation; keep up to 18 decimal places of precision
BigNumber.config({ EXPONENTIAL_AT: 1e9, DECIMAL_PLACES: 18 });

/**
 * Safely formats a raw on-chain token amount (bigint) into a human-readable
 * locale string, correctly handling amounts > Number.MAX_SAFE_INTEGER (9 * 10^15).
 *
 * @example
 *   formatTokenAmount(1000000000000000000000n, 18) // → "1,000"
 *   formatTokenAmount(1500000000000000000n,    18) // → "1.5"
 *   formatTokenAmount(48700000000000000n,      18) // → "0.0487"
 */
export function formatTokenAmount(
  rawAmount: bigint,
  decimals: number = 18,
  maxFractionDigits: number = 4
): string {
  const divisor = new BigNumber(10).pow(decimals);
  const human = new BigNumber(rawAmount.toString()).dividedBy(divisor);

  // toFixed caps fraction digits precisely via BigNumber (no float error)
  // The result is now a small, safe number — parseFloat is fine at this point
  const trimmed = parseFloat(human.toFixed(maxFractionDigits));
  return trimmed.toLocaleString(undefined, { maximumFractionDigits: maxFractionDigits });
}
