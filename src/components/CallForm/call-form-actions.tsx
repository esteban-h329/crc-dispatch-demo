import * as React from 'react';
import {
  Button,
  Dialog,
  DialogSurface,
  DialogBody,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Tooltip,
} from '@fluentui/react-components';
import { CheckmarkRegular, DismissRegular, PauseRegular } from '@fluentui/react-icons';

interface ICallFormActionsProps {
  readonly onComplete: () => void;
  readonly onCancel: () => void;
  readonly onPark?: () => void;
  readonly isSubmitting: boolean;
  readonly canComplete: boolean;
}

export const CallFormActions: React.FC<ICallFormActionsProps> = ({
  onComplete,
  onCancel,
  onPark,
  isSubmitting,
  canComplete,
}) => {
  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '20px', borderTop: '1px solid rgba(0, 32, 74, 0.06)', paddingTop: '16px' }}>
      {onPark && (
        <Button
          appearance="outline"
          icon={<PauseRegular />}
          disabled={isSubmitting}
          onClick={onPark}
        >
          Put on Hold
        </Button>
      )}
      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          <Button appearance="subtle" icon={<DismissRegular />} disabled={isSubmitting}>
            Cancel Call
          </Button>
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Cancel Call?</DialogTitle>
            <DialogContent>
              Are you sure you want to cancel this call? Any unsaved step data will be lost.
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Go Back</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={onCancel}>
                Yes, Cancel
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>

      <Dialog>
        <DialogTrigger disableButtonEnhancement>
          {!canComplete ? (
            <Tooltip content="Complete all required steps first" relationship="label">
              <Button
                appearance="primary"
                icon={<CheckmarkRegular />}
                disabled
                style={{ opacity: 0.5 }}
              >
                Complete Call
              </Button>
            </Tooltip>
          ) : (
            <Button
              appearance="primary"
              icon={<CheckmarkRegular />}
              disabled={isSubmitting}
            >
              Complete Call
            </Button>
          )}
        </DialogTrigger>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Complete Call?</DialogTitle>
            <DialogContent>
              Are you sure you want to mark this call as completed?
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Go Back</Button>
              </DialogTrigger>
              <Button appearance="primary" onClick={onComplete}>
                Yes, Complete
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
};
