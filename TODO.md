# CRC Dispatch — Pending Items

Items marked as pending in the CLAUDE_CODE_INSTRUCTIONS_v2.md that require additional
information or decisions before they can be implemented.

---

## 1. Fire — External Notifications
**File:** `src/config/workflow-steps.ts` (Fire, Step 2)
**Status:** Awaiting contact list
**Details:** The Dispinterface change document lists placeholder "Xxxx" entries for
additional external notifications on the Fire call type. These likely include:
- State Lands Commission
- City of Long Beach
- Monterey County
- Other agency contacts

**Action needed:** Provide the specific agency names and phone numbers.

---

## 2. Spills/Releases — External Notifications
**File:** `src/config/workflow-steps.ts` (Spills/Releases, Step 2)
**Status:** Awaiting contact list
**Details:** Same as Fire — additional external notifications beyond CalGEM Inland
and CalGEM Northern District. May include:
- State Lands Commission
- City of Long Beach
- Monterey County agencies

**Action needed:** Provide the specific agency names and phone numbers.

---

## 3. Wilmington QI — Long Beach, Huntington Beach, Ventura
**File:** `src/config/notification-contacts.ts` (QI_CONTACTS)
**Status:** Awaiting confirmation
**Details:** The QI dropdown for Wilmington Production Complex currently has Sacramento
Basin and Executive IC/QI contacts, but is missing QI assignments for:
- Long Beach operations
- Huntington Beach operations
- Ventura operations

**Action needed:** Provide the QI name(s) and phone number(s) for these areas.

---

## 4. Well Release — Well-Service Team Supervisors
**File:** `src/config/workflow-steps.ts` (Well Release, Step 2)
**Status:** Awaiting supervisor list
**Details:** The Well Service Team notification currently uses a simple checkbox. It
needs to be converted to a dropdown with specific well-service team supervisors,
similar to how HSE On-Call was updated.

**Action needed:** Provide the list of well-service team supervisors with phone numbers.

---

## 5. Well Release — QI Notification
**File:** `src/config/workflow-steps.ts` (Well Release, Step 2)
**Status:** Awaiting confirmation from Harris
**Details:** Steph is checking with Harris about whether a QI notification field
should be added to the Well Release call type, and if so, which QI contacts apply.

**Action needed:** Confirm whether QI notification is needed and provide contacts.

---

## 6. Non-Field Locations — BRY Offices
**File:** `src/config/notification-contacts.ts` (NON_FIELD_LOCATIONS)
**Status:** Decision pending
**Details:** The Dispinterface change document mentions "I have BRY Locations if we
want to add them" for the Non-Field Location dropdown used in Injury/Illness and MVI.
Currently the list includes Long Beach, Santa Clarita, Bakersfield (4 locations),
Stockton, and Sacramento offices.

**Action needed:** Decide whether to add BRY (Berry Petroleum) office locations and
provide the addresses if yes.
