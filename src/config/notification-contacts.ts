/**
 * Notification contact data for IOCC/CCF, HSE On Call, QI, and OSRO dropdowns.
 * All phone numbers and names come from official CRC documents.
 * Stored as config so they can be updated without code changes.
 */

// ── IOCC / CCF Options ─────────────────────────────────────────────
export interface IContactOption {
  readonly label: string;
  readonly phone: string;
}

export const IOCC_CCF_OPTIONS: ReadonlyArray<IContactOption> = [
  { label: 'IOCC', phone: '661-665-3300' },
  { label: 'CCF Elk Hills', phone: '661-763-7222' },
  { label: 'CCF Non-unit', phone: '661-763-7223' },
  { label: 'CCF Gas Plants', phone: '661-763-7220' },
];

export const IOCC_CCF_DROPDOWN_OPTIONS: ReadonlyArray<string> =
  IOCC_CCF_OPTIONS.map((o) => `${o.label} — ${o.phone}`);

// ── HSE On Call ─────────────────────────────────────────────────────
export interface IHseContact {
  readonly name: string;
  readonly phone: string;
  readonly complex: string;
}

export const HSE_ON_CALL_CONTACTS: ReadonlyArray<IHseContact> = [
  // Belridge Complex
  { name: 'Zack Dransoff', phone: '661-332-6294', complex: 'Belridge Complex' },
  { name: 'Colton Parrish', phone: '661-529-1299', complex: 'Belridge Complex' },
  { name: 'Doug Koenig', phone: '661-448-7185', complex: 'Belridge Complex' },
  { name: 'Dustin Ramsey', phone: '559-351-3220', complex: 'Belridge Complex' },
  { name: 'Kenny Elmore', phone: '661-747-5289', complex: 'Belridge Complex' },
  { name: 'Mike Leduc', phone: '661-599-2011', complex: 'Belridge Complex' },
  { name: 'Mike Puskarich', phone: '661-331-1135', complex: 'Belridge Complex' },
  { name: "Francisco 'Paco' Uribe", phone: '661-671-1784', complex: 'Belridge Complex' },
  { name: 'James Ryan Moore', phone: '661-369-0368', complex: 'Belridge Complex' },
  { name: 'Sam Parks', phone: '661-201-5987', complex: 'Belridge Complex' },
  { name: 'Sindy Vasquez', phone: '661-995-6459', complex: 'Belridge Complex' },
  { name: 'Tyson Rall', phone: '661-427-1437', complex: 'Belridge Complex' },
  { name: 'Steve Settlemire', phone: '661-484-3230', complex: 'Belridge Complex' },
  { name: 'Robby Deford', phone: '661-342-7004', complex: 'Belridge Complex' },
  { name: 'Abby Mejia', phone: '661-440-6994', complex: 'Belridge Complex' },
  { name: 'Shamim Reza', phone: '661-717-1634', complex: 'Belridge Complex' },

  // Wilmington Complex
  { name: 'Bryan Hardwick', phone: '562-477-2649', complex: 'Wilmington Complex' },
  { name: 'Desmond Fuzee', phone: '661-654-1019', complex: 'Wilmington Complex' },
  { name: 'Candace Taylor', phone: '562-721-8908', complex: 'Wilmington Complex' },
  { name: 'Jonathon Gorski', phone: '562-310-5645', complex: 'Wilmington Complex' },
  { name: 'Chris Logan', phone: '805-947-9025', complex: 'Wilmington Complex' },
  { name: 'Joe Cochran', phone: '805-921-6554', complex: 'Wilmington Complex' },
  { name: 'Jeff Nobriga', phone: '805-504-6865', complex: 'Wilmington Complex' },
  { name: 'Tom Crouthers', phone: '562-544-6308', complex: 'Wilmington Complex' },
  { name: 'John Karnegis', phone: '530-804-2318', complex: 'Wilmington Complex' },

  // Elk Hills Complex
  { name: 'Sonnie Pineda', phone: '661-770-6051', complex: 'Elk Hills Complex' },
  { name: 'Alan Gettman', phone: '661-979-4294', complex: 'Elk Hills Complex' },
  { name: 'Tyson Rall', phone: '661-427-1437', complex: 'Elk Hills Complex' },
  { name: 'John Calcote', phone: '661-865-8056', complex: 'Elk Hills Complex' },
  { name: 'Joey Daddario', phone: '661-577-5576', complex: 'Elk Hills Complex' },
  { name: 'Guy Hairfield', phone: '661-246-8279', complex: 'Elk Hills Complex' },
  { name: 'Daniel Mudge', phone: '661-426-5432', complex: 'Elk Hills Complex' },
  { name: 'Bryan Payne', phone: '661-440-3696', complex: 'Elk Hills Complex' },
  { name: 'Robby DeFord', phone: '661-342-7004', complex: 'Elk Hills Complex' },
  { name: 'Doug Shaffer', phone: '661-428-5972', complex: 'Elk Hills Complex' },
  { name: 'Esteban Solano', phone: '661-565-6398', complex: 'Elk Hills Complex' },
  { name: 'Steve Settlemire', phone: '661-484-3230', complex: 'Elk Hills Complex' },
  { name: 'Grecia Almaguer', phone: '661-477-1900', complex: 'Elk Hills Complex' },
  { name: 'Rich Hill', phone: '949-933-2451', complex: 'Elk Hills Complex' },
  { name: 'Annie Hanshew', phone: '661-978-0168', complex: 'Elk Hills Complex' },
  { name: 'Marcos Castro', phone: '661-428-3568', complex: 'Elk Hills Complex' },
  { name: 'Emily Jones', phone: '661-440-8526', complex: 'Elk Hills Complex' },
];

