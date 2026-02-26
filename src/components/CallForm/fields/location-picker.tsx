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
  readonly _locationCounty: string;
  readonly _locationCupa: string;
  readonly _locationCupaPhone: string;
  readonly _locationLawEnforcement: string;
  readonly _locationIsSJV: boolean;
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
];

export const LocationPicker: React.FC<ILocationPickerProps> = ({
  value,
  onChange,
  onBlur,
}) => {
  // Resolve the selected complex and location from value
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
        _locationCounty: location.county,
        _locationCupa: location.cupa,
        _locationCupaPhone: location.cupaPhone ?? '',
        _locationLawEnforcement: location.lawEnforcement,
        _locationIsSJV: location.isSJV,
      });
    },
    [selectedComplex, onChange],
  );

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
            {filteredLocations.map((loc) => (
              <Option key={loc.id} value={loc.id}>
                {loc.name}
              </Option>
            ))}
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
          <Body1 style={{ fontWeight: 600 }}>Entity:</Body1>
          <Body1>{selectedLocation.entityName}</Body1>
          <Body1 style={{ fontWeight: 600 }}>County:</Body1>
          <Body1>{selectedLocation.county}</Body1>
          <Body1 style={{ fontWeight: 600 }}>CUPA:</Body1>
          <Body1>{selectedLocation.cupa}</Body1>
          <Body1 style={{ fontWeight: 600 }}>Law Enforcement:</Body1>
          <Body1>{selectedLocation.lawEnforcement}</Body1>
        </div>
      )}
    </div>
  );
};
