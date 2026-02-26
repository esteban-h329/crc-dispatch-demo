import * as React from 'react';
import { IStepField } from '../models';

/**
 * Filters step fields based on conditionalOn rules evaluated against stepDataMap.
 * Fields without conditionalOn are always visible.
 * Fields with conditionalOn are only visible when the referenced field matches the expected value.
 */
export function useConditionalFields(
  fields: ReadonlyArray<IStepField>,
  stepDataMap: Record<number, Record<string, unknown>>,
  currentStepIndex: number,
): ReadonlyArray<IStepField> {
  return React.useMemo(() => {
    return fields.filter((field) => {
      if (!field.conditionalOn) return true;

      const targetStep = field.conditionalOn.step ?? currentStepIndex;
      const stepData = stepDataMap[targetStep] ?? {};
      const fieldValue = stepData[field.conditionalOn.field];
      const stringValue = String(fieldValue ?? '');

      const expectedValue = field.conditionalOn.value;

      if (typeof expectedValue === 'boolean') {
        return Boolean(fieldValue) === expectedValue;
      }

      if (Array.isArray(expectedValue)) {
        return expectedValue.includes(stringValue);
      }

      return stringValue === expectedValue;
    });
  }, [fields, stepDataMap, currentStepIndex]);
}
