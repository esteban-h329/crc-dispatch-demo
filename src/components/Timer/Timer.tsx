import * as React from 'react';
import {
  Card,
  Title1,
  Button,
  tokens,
} from '@fluentui/react-components';
import {
  PlayRegular,
  PauseRegular,
  ArrowResetRegular,
} from '@fluentui/react-icons';
import { ICallTimerResult } from '../../hooks/useCallTimer';
import {
  TIMER_THRESHOLDS,
  TIMER_COLORS,
  CRC_TYPOGRAPHY,
} from '../../config/theme';

function getTimerColor(seconds: number): string {
  if (seconds >= TIMER_THRESHOLDS.criticalSeconds) return TIMER_COLORS.critical;
  if (seconds >= TIMER_THRESHOLDS.warningSeconds) return TIMER_COLORS.warning;
  return TIMER_COLORS.normal;
}

interface ITimerProps {
  readonly timer: ICallTimerResult;
}

export const Timer: React.FC<ITimerProps> = ({ timer }) => {
  const { formattedTime, isRunning, elapsedSeconds, start, pause, resume, reset } = timer;

  return (
    <Card style={{ padding: tokens.spacingVerticalM, textAlign: 'center' }}>
      <Title1
        style={{
          color: getTimerColor(elapsedSeconds),
          fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
          fontWeight: CRC_TYPOGRAPHY.fontWeightBold,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
          transition: 'color 1s ease',
        }}
      >
        {formattedTime}
      </Title1>
      <div style={{ display: 'flex', gap: tokens.spacingHorizontalS, justifyContent: 'center', marginTop: tokens.spacingVerticalS }}>
        {!isRunning && elapsedSeconds === 0 && (
          <Button icon={<PlayRegular />} appearance="primary" onClick={start}>
            Start
          </Button>
        )}
        {isRunning && (
          <Button icon={<PauseRegular />} appearance="subtle" onClick={pause}>
            Pause
          </Button>
        )}
        {!isRunning && elapsedSeconds > 0 && (
          <>
            <Button icon={<PlayRegular />} appearance="primary" onClick={resume}>
              Resume
            </Button>
            <Button icon={<ArrowResetRegular />} appearance="subtle" onClick={reset}>
              Reset
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
