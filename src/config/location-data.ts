export enum ProductionComplex {
  ElkHills = 'Elk Hills',
  Belridge = 'Belridge',
  Wilmington = 'Wilmington',
}

export interface ILocation {
  readonly id: string;
  readonly name: string;
  readonly productionComplex: ProductionComplex;
  readonly entityName: string;
  readonly county: string;
  readonly cupa: string;
  readonly cupaPhone?: string;
  readonly lawEnforcement: string;
  readonly isSJV: boolean;
}

// All 65 CRC production locations
export const LOCATIONS: ReadonlyArray<ILocation> = [
  // ── Elk Hills Production Complex (22 locations) ──────────────────
  { id: 'eh-field', name: 'Elk Hills Field locations', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Elk Hills, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-cgp1', name: 'Elk Hills CGP-1', productionComplex: ProductionComplex.ElkHills, entityName: 'Elk Hills Power, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-power', name: 'Elk Hills Power', productionComplex: ProductionComplex.ElkHills, entityName: 'Elk Hills Power, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-kern-front', name: 'Kern Front', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-mount-poso', name: 'Mount Poso', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-ant-hill', name: 'Ant Hill', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-north-shafter', name: 'North Shafter', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-wasco', name: 'Wasco', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-semitropic', name: 'Semitropic', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-paloma', name: 'Paloma', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-landslide', name: 'Landslide', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-pleito-ranch', name: 'Pleito Ranch', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-pleito-creek', name: 'Pleito Creek', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-tejon', name: 'Tejon', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-rio-viejo', name: 'Rio Viejo', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-oxnard', name: 'Oxnard', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-coles-levee', name: 'Coles Levee', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-yowlumne', name: 'Yowlumne', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-wheeler-ridge', name: 'Wheeler Ridge', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-bv-hills', name: 'BV Hills', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'eh-bv-nose', name: 'BV Nose', productionComplex: ProductionComplex.ElkHills, entityName: 'California Resources Production Corporation', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },

  // ── Belridge Production Complex (14 locations) ───────────────────
  { id: 'bv-belridge', name: 'Belridge', productionComplex: ProductionComplex.Belridge, entityName: 'Aera Energy, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-midway-sunset', name: 'Midway Sunset', productionComplex: ProductionComplex.Belridge, entityName: 'Aera Energy, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-lost-hills', name: 'Lost Hills (S & N of Hwy 46)', productionComplex: ProductionComplex.Belridge, entityName: 'Aera Energy, LLC', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-coalinga', name: 'Coalinga', productionComplex: ProductionComplex.Belridge, entityName: 'Aera Energy, LLC', county: 'Fresno', cupa: 'Fresno County Department of Health', cupaPhone: '(559) 600-3357', lawEnforcement: 'Coalinga PD / Kings County SO', isSJV: true },
  { id: 'bv-san-ardo', name: 'San Ardo', productionComplex: ProductionComplex.Belridge, entityName: 'Aera Energy, LLC', county: 'Monterey', cupa: 'Monterey County Hazardous Materials Management Services', cupaPhone: '(831) 755-4500', lawEnforcement: 'Monterey County SO', isSJV: false },
  { id: 'bv-north-antelope', name: 'North Antelope Hills', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-south-belridge', name: 'South Belridge', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-mcdonald', name: 'McDonald Anticline', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-belgian', name: 'Belgian Anticline', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-devils-den', name: "Devil's Den", productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kern', cupa: 'Kern County Environmental Health Services', cupaPhone: '(661) 549-9927', lawEnforcement: "Kern County Sheriff's Office", isSJV: true },
  { id: 'bv-kettleman', name: 'Kettleman', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Kings', cupa: 'Kings County Department of Public Health', cupaPhone: '(559) 584-1411', lawEnforcement: 'Avenal PD / Kings County SO', isSJV: true },
  { id: 'bv-kerman', name: 'Kerman', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Fresno', cupa: 'Fresno County Department of Health', cupaPhone: '(559) 600-3357', lawEnforcement: 'Kings County SO', isSJV: true },
  { id: 'bv-riverdale', name: 'Riverdale', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Fresno', cupa: 'Fresno County Department of Health', cupaPhone: '(559) 600-3357', lawEnforcement: 'Kings County SO', isSJV: true },
  { id: 'bv-raisin-city', name: 'Raisin City', productionComplex: ProductionComplex.Belridge, entityName: 'CA Resources Production Corp', county: 'Fresno', cupa: 'Fresno County Department of Health', cupaPhone: '(559) 600-3357', lawEnforcement: 'Kings County SO', isSJV: true },

  // ── Wilmington Production Complex (29 locations) ─────────────────

  // Sacramento Basin
  { id: 'wm-rio-vista', name: 'Rio Vista', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Production Corp', county: 'Solano', cupa: 'Solano County Environmental Health Services', lawEnforcement: 'Rio Vista PD / Solano County SO', isSJV: false },
  { id: 'wm-yuba-city', name: 'Yuba City', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Production Corp', county: 'Sutter', cupa: 'Sutter County Environmental Health', lawEnforcement: 'Yuba City PD', isSJV: false },
  { id: 'wm-grimes', name: 'Grimes', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Production Corp', county: 'Colusa', cupa: 'Colusa County Environmental Health', lawEnforcement: 'Colusa County SO', isSJV: false },
  { id: 'wm-willows', name: 'Willows', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Production Corp', county: 'Glenn', cupa: 'Glenn County Environmental Health', lawEnforcement: 'Glenn County SO', isSJV: false },
  { id: 'wm-tompkins-hill', name: 'Tompkins Hill', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Production Corp', county: 'Humboldt', cupa: 'Humboldt County Division of Environmental Health', lawEnforcement: 'Fortuna PD', isSJV: false },

  // Long Beach / THUMS
  { id: 'wm-island-chaffee', name: 'Island Chaffee', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-island-white', name: 'Island White', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-island-grissom', name: 'Island Grissom', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-island-freeman', name: 'Island Freeman', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-pier-j', name: 'Pier J', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-pier-g', name: 'Pier G', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-pier-g-warehouse', name: 'Pier G Warehouse', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-bm', name: 'B&M', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD', isSJV: false },
  { id: 'wm-thums-power', name: 'THUMS Power Plant', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD', isSJV: false },
  { id: 'wm-thums-drilling', name: 'THUMS Drilling Yard', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-plaza-yard', name: 'Plaza Yard', productionComplex: ProductionComplex.Wilmington, entityName: 'THUMS Long Beach Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-pico', name: 'Pico', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Long Beach, Inc.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD', isSJV: false },
  { id: 'wm-tesoro', name: 'Tesoro Refinery', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Long Beach, Inc.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD', isSJV: false },
  { id: 'wm-andon-youngstown', name: 'Andon Youngstown', productionComplex: ProductionComplex.Wilmington, entityName: 'CA Resources Long Beach, Inc.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD', isSJV: false },
  { id: 'wm-tidelands-north', name: 'Tidelands North Ops', productionComplex: ProductionComplex.Wilmington, entityName: 'Tidelands Oil Production Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-tidelands-south', name: 'Tidelands South Ops', productionComplex: ProductionComplex.Wilmington, entityName: 'Tidelands Oil Production Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-tidelands-xy', name: 'Tidelands XY Tank Farm', productionComplex: ProductionComplex.Wilmington, entityName: 'Tidelands Oil Production Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-tidelands-z12', name: 'Tidelands Z1 2 Tank Farm', productionComplex: ProductionComplex.Wilmington, entityName: 'Tidelands Oil Production Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },
  { id: 'wm-tidelands-warehouse', name: 'Tidelands Warehouse', productionComplex: ProductionComplex.Wilmington, entityName: 'Tidelands Oil Production Co.', county: 'Los Angeles', cupa: 'LA County Fire Dept', lawEnforcement: 'Long Beach PD / Port Harbor Patrol', isSJV: false },

  // Huntington Beach / Ventura
  { id: 'wm-huntington-beach', name: 'Huntington Beach', productionComplex: ProductionComplex.Wilmington, entityName: 'So Cal Holdings, LLC', county: 'Orange', cupa: 'Orange County Health Care Agency', lawEnforcement: 'Huntington Beach PD', isSJV: false },
  { id: 'wm-platform-emmy', name: 'Platform Emmy', productionComplex: ProductionComplex.Wilmington, entityName: 'So Cal Holdings, LLC', county: 'Orange', cupa: 'Orange County Health Care Agency', lawEnforcement: 'HB PD / Orange County SD', isSJV: false },
  { id: 'wm-hb-gas-plant', name: 'HB Gas Plant', productionComplex: ProductionComplex.Wilmington, entityName: 'So Cal Holdings, LLC', county: 'Orange', cupa: 'Orange County Health Care Agency', lawEnforcement: 'Huntington Beach PD', isSJV: false },
  { id: 'wm-hb-warehouse', name: 'HB Warehouse', productionComplex: ProductionComplex.Wilmington, entityName: 'So Cal Holdings, LLC', county: 'Orange', cupa: 'Orange County Health Care Agency', lawEnforcement: 'Huntington Beach PD', isSJV: false },
  { id: 'wm-ventura-field', name: 'Ventura field locations', productionComplex: ProductionComplex.Wilmington, entityName: 'Aera Energy, LLC', county: 'Ventura', cupa: 'Ventura County Environmental Health Division', lawEnforcement: 'Ventura County SO', isSJV: false },
  { id: 'wm-ventura-gp6', name: 'Ventura Gas Plant 6', productionComplex: ProductionComplex.Wilmington, entityName: 'Aera Energy, LLC', county: 'Ventura', cupa: 'Ventura County Environmental Health Division', lawEnforcement: 'Ventura County SO', isSJV: false },
  { id: 'wm-ventura-gp7', name: 'Ventura Gas Plant 7', productionComplex: ProductionComplex.Wilmington, entityName: 'Aera Energy, LLC', county: 'Ventura', cupa: 'Ventura County Environmental Health Division', lawEnforcement: 'Ventura County SO', isSJV: false },
];

export function getLocationsByComplex(complex: ProductionComplex): ReadonlyArray<ILocation> {
  return LOCATIONS.filter((loc) => loc.productionComplex === complex);
}

export function getLocationById(id: string): ILocation | undefined {
  return LOCATIONS.find((loc) => loc.id === id);
}
