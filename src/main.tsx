/**
 * Entry point for the CRC Dispatch Workflow demo.
 * Renders the full application with mock services (no SharePoint required).
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { FluentProvider } from '@fluentui/react-components';
import { AppProvider, useAppContext } from './context/AppContext';
import { CallForm } from './components/CallForm/CallForm';
import { CallHistory } from './components/CallHistory/CallHistory';
import { Dashboard } from './components/Dashboard/Dashboard';
import { CallStatus } from './models';
import { useCallTimer } from './hooks/useCallTimer';
import { useDashboard } from './components/Dashboard/use-dashboard';
import { crcTheme, loadAlexandriaFont } from './config/theme';
import { Sidebar, Header, SIDEBAR_WIDTH, HEADER_HEIGHT } from './components/Layout';
import type { ViewTab } from './components/Layout';

const contentAreaStyle: React.CSSProperties = {
  marginLeft: SIDEBAR_WIDTH,
  marginTop: HEADER_HEIGHT,
  padding: '24px',
  minHeight: `calc(100vh - ${HEADER_HEIGHT}px)`,
  backgroundColor: '#F9F9F9',
};

const contentConstraintStyle: React.CSSProperties = {
  maxWidth: '1200px',
  margin: '0 auto',
};

const AppInner: React.FC = () => {
  const { state } = useAppContext();
  const [activeView, setActiveView] = React.useState<ViewTab>('new-call');
  const timer = useCallTimer();
  const { stats } = useDashboard();

  React.useEffect(() => {
    loadAlexandriaFont();
  }, []);

  const [callFormKey, setCallFormKey] = React.useState(0);
  const [resumeCallId, setResumeCallId] = React.useState<number | undefined>(undefined);
  const [historyStatusFilter, setHistoryStatusFilter] = React.useState<CallStatus | undefined>(undefined);

  const handleNavigate = React.useCallback((view: ViewTab) => {
    if (timer.isRunning) {
      timer.pause();
    }
    if (view === 'new-call' && activeView === 'new-call' && state.activeCall) {
      setCallFormKey((prev) => prev + 1);
    }
    setHistoryStatusFilter(undefined);
    setActiveView(view);
  }, [activeView, state.activeCall, timer]);

  const handleResumeCall = React.useCallback(() => {
    if (state.activeCall) {
      setResumeCallId(state.activeCall.id);
    }
    setActiveView('new-call');
  }, [state.activeCall]);

  const handleResumeCallFromHistory = React.useCallback((callId: number) => {
    setResumeCallId(callId);
    setActiveView('new-call');
  }, []);

  const handleResumeConsumed = React.useCallback(() => {
    setResumeCallId(undefined);
  }, []);

  const dispatcherName = 'Demo Dispatcher';

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <Sidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        dispatcherName={dispatcherName}
      />
      <Header
        activeCall={state.activeCall}
        timer={timer}
        dispatcherName={dispatcherName}
        onResumeCall={handleResumeCall}
        callsToday={stats.callsToday}
        averageDuration={stats.averageDuration}
        animateResume={activeView !== 'new-call'}
      />

      <main style={contentAreaStyle}>
        <div style={contentConstraintStyle}>
          <div key={activeView} style={{ animation: 'crc-fade-in 150ms ease' }}>
            {activeView === 'new-call' && (
              <CallForm
                key={callFormKey}
                onCallStarted={timer.start}
                onCallEnded={timer.reset}
                timer={timer}
                resumeCallId={resumeCallId}
                onResumeConsumed={handleResumeConsumed}
              />
            )}
            {activeView === 'history' && (
              <CallHistory
                onResumeCall={handleResumeCallFromHistory}
                initialStatusFilter={historyStatusFilter}
              />
            )}
            {activeView === 'dashboard' && (
              <Dashboard
                onNavigateToHistory={() => setActiveView('history')}
                onNavigateToHistoryWithFilter={(status) => {
                  setHistoryStatusFilter(status);
                  setActiveView('history');
                }}
                onResumeCall={handleResumeCallFromHistory}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const mockSpContext = {} as Parameters<typeof AppProvider>[0]['spContext'];

  return (
    <FluentProvider theme={crcTheme}>
      <AppProvider spContext={mockSpContext}>
        <AppInner />
      </AppProvider>
    </FluentProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  ReactDOM.render(<App />, container);
}
