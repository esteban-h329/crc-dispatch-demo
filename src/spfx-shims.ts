/**
 * Minimal type shim for SPFx WebPartContext.
 * Replaces @microsoft/sp-webpart-base in the demo environment.
 * Only the properties accessed at runtime need to be defined.
 */
export interface WebPartContext {
  readonly pageContext?: {
    readonly user?: {
      readonly displayName?: string;
    };
  };
}
