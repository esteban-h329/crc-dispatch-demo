import * as React from 'react';
import {
  Dropdown,
  Option,
  Field,
  Body1,
  tokens,
} from '@fluentui/react-components';
import {
  ProductionComplex,
  getLocationsByComplex,
  getLocationById,
  ILocation,
} from '../../../config/location-data';

export interface ILocationPickerValue {
  readonly locationId: string;
  readonly productionComplex: string;
  readonly _locationEntityName: string;
  readonly _locationSupervisor: string;
  readonly _locationMaintenanceSupervisor: string;
  readonly _locationOperatingArea: string;
  readonly _locationIsRegulated: boolean;
}

interface ILocationPickerProps {
  readonly value: ILocationPickerValue | string | undefined;
  readonly onChange: (value: ILocationPickerValue) => void;
  readonly onBlur: () => void;
}

const COMPLEX_OPTIONS: ReadonlyArray<ProductionComplex> = [
  ProductionComplex.ElkHills,
  ProductionComplex.Belridge,
  ProductionComplex.Wilmington,
  ProductionComplex.CarbonTerraVault,
  ProductionComplex.NonOperatingArea,
];

export const LocationPicker: React.FC<ILocationPickerProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  const resolvedValue = typeof value === 'object' && value !== null ? value : undefined;
  const [selectedComplex, setSelectedComplex] = React.useState<ProductionComplex | undefined>(
    resolvedValue?.productionComplex as ProductionComplex | undefined,
  );

  const filteredLocations = React.useMemo<ReadonlyArray<ILocation>>(() => {
    if (!selectedComplex) return [];
    return getLocationsByComplex(selectedComplex);
  }, [selectedComplex]);

  const selectedLocationId = resolvedValue?.locationId ?? '';
  const selectedLocation = selectedLocationId ? getLocationById(selectedLocationId) : undefined;

  const handleComplexChange = React.useCallback(
    (_e: unknown, data: { optionValue?: string }) => {
      const complex = data.optionValue as ProductionComplex | undefined;
      setSelectedComplex(complex);
    },
    [],
  );

  const handleLocationChange = React.useCallback(
    (_e: unknown, data: { optionValue?: string }) => {
      const locationId = data.optionValue ?? '';
      const location = getLocationById(locationId);
      if (!location || !selectedComplex) return;

      onChange({
        locationId: location.id,
        productionComplex: selectedComplex,
        _locationEntityName: location.entityName,
        _locationSupervisor: location.fieldManagerSupervisor,
        _locationMaintenanceSupervisor: location.maintenanceSupervisor,
        _locationOperatingArea: location.operatingArea ?? '',
        _locationIsRegulated: location.isRegulatedFacility,
      });
    },
    [selectedComplex, onChange],
  );

  // Group locations by operating area for better UX
  const groupedLocations = React.useMemo(() => {
    const groups: Array<{ area: string; locations: ReadonlyArray<ILocation> }> = [];
    let currentArea = '';
    let currentGroup: ILocation[] = [];

    for (const loc of filteredLocations) {
      const area = loc.operatingArea ?? '';
      if (area !== currentArea) {
        if (currentGroup.length > 0) {
          groups.push({ area: currentArea, locations: currentGroup });
        }
        currentArea = area;
        currentGroup = [loc];
      } else {
        currentGroup.push(loc);
      }
    }
    if (currentGroup.length > 0) {
      groups.push({ area: currentArea, locations: currentGroup });
    }
    return groups;
  }, [filteredLocations]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Production Complex dropdown */}
      <Field label="Production Complex" required style={{ display: 'grid', gap: '4px' }}>
        <Dropdown
          value={selectedComplex ?? ''}
          selectedOptions={selectedComplex ? [selectedComplex] : []}
          onOptionSelect={handleComplexChange}
          onBlur={onBlur}
          placeholder="Select production complex"
        >
          {COMPLEX_OPTIONS.map((complex) => (
            <Option key={complex} value={complex}>
              {complex}
            </Option>
          ))}
        </Dropdown>
      </Field>

      {/* Location dropdown (filtered by complex) */}
      {selectedComplex && (
        <Field label="Location" required style={{ display: 'grid', gap: '4px' }}>
          <Dropdown
            value={selectedLocation?.name ?? ''}
            selectedOptions={selectedLocationId ? [selectedLocationId] : []}
            onOptionSelect={handleLocationChange}
            onBlur={onBlur}
            placeholder="Select location"
          >
            {groupedLocations.map((group) =>
              group.locations.map((loc) => (
                <Option key={loc.id} value={loc.id}>
                  {loc.operatingArea ? `${loc.name}` : loc.name}
                </Option>
              )),
            )}
          </Dropdown>
        </Field>
      )}

      {/* Auto-populated info display */}
      {selectedLocation && (
        <div
          style={{
            padding: '10px 14px',
            backgroundColor: tokens.colorNeutralBackground3,
            borderRadius: '6px',
            fontSize: '13px',
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: '4px 12px',
            color: tokens.colorNeutralForeground2,
          }}
        >
          {selectedLocation.entityName && (
            <>
              <Body1 style={{ fontWeight: 600 }}>Entity:</Body1>
              <Body1>{selectedLocation.entityName}</Body1>
            </>
          )}
          {selectedLocation.fieldManagerSupervisor && (
            <>
              <Body1 style={{ fontWeight: 600 }}>Field Manager:</Body1>
              <Body1>{selectedLocation.fieldManagerSupervisor}</Body1>
            </>
          )}
          {selectedLocation.maintenanceSupervisor && (
            <>
              <Body1 style={{ fontWeight: 600 }}>Maintenance Sup:</Body1>
              <Body1>{selectedLocation.maintenanceSupervisor}</Body1>
            </>
          )}
          {selectedLocation.isRegulatedFacility && (
            <>
              <Body1 style={{ fontWeight: 600 }}>Regulated:</Body1>
              <Body1>{selectedLocation.synonyms}</Body1>
            </>
          )}
        </div>
      )}
    </div>
  );
};
