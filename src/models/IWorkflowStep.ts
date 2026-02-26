export type StepFieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'number'
  | 'datetime'
  | 'location-picker'
  | 'notification-checkbox'
  | 'section-header'
  | 'phone-display';

export interface IConditionalRule {
  /** Name of the field to evaluate */
  readonly field: string;
  /** Value(s) that trigger visibility. If array, any match triggers. */
  readonly value: string | boolean | ReadonlyArray<string>;
  /** Step index (0-based) to look in. Defaults to current step. */
  readonly step?: number;
}

export interface ISubField {
  readonly name: string;
  readonly label: string;
  readonly placeholder?: string;
}

export interface IStepField {
  readonly name: string;
  readonly label: string;
  readonly type: StepFieldType;
  readonly isRequired: boolean;
  readonly options?: ReadonlyArray<string>;
  readonly placeholder?: string;
  readonly validation?: {
    readonly min?: number;
    readonly max?: number;
    readonly pattern?: string;
  };
  /** Show this field only when another field matches a value */
  readonly conditionalOn?: IConditionalRule;
  /** Phone number for notification-checkbox or phone-display (rendered as tel: link) */
  readonly phoneNumber?: string;
  /** Auto-record ISO timestamp when checkbox is checked */
  readonly autoTimestamp?: boolean;
  /** Inline sub-fields rendered when notification-checkbox is checked */
  readonly subFields?: ReadonlyArray<ISubField>;
}

export interface IWorkflowStepDefinition {
  readonly stepNumber: number;
  readonly title: string;
  readonly description: string;
  readonly fields: ReadonlyArray<IStepField>;
  readonly isRequired: boolean;
}
