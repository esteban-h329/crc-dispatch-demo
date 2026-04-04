import * as React from 'react';
import { useForm, FieldValues } from 'react-hook-form';
import {
  Button,
  Body1,
  Spinner,
  tokens,
} from '@fluentui/react-components';
import {
  CheckmarkRegular,
  ArrowRightRegular,
  EditRegular,
} from '@fluentui/react-icons';
import { IWorkflowStepDefinition, StepStatus } from '../../models';
import { StepFieldRenderer } from './step-field-renderer';
import { useConditionalFields } from '../../hooks/useConditionalFields';

interface IStepFormProps {
  readonly step: IWorkflowStepDefinition;
  readonly stepStatus: StepStatus;
  readonly initialData: Record<string, unknown>;
  readonly stepDataMap: Record<number, Record<string, unknown>>;
  readonly currentStepIndex: number;
  readonly onSave: (data: Record<string, unknown>) => void;
  readonly onComplete: (data: Record<string, unknown>) => void;
  readonly onSkip: () => void;
  readonly onReopen?: () => void;
  readonly isSubmitting: boolean;
}

export const StepForm: React.FC<IStepFormProps> = ({
  step,
  stepStatus,
  initialData,
  stepDataMap,
  currentStepIndex,
  onSave,
  onComplete,
  onSkip,
  onReopen,
  isSubmitting,
}) => {
  const { control, handleSubmit, watch, reset } = useForm<FieldValues>({
    defaultValues: initialData,
  });

  // Sync form when initialData changes (e.g. caller info pre-population)
  const initialDataRef = React.useRef(initialData);
  React.useEffect(() => {
    const prev = initialDataRef.current;
    initialDataRef.current = initialData;
    // Only reset if the data actually changed and form has no user edits yet
    if (JSON.stringify(prev) !== JSON.stringify(initialData)) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Filter fields based on conditional visibility
  const visibleFields = useConditionalFields(step.fields, stepDataMap, currentStepIndex);

  // Auto-save: watch all fields and trigger onSave on any change
  const watchedValues = watch();
  const prevValuesRef = React.useRef<string>(JSON.stringify(initialData));

  React.useEffect(() => {
    if (stepStatus === StepStatus.Completed) return;

    const serialized = JSON.stringify(watchedValues);
    if (serialized !== prevValuesRef.current) {
      prevValuesRef.current = serialized;
      onSave(watchedValues as Record<string, unknown>);
    }
  }, [watchedValues, onSave, stepStatus]);

  const handleComplete = React.useCallback(
    (data: FieldValues) => {
      onComplete(data);
    },
    [onComplete],
  );

  const isCompleted = stepStatus === StepStatus.Completed;

  return (
    <div style={{ flex: 1 }}>
      <Body1 style={{ display: 'block', marginBottom: tokens.spacingVerticalM, color: tokens.colorNeutralForeground3 }}>
        {step.description}
      </Body1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {visibleFields.map((field) => (
          <StepFieldRenderer key={field.name} stepField={field} control={control} />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          gap: tokens.spacingHorizontalS,
          marginTop: '24px',
          borderTop: '1px solid rgba(0, 32, 74, 0.06)',
          paddingTop: '20px',
        }}
      >
        {!step.isRequired && !isCompleted && (
          <Button
            appearance="subtle"
            icon={<ArrowRightRegular />}
            onClick={onSkip}
            disabled={isSubmitting}
          >
            Skip
          </Button>
        )}
        {!isCompleted && (
          <Button
            appearance="primary"
            icon={isSubmitting ? <Spinner size="tiny" appearance="inverted" /> : <CheckmarkRegular />}
            onClick={handleSubmit(handleComplete)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Step'}
          </Button>
        )}
        {isCompleted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacingHorizontalS }}>
            <Body1 style={{ color: tokens.colorPaletteGreenForeground1 }}>
              Step completed
            </Body1>
            {onReopen && (
              <Button
                appearance="subtle"
                icon={<EditRegular />}
                onClick={onReopen}
                size="small"
              >
                Edit
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
