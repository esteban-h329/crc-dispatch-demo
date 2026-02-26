import * as React from 'react';
import { tokens } from '@fluentui/react-components';
import { CallRegular } from '@fluentui/react-icons';
import { CRC_COLORS } from '../../../config/theme';

interface IPhoneDisplayProps {
  readonly label: string;
  readonly phoneNumber: string;
}

export const PhoneDisplay: React.FC<IPhoneDisplayProps> = ({ label, phoneNumber }) => {
  const telHref = `tel:${phoneNumber.replace(/[^+\d]/g, '')}`;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 0',
      }}
    >
      <span style={{ color: tokens.colorNeutralForeground2, fontSize: '14px' }}>
        {label}:
      </span>
      <a
        href={telHref}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: CRC_COLORS.accentBlue,
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        <CallRegular style={{ fontSize: '14px' }} />
        {phoneNumber}
      </a>
    </div>
  );
};
