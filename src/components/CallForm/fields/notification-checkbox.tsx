import * as React from 'react';
import {
  Checkbox,
  Input,
  tokens,
} from '@fluentui/react-components';
import { CallRegular } from '@fluentui/react-icons';
import { ISubField } from '../../../models';
import { CRC_COLORS } from '../../../config/theme';

interface INotificationCheckboxValue {
  readonly checked: boolean;
  readonly timestamp?: string;
  readonly [key: string]: unknown;
}

interface INotificationCheckboxProps {
  readonly label: string;
  readonly phoneNumber?: string;
  readonly subFields?: ReadonlyArray<ISubField>;
  readonly value: INotificationCheckboxValue;
  readonly onChange: (value: INotificationCheckboxValue) => void;
}

export const NotificationCheckbox: React.FC<INotificationCheckboxProps> = ({
  label,
  phoneNumber,
  subFields,
  value,
  onChange,
}) => {
  const handleCheck = React.useCallback(
    (_e: unknown, data: { checked: boolean | 'mixed' }) => {
      const isChecked = data.checked === true;
      const updated: Record<string, unknown> = {
        ...value,
        checked: isChecked,
      };

      if (isChecked && !value.timestamp) {
        updated.timestamp = new Date().toISOString();
      }

      if (!isChecked) {
        updated.timestamp = undefined;
      }

      onChange(updated as INotificationCheckboxValue);
    },
    [value, onChange],
  );

  const handleSubFieldChange = React.useCallback(
    (fieldName: string, fieldValue: string) => {
      onChange({
        ...value,
        [fieldName]: fieldValue,
      });
    },
    [value, onChange],
  );

  const telHref = phoneNumber
    ? `tel:${phoneNumber.replace(/[^+\d]/g, '')}`
    : undefined;

  const formattedTimestamp = value.timestamp
    ? new Date(value.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : undefined;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox
          checked={value.checked}
          onChange={handleCheck}
          label={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span>{label}</span>
              {phoneNumber && telHref && (
                <a
                  href={telHref}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '3px',
                    color: CRC_COLORS.accentBlue,
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <CallRegular style={{ fontSize: '12px' }} />
                  {phoneNumber}
                </a>
              )}
            </span>
          }
        />

        {formattedTimestamp && (
          <span
            style={{
              fontSize: '12px',
              color: tokens.colorNeutralForeground3,
              fontStyle: 'italic',
              whiteSpace: 'nowrap',
            }}
          >
            @ {formattedTimestamp}
          </span>
        )}
      </div>

      {/* Sub-fields shown when checked */}
      {value.checked && subFields && subFields.length > 0 && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginLeft: '32px',
            marginTop: '6px',
            flexWrap: 'wrap',
          }}
        >
          {subFields.map((sf) => (
            <div
              key={sf.name}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: tokens.colorNeutralForeground2,
                  whiteSpace: 'nowrap',
                }}
              >
                {sf.label}:
              </span>
              <Input
                size="small"
                value={String(value[sf.name] ?? '')}
                onChange={(_e, data) => handleSubFieldChange(sf.name, data.value)}
                placeholder={sf.placeholder ?? ''}
                style={{ width: '140px' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
