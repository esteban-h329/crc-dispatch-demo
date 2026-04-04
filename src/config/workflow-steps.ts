import { CallType } from '../models';
import { IWorkflowStepDefinition } from '../models';
import { IOCC_CCF_DROPDOWN_OPTIONS, HSE_ON_CALL_DROPDOWN_OPTIONS } from './notification-contacts';

/**
 * Complete workflow definitions for all 10 CRC dispatch call types.
 * Each call type has exactly 2 steps: Quick Intake and Notifications & Close.
 *
 * Field naming conventions:
 * - location-picker fields always use name: 'location'
 * - conditionalOn.step uses 0 for Step 1 fields, 1 for Step 2 fields
 * - notification-checkbox fields always have autoTimestamp: true
 * - section-header fields always have isRequired: false
 * - phone-display fields always have isRequired: false
 */
export const WORKFLOW_STEPS: Record<CallType, ReadonlyArray<IWorkflowStepDefinition>> = {

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. SPILLS / RELEASES — Priority: High, Timer: 30 min
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.SpillsReleases]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the spill or release',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'reportableSpill', label: 'Reportable Spill?', type: 'select', isRequired: true, options: ['Yes', 'No', 'Unknown'] },
        { name: 'material', label: 'Material', type: 'select', isRequired: true, options: ['Oil', 'Produced Water', 'Oil and Produced Water', 'Steam', 'Acrolein', 'Anhydrous Ammonia', 'Aqueous Ammonia', 'CO2'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // Operations
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // If Reportable
        { name: 'reportableHeader', label: 'If Reportable', type: 'section-header', isRequired: false, conditionalOn: { field: 'reportableSpill', value: 'Yes', step: 0 } },
        {
          name: 'qiNotified', label: 'QI notified', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'reportableSpill', value: 'Yes', step: 0 },
          subFields: [
            { name: 'qiName', label: 'Name' },
            { name: 'qiTime', label: 'Time' },
          ],
        },
        {
          name: 'calOesNotified', label: 'CalOES — 800-852-7550', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          phoneNumber: '800-852-7550',
          conditionalOn: { field: 'reportableSpill', value: 'Yes', step: 0 },
          subFields: [
            { name: 'calOesTime', label: 'Time' },
          ],
        },
        {
          name: 'nrcNotified', label: 'NRC — 800-424-8802', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          phoneNumber: '800-424-8802',
          conditionalOn: { field: 'reportableSpill', value: 'Yes', step: 0 },
          subFields: [
            { name: 'nrcTime', label: 'Time' },
          ],
        },
        {
          name: 'osroNotified', label: 'OSRO', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'reportableSpill', value: 'Yes', step: 0 },
          subFields: [
            { name: 'osroTime', label: 'Time' },
          ],
        },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. FIRE — Priority: Critical
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.Fire]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the fire',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'fireActive', label: 'Fire still active?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'pastIncipient', label: 'Past incipient stage?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'evacuationsNeeded', label: 'Evacuations needed?', type: 'select', isRequired: false, options: ['Yes', 'No'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // If past incipient
        { name: 'pastIncipientHeader', label: 'If past incipient', type: 'section-header', isRequired: false, conditionalOn: { field: 'pastIncipient', value: 'Yes', step: 0 } },
        {
          name: 'called911', label: '911 called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'pastIncipient', value: 'Yes', step: 0 },
          subFields: [
            { name: 'called911Time', label: 'Time' },
          ],
        },
        {
          name: 'escortCoordinated', label: 'Escort coordinated', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'pastIncipient', value: 'Yes', step: 0 },
          subFields: [
            { name: 'gateIntersection', label: 'Gate/Intersection', placeholder: 'Gate/Intersection' },
          ],
        },

        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },
        {
          name: 'calGemNotified', label: 'CalGEM (at HSE direction)', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          subFields: [
            { name: 'calGemTime', label: 'Time' },
          ],
        },

        // If applicable
        { name: 'ifApplicableHeader', label: 'If applicable', type: 'section-header', isRequired: false },
        { name: 'windWolvesNotified', label: 'Wind Wolves Preserve (Pleito/Landslide/Pioneer/Metson)', type: 'notification-checkbox', isRequired: false, autoTimestamp: true },
        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. INJURY / ILLNESS — Priority: High
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.InjuryIllness]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the injury or illness',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'injuryOrIllness', label: 'Injury or Illness?', type: 'select', isRequired: true, options: ['Injury', 'Illness'] },
        { name: 'emsRequired', label: 'EMS Required?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'briefDescription', label: 'Brief Description of injury/symptoms', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // If EMS required
        { name: 'emsHeader', label: 'If EMS required', type: 'section-header', isRequired: false, conditionalOn: { field: 'emsRequired', value: 'Yes', step: 0 } },
        {
          name: 'called911', label: '911 called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emsRequired', value: 'Yes', step: 0 },
          subFields: [
            { name: 'called911Time', label: 'Time' },
          ],
        },
        {
          name: 'escortCoordinated', label: 'Escort coordinated', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emsRequired', value: 'Yes', step: 0 },
          subFields: [
            { name: 'gateIntersection', label: 'Gate/Intersection', placeholder: 'Gate/Intersection' },
          ],
        },

        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. WELL RELEASE — Priority: Critical, Timer: 30 min
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.WellRelease]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the well release',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'materialReleased', label: 'Material Released', type: 'select', isRequired: true, options: ['Steam', 'Oil', 'Gas', 'Produced Water'] },
        { name: 'activeRelease', label: 'Active Release?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'emsNeeded', label: 'Injuries? EMS needed?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'impactsToPublic', label: 'Impacts to public?', type: 'select', isRequired: false, options: ['Yes', 'No'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // If EMS
        { name: 'emsHeader', label: 'If EMS needed', type: 'section-header', isRequired: false, conditionalOn: { field: 'emsNeeded', value: 'Yes', step: 0 } },
        {
          name: 'called911', label: '911 called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emsNeeded', value: 'Yes', step: 0 },
          subFields: [
            { name: 'called911Time', label: 'Time' },
          ],
        },
        {
          name: 'escortCoordinated', label: 'Escort coordinated', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emsNeeded', value: 'Yes', step: 0 },
        },

        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },
        { name: 'wellServiceTeam', label: 'Well Service Team (if instructed by HSE)', type: 'notification-checkbox', isRequired: false, autoTimestamp: true },

        // Reportable determination (made during the call)
        { name: 'reportableHeader', label: 'Reportable Determination', type: 'section-header', isRequired: false },
        { name: 'reportable', label: 'Reportable?', type: 'select', isRequired: false, options: ['Yes', 'No'] },
        {
          name: 'calOesNotified', label: 'CalOES — 800-852-7550', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          phoneNumber: '800-852-7550',
          conditionalOn: { field: 'reportable', value: 'Yes', step: 1 },
          subFields: [
            { name: 'calOesTime', label: 'Time' },
          ],
        },
        {
          name: 'nrcNotified', label: 'NRC — 800-424-8802', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          phoneNumber: '800-424-8802',
          conditionalOn: { field: 'reportable', value: 'Yes', step: 1 },
          subFields: [
            { name: 'nrcTime', label: 'Time' },
          ],
        },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. LINE STRIKE — Priority: High
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.LineStrike]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the line strike',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'lineType', label: 'Type of line', type: 'select', isRequired: true, options: ['DOT', 'Flowline', 'Group', 'Gas', 'Water', 'Electrical OH', 'Electrical Buried'] },
        { name: 'fluidGasReleased', label: 'Fluid/gas released?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'lineIsolated', label: 'Line isolated?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'injuries', label: 'Injuries?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'dotLineInvolved', label: 'DOT line involved?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // If DOT line
        { name: 'dotHeader', label: 'If DOT line — remind HSE to coordinate with:', type: 'section-header', isRequired: false, conditionalOn: { field: 'dotLineInvolved', value: 'Yes', step: 0 } },
        { name: 'brookeGomezPhone', label: 'Brooke Gomez', type: 'phone-display', isRequired: false, phoneNumber: '661-788-9204', conditionalOn: { field: 'dotLineInvolved', value: 'Yes', step: 0 } },
        { name: 'esmeraldaMacedoPhone', label: 'Esmeralda Macedo', type: 'phone-display', isRequired: false, phoneNumber: '562-331-4841', conditionalOn: { field: 'dotLineInvolved', value: 'Yes', step: 0 } },
        { name: 'shawnRasmussenPhone', label: 'Shawn Rasmussen', type: 'phone-display', isRequired: false, phoneNumber: '661-401-1879', conditionalOn: { field: 'dotLineInvolved', value: 'Yes', step: 0 } },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. AIR BREAKDOWN — Priority: High, Timer: 1 hour
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.AirBreakdown]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the air breakdown',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'equipmentInvolved', label: 'Equipment Involved', type: 'text', isRequired: true },
        { name: 'discoveryDateTime', label: 'Date/Time of Discovery', type: 'datetime', isRequired: true },
        { name: 'causeOfBreakdown', label: 'Cause of Breakdown', type: 'text', isRequired: true },
        { name: 'permitFacilityNumber', label: 'Permit/Facility Number', type: 'text', isRequired: true, placeholder: 'From HSE Rep' },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: false },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call (to confirm breakdown)', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // APCD Notification
        { name: 'apcdHeader', label: 'APCD Notification', type: 'section-header', isRequired: false },
        {
          name: 'apcdCalled', label: 'APCD called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          subFields: [
            { name: 'apcdDistrict', label: 'District' },
            { name: 'apcdTime', label: 'Time' },
          ],
        },
        { name: 'northDistrictPhone', label: 'North (San Joaquin, Stanislaus, Merced)', type: 'phone-display', isRequired: false, phoneNumber: '(209) 557-6400' },
        { name: 'centralDistrictPhone', label: 'Central (Madera, Fresno, Kings)', type: 'phone-display', isRequired: false, phoneNumber: '(559) 230-6000' },
        { name: 'southDistrictPhone', label: 'South (Tulare, Kern)', type: 'phone-display', isRequired: false, phoneNumber: '(661) 392-5540' },

        { name: 'belridgeNote', label: 'Belridge Complex uses legacy Aera application (preferred). Exceptions: North Antelope Hills, portions of South Belridge, Kettleman, Kerman.', type: 'section-header', isRequired: false },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. MVI (Motor Vehicle Incident) — Priority: High
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.MVI]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the motor vehicle incident',
      isRequired: true,
      fields: [
        { name: 'emergencyNeeded', label: '911 needed?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'anyoneInjured', label: 'Anyone injured?', type: 'select', isRequired: true, options: ['Yes', 'No'] },
        { name: 'whatDidTheyHit', label: 'What did they hit?', type: 'select', isRequired: true, options: ['Vehicle', 'Pipeline', 'Wellhead', 'Bollard', 'Animal', 'Other'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
        { name: 'photoSentToCoc', label: 'Photo sent to COC cell?', type: 'checkbox', isRequired: false },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // If EMS
        { name: 'emsHeader', label: 'If EMS needed', type: 'section-header', isRequired: false, conditionalOn: { field: 'emergencyNeeded', value: 'Yes', step: 0 } },
        {
          name: 'called911', label: '911 called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emergencyNeeded', value: 'Yes', step: 0 },
          subFields: [
            { name: 'called911Time', label: 'Time' },
          ],
        },
        {
          name: 'escortCoordinated', label: 'Escort coordinated', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          conditionalOn: { field: 'emergencyNeeded', value: 'Yes', step: 0 },
        },

        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. SECURITY EVENT — Priority: Medium
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.SecurityEvent]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Gather initial details about the security event',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'location', label: 'Location', type: 'location-picker', isRequired: true },
        { name: 'gpsCoordinates', label: 'GPS Coordinates', type: 'text', isRequired: false, placeholder: 'Lat, Long' },
        { name: 'eventType', label: 'Event Type', type: 'select', isRequired: true, options: ['Theft', 'Vandalism', 'Trespassing', 'Cut locks', 'Suspicious activity', 'Other'] },
        { name: 'estimatedValueOfLoss', label: 'Estimated value of loss/damage ($)', type: 'number', isRequired: false },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // If in progress or emergency
        { name: 'emergencyHeader', label: 'If in progress or emergency', type: 'section-header', isRequired: false },
        {
          name: 'called911', label: '911 called', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          subFields: [
            { name: 'called911Time', label: 'Time' },
          ],
        },

        // Security Advisor (business hours)
        { name: 'securityAdvisorHeader', label: 'Security Advisor (business hours)', type: 'section-header', isRequired: false },
        { name: 'richHillNotified', label: 'EH/Belridge: Rich Hill', type: 'notification-checkbox', isRequired: false, autoTimestamp: true, phoneNumber: '(949) 933-2451' },
        { name: 'thomasCrouthersNotified', label: 'Wilmington/Sac/Ventura: Thomas Crouthers', type: 'notification-checkbox', isRequired: false, autoTimestamp: true, phoneNumber: '(562) 544-6308' },
        { name: 'stephanieMillsNotified', label: 'Alt: Stephanie Mills', type: 'notification-checkbox', isRequired: false, autoTimestamp: true, phoneNumber: '(661) 477-1851' },

        // After hours
        { name: 'afterHoursHeader', label: 'After hours', type: 'section-header', isRequired: false },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // If loss > $950 or vandalism > $400
        { name: 'kcsoHeader', label: 'If loss > $950 or vandalism > $400', type: 'section-header', isRequired: false },
        { name: 'kcsoDispatchNotified', label: 'KCSO Dispatch', type: 'notification-checkbox', isRequired: false, autoTimestamp: true, phoneNumber: '(661) 861-3110' },

        // Patrol
        { name: 'patrolHeader', label: 'Patrol', type: 'section-header', isRequired: false },
        {
          name: 'areaPatrolDispatched', label: 'Area patrol dispatched', type: 'notification-checkbox', isRequired: false, autoTimestamp: true,
          subFields: [
            { name: 'area', label: 'Area', placeholder: 'EH / BV / Oasis / Oaks' },
          ],
        },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. WEATHER ALERT — Priority: Medium
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.WeatherAlert]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Capture weather alert details',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: true },
        { name: 'eventType', label: 'Event type', type: 'select', isRequired: true, options: ['Wildfire', 'Severe storm', 'Earthquake', 'Tsunami', 'Mudslide', 'Snow-ice', 'High winds', 'Other'] },
        { name: 'affectedAreas', label: 'Affected areas', type: 'textarea', isRequired: true },
        { name: 'threatLevel', label: 'Threat level', type: 'select', isRequired: true, options: ['Advisory', 'Watch', 'Warning', 'Emergency'] },
        { name: 'evacuationsNeeded', label: 'Evacuations needed?', type: 'select', isRequired: false, options: ['Yes', 'No'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Notifications & Close',
      description: 'Complete notifications and documentation',
      isRequired: true,
      fields: [
        // Internal Notifications
        { name: 'internalHeader', label: 'Internal Notifications', type: 'section-header', isRequired: false },
        { name: 'ioccCcfSelection', label: 'IOCC / CCF', type: 'select', isRequired: false, options: [...IOCC_CCF_DROPDOWN_OPTIONS] },
        { name: 'hseOnCallSelection', label: 'HSE On-Call', type: 'select', isRequired: false, options: [...HSE_ON_CALL_DROPDOWN_OPTIONS] },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false, placeholder: 'if significant' },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. GENERAL OPERATIONS — Priority: Low
  // ─────────────────────────────────────────────────────────────────────────────
  [CallType.GeneralOperations]: [
    {
      stepNumber: 1,
      title: 'Quick Intake',
      description: 'Capture general operations call details',
      isRequired: true,
      fields: [
        { name: 'callerName', label: 'Caller Name', type: 'text', isRequired: true },
        { name: 'contactNumber', label: 'Contact Number', type: 'text', isRequired: false },
        { name: 'category', label: 'Category', type: 'select', isRequired: true, options: ['Info request', 'Phone transfer', 'Gate access', 'Agency visitor', 'Tech issue', 'Bakersfield forwarded', 'Call-out request', 'Other'] },
        { name: 'briefDescription', label: 'Brief Description', type: 'textarea', isRequired: true },
      ],
    },
    {
      stepNumber: 2,
      title: 'Actions & Close',
      description: 'Document actions taken and close the call',
      isRequired: true,
      fields: [
        { name: 'actionTaken', label: 'Action taken', type: 'textarea', isRequired: false },
        { name: 'transferredTo', label: 'Transferred to', type: 'text', isRequired: false, placeholder: 'Name/Dept' },
        { name: 'dailyLogCompleted', label: 'Daily Log entry completed', type: 'checkbox', isRequired: false },

        // Documentation
        { name: 'documentationHeader', label: 'Documentation', type: 'section-header', isRequired: false },
        { name: 'kmsNumber', label: 'KMS #', type: 'text', isRequired: false, placeholder: 'only if instructed' },
        { name: 'notes', label: 'Notes', type: 'textarea', isRequired: false },
      ],
    },
  ],
};
