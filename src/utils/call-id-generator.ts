/**
 * Generates a unique Call ID in the format: CALL-YYYYMMDD-NNN
 * Example: CALL-20260210-001
 */
export const generateCallId = (sequenceNumber: number): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const seq = String(sequenceNumber).padStart(3, '0');
  return `CALL-${year}${month}${day}-${seq}`;
};