/** Grouped dropdown options: "Complex Header" group labels + "Name — Phone" items */
export function getHseOnCallDropdownOptions(): ReadonlyArray<string> {
  const options: string[] = [];
  let currentComplex = '';
  for (const contact of HSE_ON_CALL_CONTACTS) {
    if (contact.complex !== currentComplex) {
      currentComplex = contact.complex;
      options.push(`── ${currentComplex} ──`);
    }
    options.push(`${contact.name} — ${contact.phone}`);
  }
  return options;
}

export const HSE_ON_CALL_DROPDOWN_OPTIONS: ReadonlyArray<string> = getHseOnCallDropdownOptions();

// ── QI (Qualified Individuals) for Spills/Releases ──────────────────
export interface IQiContact {
  readonly area: string;
  readonly name: string;
  readonly phone: string;
  readonly complex: string;
}

export const QI_CONTACTS: ReadonlyArray<IQiContact> = [
  // Elk Hills Production Complex
  { area: 'GEHA/BV Hills', name: 'Leon Sinden', phone: '661-303-1221', complex: 'Elk Hills Production Complex' },
  { area: 'Valley Areas', name: 'Justin Narup', phone: '661-556-1652', complex: 'Elk Hills Production Complex' },
  { area: 'All EHPC locations', name: 'Dan Culbertson', phone: '661-978-5600', complex: 'Elk Hills Production Complex' },
  { area: 'Executive IC/QI', name: 'Johnathon Hilton', phone: '970-985-5370', complex: 'Elk Hills Production Complex' },

  // Belridge Production Complex
  { area: 'Belridge/MWSS/Lost Hills', name: 'Luke Chambers', phone: '661-858-4603', complex: 'Belridge Production Complex' },
  { area: 'Coalinga/Kettleman/Kerman/Raisin City', name: 'Ali Zauner', phone: '661-202-6001', complex: 'Belridge Production Complex' },
  { area: 'Coalinga/Kettleman/Kerman/Raisin City', name: 'Evan Morones', phone: '805-508-6138', complex: 'Belridge Production Complex' },
  { area: 'San Ardo', name: 'Ali Zauner', phone: '661-202-6001', complex: 'Belridge Production Complex' },
  { area: 'San Ardo', name: 'Brett Bane', phone: '559-351-3228', complex: 'Belridge Production Complex' },
  { area: 'All BPC Locations', name: 'David Hauptman', phone: '661-858-3864', complex: 'Belridge Production Complex' },
  { area: 'Executive IC/QI', name: 'Brett Illot', phone: '661-978-2916', complex: 'Belridge Production Complex' },

  // Wilmington Production Complex
  { area: 'Sacramento Basin', name: 'Erin Larner', phone: '805-896-8074', complex: 'Wilmington Production Complex' },
  { area: 'Sacramento Basin', name: 'Joe Carr', phone: '209-662-3114', complex: 'Wilmington Production Complex' },
  { area: 'Executive IC/QI', name: 'Dean Persinger', phone: '562-900-0273', complex: 'Wilmington Production Complex' },
  // TODO: [PENDING] LB, HB, Ventura QIs — awaiting confirmation
];

export function getQiDropdownOptions(): ReadonlyArray<string> {
  const options: string[] = [];
  let currentComplex = '';
  for (const qi of QI_CONTACTS) {
    if (qi.complex !== currentComplex) {
      currentComplex = qi.complex;
      options.push(`── ${currentComplex} ──`);
    }
    options.push(`${qi.area} — ${qi.name} — ${qi.phone}`);
  }
  return options;
}

export const QI_DROPDOWN_OPTIONS: ReadonlyArray<string> = getQiDropdownOptions();

// ── OSRO Options ────────────────────────────────────────────────────
export const OSRO_OPTIONS: ReadonlyArray<IContactOption> = [
  { label: 'Patriot Environmental', phone: '800-624-9136' },
  { label: 'General Production Services (Belridge ONLY)', phone: '661-768-8031' },
  { label: 'Ally Enterprises (Elk Hills)', phone: '661-432-1311' },
  { label: 'Marine Spill Response Corp (MSRC) — San Ardo Spills to Sargent Creek and Salinas River', phone: '800-259-6772' },
];

export const OSRO_DROPDOWN_OPTIONS: ReadonlyArray<string> =
  OSRO_OPTIONS.map((o) => `${o.label} — ${o.phone}`);

// ── CalGEM Numbers ──────────────────────────────────────────────────
export const CALGEM_CONTACTS: ReadonlyArray<IContactOption> = [
  { label: 'CalGEM Inland', phone: '661-322-4031' },
  { label: 'CalGEM Northern District', phone: '916-322-1110' },
];

// ── Non-Field Locations ─────────────────────────────────────────────
export const NON_FIELD_LOCATIONS: ReadonlyArray<string> = [
  'Long Beach — 1 World Trade Center',
  'Santa Clarita — 27200 Tourney, Suite 200',
  'Bakersfield — 9500 Ming Ave',
  'Bakersfield — 9600 Ming Ave',
  'Bakersfield — 10000 Ming Ave (Oaks)',
  'Bakersfield — 5300 District Blvd',
  'Stockton — 2800 W. March Ln.',
  'Sacramento — 1201 K Street',
  // TODO: [PENDING] BRY office locations — decision pending
];
