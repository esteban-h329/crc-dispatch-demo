import * as React from 'react';

export interface IUseSharePointListResult<T> {
  readonly data: ReadonlyArray<T>;
  readonly isLoading: boolean;
  readonly error: string | undefined;
  readonly refresh: () => Promise<void>;
}

/**
 * Generic hook for fetching data from a SharePoint list.
 * Wraps an async fetcher function with loading/error state management.
 */
export function useSharePointList<T>(
  fetcher: () => Promise<ReadonlyArray<T>>,
  deps: ReadonlyArray<unknown> = [],
): IUseSharePointListResult<T> {
  const [data, setData] = React.useState<ReadonlyArray<T>>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | undefined>(undefined);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    refresh().catch(() => { /* error already captured in state */ });
  }, [refresh]);

  return { data, isLoading, error, refresh };
}
