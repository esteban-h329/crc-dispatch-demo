export enum CallType {
  SpillsReleases = 'Spills / Releases',
  Fire = 'Fire',
  InjuryIllness = 'Injury / Illness',
  WellRelease = 'Well Release',
  LineStrike = 'Line Strike',
  AirBreakdown = 'Air Breakdown',
  MVI = 'Motor Vehicle Incident',
  SecurityEvent = 'Security Event',
  WeatherAlert = 'Weather Alert',
  GeneralOperations = 'General Operations',
}

export enum CallStatus {
  Active = 'Active',
  Completed = 'Completed',
  Escalated = 'Escalated',
  Cancelled = 'Cancelled',
}

export enum CallPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
  Critical = 'Critical',
}

export enum StepStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Skipped = 'Skipped',
}

export enum NoteType {
  General = 'General',
  Escalation = 'Escalation',
  FollowUp = 'FollowUp',
}
