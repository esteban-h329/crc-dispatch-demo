import * as React from 'react';
import { Badge } from '@fluentui/react-components';
import { CallStatus } from '../../models';

interface IStatusBadgeProps {
  readonly status: CallStatus;
}

const STATUS_APPEARANCE: Record<CallStatus, 'filled' | 'outline' | 'tint'> = {
  [CallStatus.Active]: 'filled',
  [CallStatus.Completed]: 'tint',
  [CallStatus.Escalated]: 'filled',
  [CallStatus.Cancelled]: 'outline',
};

const STATUS_COLOR: Record<CallStatus, 'brand' | 'success' | 'danger' | 'warning' | 'informative'> = {
  [CallStatus.Active]: 'brand',
  [CallStatus.Completed]: 'success',
  [CallStatus.Escalated]: 'danger',
  [CallStatus.Cancelled]: 'informative',
};

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => {
  return (
    <Badge appearance={STATUS_APPEARANCE[status]} color={STATUS_COLOR[status]}>
      {status}
    </Badge>
  );
};
