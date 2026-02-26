import * as React from 'react';
import { Controller, Control, FieldValues } from 'react-hook-form';
import {
  Input,
  Textarea,
  Dropdown,
  Option,
  Checkbox,
  Field,
} from '@fluentui/react-components';
import { IStepField } from '../../models';
import { SectionHeader } from './fields/section-header';
import { PhoneDisplay } from './fields/phone-display';
import { NotificationCheckbox } from './fields/notification-checkbox';
import { LocationPicker, ILocationPickerValue } from './fields/location-picker';

interface IStepFieldRendererProps {
  readonly stepField: IStepField;
  readonly control: Control<FieldValues>;
}

export const StepFieldRenderer: React.FC<IStepFieldRendererProps> = ({ stepField, control }) => {
  // Non-interactive display types — no form binding needed
  if (stepField.type === 'section-header') {
    return <SectionHeader label={stepField.label} />;
  }

  if (stepField.type === 'phone-display') {
    return (
      <PhoneDisplay
        label={stepField.label}
        phoneNumber={stepField.phoneNumber ?? ''}
      />
    );
  }

  // Notification checkbox — complex value (object with checked, timestamp, subFields)
  if (stepField.type === 'notification-checkbox') {
    return (
      <Controller
        name={stepField.name}
        control={control}
        defaultValue={{ checked: false }}
        render={({ field: formField }) => (
          <NotificationCheckbox
            label={stepField.label}
            phoneNumber={stepField.phoneNumber}
            subFields={stepField.subFields}
            value={formField.value ?? { checked: false }}
            onChange={(val) => formField.onChange(val)}
          />
        )}
      />
    );
  }

  // Location picker — cascading dropdown with auto-populated data
  if (stepField.type === 'location-picker') {
    return (
      <Controller
        name={stepField.name}
        control={control}
        rules={{
          validate: (val: ILocationPickerValue | undefined) => {
            if (!stepField.isRequired) return true;
            if (!val || typeof val === 'string' || !val.locationId) {
              return 'Location is required';
            }
            return true;
          },
        }}
        render={({ field: formField, fieldState }) => (
          <Field
            label={stepField.label}
            required={stepField.isRequired}
            validationMessage={fieldState.error?.message}
            validationState={fieldState.error ? 'error' : undefined}
            style={{ display: 'grid', gap: '6px' }}
            size="large"
          >
            <LocationPicker
              value={formField.value}
              onChange={(val) => formField.onChange(val)}
              onBlur={formField.onBlur}
            />
          </Field>
        )}
      />
    );
  }

  // Checkboxes render their own label, no Field wrapper needed
  if (stepField.type === 'checkbox') {
    return (
      <Controller
        name={stepField.name}
        control={control}
        render={({ field: formField }) => (
          <Checkbox
            checked={Boolean(formField.value)}
            onChange={(_e, data) => formField.onChange(data.checked)}
            label={stepField.label}
          />
        )}
      />
    );
  }

  return (
    <Controller
      name={stepField.name}
      control={control}
      rules={{
        required: stepField.isRequired ? `${stepField.label} is required` : false,
        ...(stepField.validation?.min !== undefined && {
          min: { value: stepField.validation.min, message: `Minimum value: ${stepField.validation.min}` },
        }),
        ...(stepField.validation?.max !== undefined && {
          max: { value: stepField.validation.max, message: `Maximum value: ${stepField.validation.max}` },
        }),
      }}
      render={({ field: formField, fieldState }) => (
        <Field
          label={stepField.label}
          required={stepField.isRequired}
          validationMessage={fieldState.error?.message}
          validationState={fieldState.error ? 'error' : undefined}
          style={{ display: 'grid', gap: '6px' }}
          size="large"
        >
          {renderInput(stepField, formField)}
        </Field>
      )}
    />
  );
};

interface IFormFieldProps {
  readonly value: unknown;
  readonly onChange: (...args: unknown[]) => void;
  readonly onBlur: () => void;
}

function renderInput(stepField: IStepField, formField: IFormFieldProps): React.ReactNode {
  const stringValue = String(formField.value ?? '');

  switch (stepField.type) {
    case 'text':
      return (
        <Input
          value={stringValue}
          onChange={(_e, data) => formField.onChange(data.value)}
          onBlur={formField.onBlur}
          placeholder={stepField.placeholder}
        />
      );

    case 'textarea':
      return (
        <Textarea
          value={stringValue}
          onChange={(_e, data) => formField.onChange(data.value)}
          onBlur={formField.onBlur}
          placeholder={stepField.placeholder}
          resize="vertical"
        />
      );

    case 'select':
      return (
        <Dropdown
          value={formField.value ? String(formField.value) : ''}
          selectedOptions={formField.value ? [String(formField.value)] : []}
          onOptionSelect={(_e, data) => formField.onChange(data.optionValue ?? '')}
          placeholder={stepField.placeholder ?? 'Select an option'}
        >
          {(stepField.options ?? []).map((opt) => (
            <Option key={opt} value={opt}>
              {opt}
            </Option>
          ))}
        </Dropdown>
      );

    case 'number':
      return (
        <Input
          type="number"
          value={formField.value !== undefined && formField.value !== '' ? String(formField.value) : ''}
          onChange={(_e, data) => {
            const parsed = data.value === '' ? undefined : Number(data.value);
            formField.onChange(parsed);
          }}
          onBlur={formField.onBlur}
        />
      );

    case 'datetime':
      return (
        <Input
          type="datetime-local"
          value={stringValue}
          onChange={(_e, data) => formField.onChange(data.value)}
          onBlur={formField.onBlur}
        />
      );

    default:
      return (
        <Input
          value={stringValue}
          onChange={(_e, data) => formField.onChange(data.value)}
          onBlur={formField.onBlur}
        />
      );
  }
}
