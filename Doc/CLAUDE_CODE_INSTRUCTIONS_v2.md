# CRC Dispatch — Complete Change Instructions

## IMPORTANT CONTEXT
- This is an SPFx web part (React + TypeScript + Fluent UI v9)
- Repo: crc-dispatch
- All data below comes from official CRC documents — do NOT infer or research any phone numbers, names, or locations
- Items marked [PENDING] should be left as placeholder/TODO comments in code

---

## 1. GLOBAL CHANGES (Apply to ALL call types)

### 1.1 Remove Pipeline Alarm call type entirely
- Delete the Pipeline Alarm call type from the application

### 1.2 Combine "Spill" and "Gas/Hazardous Material Release" into ONE call type
- New name: **"Spills / Releases"**
- Base structure = current Spill workflow
- Merge the materials from Gas & Hazardous Release into this type's material dropdown
- Remove the standalone "Gas and Hazardous Material Release" call type

### 1.3 New Call Flow — Add Caller Info Screen BEFORE Call Type Selection
- When dispatcher clicks "New Call", show an initial intake screen with:
  - **Contact Phone Number** (text field — at the top)
  - **Caller Name** (text field — below phone)
- THEN show the call type selection grid
- When a call type is selected, auto-populate caller name and phone into Step 1
- Fields reset to blank on each new call

### 1.4 Remove from ALL call types (notifications/close step):
- **ROI Required** — remove entirely (this tool replaces the ROI document)
- **Alert Media Sent** — remove entirely
- **ICS Activation Requested** — remove entirely

### 1.5 IOCC / CCF — Replace with dropdown on ALL call types
Replace the single IOCC/CCF checkbox with a dropdown. Options:
- **IOCC** — 661-665-3300
- **CCF Elk Hills** — 661-763-7222
- **CCF Non-unit** — 661-763-7223
- **CCF Gas Plants** — 661-763-7220

Display format in dropdown: "IOCC — 661-665-3300", etc.

### 1.6 HSE On Call — Replace with dropdown on ALL call types
Replace the HSE On Call checkbox/text with a dropdown grouped by complex:

**Belridge Complex:**
- Zack Dransoff — 661-332-6294
- Colton Parrish — 661-529-1299
- Doug Koenig — 661-448-7185
- Dustin Ramsey — 559-351-3220
- Kenny Elmore — 661-747-5289
- Mike Leduc — 661-599-2011
- Mike Puskarich — 661-331-1135
- Francisco 'Paco' Uribe — 661-671-1784
- James Ryan Moore — 661-369-0368
- Sam Parks — 661-201-5987
- Sindy Vasquez — 661-995-6459
- Tyson Rall — 661-427-1437
- Steve Settlemire — 661-484-3230
- Robby Deford — 661-342-7004
- Abby Mejia — 661-440-6994
- Shamim Reza — 661-717-1634

**Wilmington Complex:**
- Bryan Hardwick — 562-477-2649
- Desmond Fuzee — 661-654-1019
- Candace Taylor — 562-721-8908
- Jonathon Gorski — 562-310-5645
- Chris Logan — 805-947-9025
- Joe Cochran — 805-921-6554
- Jeff Nobriga — 805-504-6865
- Tom Crouthers — 562-544-6308
- John Karnegis — 530-804-2318

**Elk Hills Complex:**
- Sonnie Pineda — 661-770-6051
- Alan Gettman — 661-979-4294
- Tyson Rall — 661-427-1437
- John Calcote — 661-865-8056
- Joey Daddario — 661-577-5576
- Guy Hairfield — 661-246-8279
- Daniel Mudge — 661-426-5432
- Bryan Payne — 661-440-3696
- Robby DeFord — 661-342-7004
- Doug Shaffer — 661-428-5972
- Esteban Solano — 661-565-6398
- Steve Settlemire — 661-484-3230
- Grecia Almaguer — 661-477-1900
- Rich Hill — 949-933-2451
- Annie Hanshew — 661-978-0168
- Marcos Castro — 661-428-3568
- Emily Jones — 661-440-8526

