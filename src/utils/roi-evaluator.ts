import type { IRoiAutoCheckConfig } from '../config/call-types';

/**
 * Evaluates whether ROI Required should be auto-checked
 * based on call type config and current step data.
 */
export function evaluateRoiAutoCheck(
  config: IRoiAutoCheckConfig | undefined,
  stepDataMap: Record<number, Record<string, unknown>>,
): boolean {
  if (!config) return false;
  if (config.always) return true;
  if (!config.conditionalFields || config.conditionalFields.length === 0) return false;

  return config.conditionalFields.some((rule) => {
    const stepData = stepDataMap[rule.step] ?? {};
    const value = String(stepData[rule.field] ?? '');

    if (Array.isArray(rule.value)) {
      return rule.value.includes(value);
    }

    return value === rule.value;
  });
}
