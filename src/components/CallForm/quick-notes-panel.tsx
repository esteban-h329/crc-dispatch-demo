import * as React from 'react';
import {
  Button,
  Input,
} from '@fluentui/react-components';
import {
  NoteAddRegular,
  NoteRegular,
  ChevronDownRegular,
  ChevronUpRegular,
  DismissRegular,
} from '@fluentui/react-icons';
import { CRC_COLORS, CRC_TYPOGRAPHY } from '../../config/theme';

interface IQuickNote {
  readonly text: string;
  readonly timestamp: string;
}

interface IQuickNotesPanelProps {
  readonly notes: ReadonlyArray<IQuickNote>;
  readonly onAddNote: (text: string) => void;
  readonly onDeleteNote?: (index: number) => void;
}

const PANEL_WIDTH = 240;

const panelStyle: React.CSSProperties = {
  width: PANEL_WIDTH,
  flexShrink: 0,
  borderLeft: `3px solid ${CRC_COLORS.accentBlue}`,
  borderRadius: '0 12px 12px 0',
  background: 'linear-gradient(180deg, #F0F4F8 0%, #E8EDF3 100%)',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: 'inset 2px 0 8px rgba(0, 32, 74, 0.03)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 12px',
  cursor: 'pointer',
  userSelect: 'none',
};

const titleStyle: React.CSSProperties = {
  fontFamily: CRC_TYPOGRAPHY.fontFamilyHeading,
  fontWeight: 600,
  fontSize: '12px',
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'rgba(0, 32, 74, 0.65)',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
};

const noteListStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  maxHeight: '300px',
  padding: '0 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const noteItemStyle: React.CSSProperties = {
  padding: '10px 12px',
  backgroundColor: '#FFFFFF',
  borderRadius: '0 8px 8px 0',
  fontSize: '12px',
  lineHeight: 1.5,
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  animation: 'crc-slide-in-right 250ms cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '6px',
  borderBottom: '1px solid rgba(0, 32, 74, 0.04)',
  borderLeft: `3px solid ${CRC_COLORS.accentBlue}`,
  boxShadow: '0 1px 3px rgba(0, 32, 74, 0.04)',
};

const timestampStyle: React.CSSProperties = {
  fontSize: '11px',
  fontFamily: 'monospace',
  fontWeight: 600,
  color: 'rgba(0, 32, 74, 0.45)',
  marginRight: '6px',
};

const inputAreaStyle: React.CSSProperties = {
  padding: '8px 12px',
  borderTop: '1px solid rgba(0, 32, 74, 0.08)',
  display: 'flex',
  gap: '6px',
  backgroundColor: '#FFFFFF',
  borderRadius: '0 0 8px 0',
};

const emptyStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '12px',
  color: 'rgba(0, 32, 74, 0.35)',
  fontFamily: CRC_TYPOGRAPHY.fontFamilyBody,
  textAlign: 'center',
  fontStyle: 'italic',
};

export const QuickNotesPanel: React.FC<IQuickNotesPanelProps> = ({ notes, onAddNote, onDeleteNote }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [noteText, setNoteText] = React.useState('');
  const listRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new note is added
  React.useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [notes.length]);

  const handleAdd = React.useCallback(() => {
    if (noteText.trim().length === 0) return;
    onAddNote(noteText);
    setNoteText('');
  }, [noteText, onAddNote]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleAdd();
      }
    },
    [handleAdd],
  );

  return (
    <div style={panelStyle}>
      <div
        style={headerStyle}
        onClick={() => setIsExpanded((prev) => !prev)}
      >
        <span style={titleStyle}>
          <NoteRegular style={{ fontSize: '14px', color: CRC_COLORS.accentBlue }} />
          Quick Notes ({notes.length})
        </span>
        {isExpanded ? <ChevronUpRegular fontSize={14} /> : <ChevronDownRegular fontSize={14} />}
      </div>

      {isExpanded && (
        <>
          <div ref={listRef} style={noteListStyle}>
            {notes.length === 0 ? (
              <span style={emptyStyle}>No notes yet. Add a note below.</span>
            ) : (
              notes.map((note, index) => (
                <div key={index} style={noteItemStyle}>
                  <div style={{ flex: 1 }}>
                    <span style={timestampStyle}>{note.timestamp}</span>
                    <span style={{ color: 'rgba(0, 32, 74, 0.75)' }}>{note.text}</span>
                  </div>
                  {onDeleteNote && (
                    <button
                      onClick={() => onDeleteNote(index)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px',
                        color: 'rgba(0, 32, 74, 0.3)',
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'color 150ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = CRC_COLORS.danger; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(0, 32, 74, 0.3)'; }}
                      aria-label="Delete note"
                    >
                      <DismissRegular fontSize={12} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <div style={inputAreaStyle}>
            <Input
              placeholder="Add a note..."
              value={noteText}
              onChange={(_e, data) => setNoteText(data.value)}
              onKeyDown={handleKeyDown}
              size="small"
              style={{ flex: 1 }}
            />
            <Button
              appearance="subtle"
              icon={<NoteAddRegular />}
              onClick={handleAdd}
              disabled={noteText.trim().length === 0}
              size="small"
              aria-label="Add note"
            />
          </div>
        </>
      )}
    </div>
  );
};