Display format: "Name — Phone" grouped under complex headers in the dropdown.

### 1.7 Add GPS Coordinates text field to ALL call types
- Add in the location section of every call type

### 1.8 Rename "Standard Notifications" to "Internal Notifications"
- Add a separate "External Notifications" section where applicable

### 1.9 Keep Notes section on ALL call types
- Notes = call disposition (non-time-sensitive wrap-up info)

### 1.10 Update Location Hierarchy (KMS)
Replace the current production complex/location data with the updated KMS hierarchy from the "Dispatcher Intake Form Location" sheet. The hierarchy is:

**Level 1:** CRC ALL

**Level 2 (Complexes):**
- Wilmington Complex
- Elk Hills Complex
- Belridge Complex

**Level 3 (Operating Areas) under Wilmington Complex:**
- LA Basin → THUMS locations, Tidelands locations
- HB Emmy All Locations → Huntington Beach, Platform Emmy, HB Gas Plant, HB Warehouse
- Sacramento Basin → Grimes, Lathrop, Rio Vista, Tompkins Hill, Willows
- Ventura → Ventura Gas Plant 6, Ventura Gas Plant 7
- Newport Banning Ranch

**Level 3 (Operating Areas) under Elk Hills Complex:**
- GEHA → Buena Vista Hills, Buena Vista Nose, Elk Hills facilities (35R Cogen, CGP1, LTS1, LTS2, Power, East, West, etc.)
- Central Valley → Ant Hill, Bowerbank, Chico Martinez, MWSS 35Z, Oxnard, Rose, Semitropic, Shafter North
- North Valley → Helm, Raisin City, Riverdale, Kettleman North Dome, Kettleman Gas Plant
- South Valley → Coles Levee North/South, Landslide, Paloma, Pleito Creek/Ranch, Rio Viejo, San Emidio Nose, Tejon, Tejon North, Wheeler Ridge, Yowlumne
- Thermal → Kern Front, Mount Poso

**Level 3 (Operating Areas) under Belridge Complex:**
- Antelope Hills, Belgian Anticline, Belridge South
- Belridge (with sub-locations: Cogen 13/32 Ammonia, Energy, etc.)
- Brea-Yorba Linda
- CA East (BRY) → Poso Creek, Round Mountain, Mount Poso
- Utah (BRY) → Brundage Canyon Gas Plant

Use the Excel file at `/mnt/user-data/uploads/Dispatcher_Intake_Form_-_Locations_03_23_26.xlsx`, sheet "Dispatcher Intake Form Location" as the authoritative source. Parse it programmatically — it includes Entity Name, Field Manager/Ops Supervisor, Maintenance Supervisor, and Synonym/Regulated Facility flags per location.

### 1.11 Add Non-Field Location option (for Injury/Illness and MVI)
Add to Production Complex dropdown:
- **Non-Field Location** → triggers secondary dropdown:
  - Long Beach — 1 World Trade Center
  - Santa Clarita — 27200 Tourney, Suite 200
  - Bakersfield — 9500 Ming Ave
  - Bakersfield — 9600 Ming Ave
  - Bakersfield — 10000 Ming Ave (Oaks)
  - Bakersfield — 5300 District Blvd
  - Stockton — 2800 W. March Ln.
  - Sacramento — 1201 K Street
- **Off CRC Property** → triggers free-text field "Location (e.g., 400 W Broadway, Long Beach)"

---

## 2. SPILLS / RELEASES

### 2.1 Update Material dropdown
Replace current options with:
- Oil
- Produced Water
- Oil and Produced Water
- Steam
- Acrolein
- Anhydrous Ammonia
- Aqueous Ammonia
- CO2

### 2.2 Add "Waterway Impacted?" (between Material and Brief Description)
- Dropdown: **Yes / No / Unknown**
- If YES → show secondary dropdown "Type of Waterway Impacted":
  - Named Water Way
  - Unnamed Streambed
  - Ephemeral Streambed/Drainage
  - Intermittent Creek
  - Perennial Streambed
  - Storm Drain
  - Outfall
  - Catch Basin

