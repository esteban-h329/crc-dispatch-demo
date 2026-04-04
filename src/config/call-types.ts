import { CallType, CallPriority } from '../models';
import { IWorkflowStepDefinition } from '../models';
import { WORKFLOW_STEPS } from './workflow-steps';

export interface IRegulatoryTimerConfig {
  readonly durationMinutes: number;
  readonly label: string;
  readonly triggerField: string;
  readonly triggerValue: string | ReadonlyArray<string>;
  readonly triggerStep: number;
}

export interface ICallTypeConfig {
  readonly type: CallType;
  readonly label: string;
  readonly description: string;
  readonly icon: string;
  readonly defaultPriority: CallPriority;
  readonly steps: ReadonlyArray<IWorkflowStepDefinition>;
  readonly regulatoryTimer?: IRegulatoryTimerConfig;
}

export const CALL_TYPE_CONFIGS: ReadonlyArray<ICallTypeConfig> = [
  {
    type: CallType.SpillsReleases,
    label: 'Spills / Releases',
    description: 'Report and manage spill and release incidents',
    icon: 'Beaker',
    defaultPriority: CallPriority.High,
    steps: WORKFLOW_STEPS[CallType.SpillsReleases],
    regulatoryTimer: {
      durationMinutes: 30,
      label: 'CalOES / NRC / OSRO',
      triggerField: 'reportableSpill',
      triggerValue: 'Yes',
      triggerStep: 0,
    },
  },
  {
    type: CallType.Fire,
    label: 'Fire',
    description: 'Report fire incidents requiring response',
    icon: 'Fire',
    defaultPriority: CallPriority.Critical,
    steps: WORKFLOW_STEPS[CallType.Fire],
  },
  {
    type: CallType.InjuryIllness,
    label: 'Injury / Illness',
    description: 'Report injuries or illness requiring medical attention',
    icon: 'HeartPulse',
    defaultPriority: CallPriority.High,
    steps: WORKFLOW_STEPS[CallType.InjuryIllness],
  },
  {
    type: CallType.WellRelease,
    label: 'Well Release',
    description: 'Report well releases of steam, oil, gas, or water',
    icon: 'Warning',
    defaultPriority: CallPriority.Critical,
    steps: WORKFLOW_STEPS[CallType.WellRelease],
    regulatoryTimer: {
      durationMinutes: 30,
      label: 'CalOES / NRC',
      triggerField: 'reportable',
      triggerValue: 'Yes',
      triggerStep: 1,
    },
  },
  {
    type: CallType.LineStrike,
    label: 'Line Strike',
    description: 'Report line strike incidents',
    icon: 'PlugDisconnected',
    defaultPriority: CallPriority.High,
    steps: WORKFLOW_STEPS[CallType.LineStrike],
  },
  {
    type: CallType.AirBreakdown,
    label: 'Air Breakdown',
    description: 'Report air quality equipment breakdowns',
    icon: 'CloudFlow',
    defaultPriority: CallPriority.High,
    steps: WORKFLOW_STEPS[CallType.AirBreakdown],
    regulatoryTimer: {
      durationMinutes: 60,
      label: 'APCD',
      triggerField: '_always',
      triggerValue: '_always',
      triggerStep: 0,
    },
  },
  {
    type: CallType.MVI,
    label: 'Motor Vehicle Incident',
    description: 'Report motor vehicle incidents',
    icon: 'VehicleCar',
    defaultPriority: CallPriority.High,
    steps: WORKFLOW_STEPS[CallType.MVI],
  },
  {
    type: CallType.SecurityEvent,
    label: 'Security Event',
    description: 'Report theft, vandalism, trespassing, or suspicious activity',
    icon: 'ShieldLock',
    defaultPriority: CallPriority.Medium,
    steps: WORKFLOW_STEPS[CallType.SecurityEvent],
  },
  {
    type: CallType.WeatherAlert,
    label: 'Weather Alert',
    description: 'Respond to severe weather notifications',
    icon: 'WeatherThunderstorm',
    defaultPriority: CallPriority.Medium,
    steps: WORKFLOW_STEPS[CallType.WeatherAlert],
  },
  {
    type: CallType.GeneralOperations,
    label: 'General Operations',
    description: 'General operational calls and inquiries',
    icon: 'Clipboard',
    defaultPriority: CallPriority.Low,
    steps: WORKFLOW_STEPS[CallType.GeneralOperations],
  },
];

export const getCallTypeConfig = (callType: CallType): ICallTypeConfig | undefined =>
  CALL_TYPE_CONFIGS.find((config) => config.type === callType);
