import * as React from 'react';
import { tokens } from '@fluentui/react-components';
import { CRC_TYPOGRAPHY } from '../../../config/theme';

interface ISectionHeaderProps {
  readonly label: string;
}

export const SectionHeader: React.FC<ISectionHeaderProps> = ({ label }) => {
  return (
    <div
      style={{
        borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
        paddingBottom: '6px',
        marginTop: '8px',
      }}
    >
      <span
        style={{
          fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
          fontWeight: 600,
          fontSize: '14px',
          color: tokens.colorNeutralForeground2,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {label}
      </span>
    </div>
  );
};