### 2.3 Add "Estimated Volume" field (after Waterway)
- Numeric text input
- Unit toggle/dropdown: **Gallons** or **Barrels**
- Checkbox: **Unknown**

### 2.4 Add "Is this a DOT Line?" (before Brief Description)
- Dropdown: **Yes / No / Unknown**

### 2.5 Notifications — QI dropdown (for reportable spills)
When "Reportable Spill = Yes", show QI dropdown grouped by complex:

**Elk Hills Production Complex:**
- GEHA/BV Hills — Leon Sinden — 661-303-1221
- Valley Areas — Justin Narup — 661-556-1652
- All EHPC locations — Dan Culbertson — 661-978-5600
- Executive IC/QI — Johnathon Hilton — 970-985-5370

**Belridge Production Complex:**
- Belridge/MWSS/Lost Hills — Luke Chambers — 661-858-4603
- Coalinga/Kettleman/Kerman/Raisin City — Ali Zauner — 661-202-6001
- Coalinga/Kettleman/Kerman/Raisin City — Evan Morones — 805-508-6138
- San Ardo — Ali Zauner — 661-202-6001
- San Ardo — Brett Bane — 559-351-3228
- All BPC Locations — David Hauptman — 661-858-3864
- Executive IC/QI — Brett Illot — 661-978-2916

**Wilmington Production Complex:**
- Sacramento Basin — Erin Larner — 805-896-8074
- Sacramento Basin — Joe Carr — 209-662-3114
- Executive IC/QI — Dean Persinger — 562-900-0273
- [PENDING] LB, HB, Ventura QIs — leave placeholder

### 2.6 Notifications — OES and NRC: Change "Time" text box to "Confirmation Number"
- The timestamp is already captured by the checkbox click

### 2.7 Notifications — OSRO dropdown
Replace ASRO/OSRO text field with dropdown:
- Patriot Environmental — 800-624-9136
- General Production Services (Belridge ONLY) — 661-768-8031
- Ally Enterprises (Elk Hills) — 661-432-1311
- Marine Spill Response Corp (MSRC) — San Ardo Spills to Sargent Creek and Salinas River — 800-259-6772

### 2.8 Change "Notes" label to "Description provided to Cal OES"
- Only on the Spills/Releases call type

### 2.9 Add Cal OES Report Verification
- Checkbox: "Confirm Cal OES report posting for accurate language"
- Hyperlink button that opens: https://veoci.com/v/p/dashboard/7q4z24sxqb

### 2.10 External Notifications
- CalGEM Inland — 661-322-4031
- CalGEM Northern District — 916-322-1110
- [PENDING] Additional external notifications (State Lands, Long Beach, Monterey) — leave placeholder section

---

## 3. FIRE

### 3.1 Remove "Evacuations Needed"

### 3.2 Add "Fire Department Activation Required?" (where Evacuations was)
- Dropdown: **Yes / No**

### 3.3 Notifications changes:
- IOCC/CCF → dropdown (same as global 1.5)
- HSE On Call → dropdown (same as global 1.6)
- CalGEM Inland — 661-322-4031
- CalGEM Northern District — 916-322-1110
- Remove ROI, Alert Media, ICS Activation
- Rename Standard → Internal
- [PENDING] Additional external notifications — docx says "Xxxx" placeholder

---

## 4. INJURY / ILLNESS

### 4.1 Add Non-Field Location + Off CRC Property (see global 1.11)

### 4.2 Add "Body Part Injured" dropdown (on Step 1, near Brief Description)
Options:
- Head
- Eye
- Neck
- Torso
- Back
- Shoulder
- Arm
- Hand
- Hip
- Leg
- Knee
- Foot

