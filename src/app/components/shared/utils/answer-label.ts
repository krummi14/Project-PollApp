/**
 * Converts an answer index into a letter.
 *
 * @param index - Zero-based index of the answer
 * @returns The corresponding uppercase letter (0 → `A`, 1 → `B`, …)
 */
export function getAnswerLabel(index: number): string {
  return String.fromCharCode(65 + index);
}