### 4.3 Add "Type of Injury" dropdown (on Step 1, near Brief Description)
Options:
- CB — Caught Between / Compressed
- DLF — Different Level Fall
- DO — Dropped Object
- FD — Flying / Impact / Lodged Debris
- HAZ — Hazardous Substance
- HI — Heat Illness
- IU/S — Improper Use / Selection
- NO — Noise
- SB — Struck By
- SLF — Same Level Fall
- SOE — Strain or Over Exertion

Display format: "SOE — Strain or Over Exertion"

### 4.4 Add "Subject Transported?" (after EMS Required)
- Dropdown: **Yes / No**
- If YES → dropdown: **By EMS, By Supervisor, By Self**

### 4.5 Add "Subject Examined by Medical Personnel?"
- Dropdown: **Emergency Room, Occupational Health**

### 4.6 Notifications — same global changes (IOCC/CCF, HSE On Call, remove ROI/Alert Media)

---

## 5. WELL RELEASE

### 5.1 No changes to Step 1

### 5.2 Notifications changes:
- IOCC/CCF → dropdown (same as global)
- HSE On Call → dropdown (same as global)
- Add confirmation number fields for OES/NRC (same as Spills)
- [PENDING] Well-service team supervisors dropdown
- [PENDING] QI notification (Steph checking with Harris)
- Remove ROI

---

## 6. MOTOR VEHICLE INCIDENT (MVI)

### 6.1 Location — Mirror Injury/Illness structure
- Add Non-Field Location → office buildings dropdown (same list as 1.11)
- Add Off CRC Property → free-text "Location of Accident" field (e.g., "N/B Old River at White Lane Bakersfield")

### 6.2 Change "Anyone Injured?" to "Number of Injured Parties"
- Numeric input
- For EACH injured party (based on number entered), show a repeating section with:
  - **Is the injured party an employee?** (Yes/No or Employee/Contractor/Third Party)
  - **Type of Injury** dropdown:
    - Complaint of pain
    - Minor (Abrasions, bruising, lacerations — first aid on scene)
    - Major (Laceration requiring sutures, broken bones, loss of consciousness, OR transported by EMS)
    - Fatality
  - **Description Box** — free text for reported injury description
  - **Was injured party transported to Emergency Treatment?** (Yes/No)

### 6.3 Change "What did they hit?" to "Vehicle Involved With"
- Dropdown:
  - Other Vehicle(s)
  - Fixed Object → show "Type" text field for description
  - Pedestrian
  - Animal

### 6.4 Add "Member of the Public Involved?" on Step 1
- Checkbox: **Yes / No**

### 6.5 Add Law Enforcement fields (Step 2 / Notifications)
- **"Did Law Enforcement Respond?"** — Yes / No
- **"Was an Accident Report Taken?"** — Yes / No
  - If YES → **"Reporting Agency"** — free text field
  - If YES → **"Report Number"** — text field

### 6.6 Notifications — same global changes (IOCC/CCF, HSE On Call, remove ROI)

---

## 7. STILL PENDING (leave TODO comments in code)

| # | Item | Where |
|---|------|-------|
| 1 | Fire external notifications (State Lands, Long Beach, Monterey, etc.) | Fire notifications |
| 2 | Wilmington QI for Long Beach, HB, Ventura | Spills/Releases QI dropdown |
| 3 | Well-service team supervisors list | Well Release notifications |
| 4 | QI notification for Well Release (Harris confirmation) | Well Release notifications |
| 5 | BRY office locations (decision pending) | Non-field locations |

---

## 8. IMPLEMENTATION NOTES

- All phone numbers and names come from official CRC documents. Do NOT modify, infer, or supplement with external data.
- The HSE On Call list, QI list, and OSRO list should be stored as configuration data (e.g., a config file or SharePoint list) so they can be updated without code changes.
- Dropdowns showing "Name — Phone" should display the phone number visually but also store it for Power BI reporting.
- The KMS location hierarchy Excel file has 6 sheets — use "Dispatcher Intake Form Location" as the primary source since it includes Entity Name and Maintenance Supervisor columns that the other sheets don't have.
- Conditional fields (e.g., "if Waterway Impacted = Yes → show Type of Waterway") should animate smoothly and not break the form layout.
