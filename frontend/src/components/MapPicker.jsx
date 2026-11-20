import { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents
} from 'react-leaflet';

const DEFAULT_POSITION = [10.9905, 76.9614];

function LocationSelector({ onLocationSelect }) {
  useMapEvents({
    click(event) {
      onLocationSelect({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng
      });
    }
  });

  return null;
}

function MapPicker({ onLocationSelect, initialPosition }) {
  const [position, setPosition] = useState(
    initialPosition || null
  );

  const handleMapClick = (location) => {
    setPosition([location.latitude, location.longitude]);
    onLocationSelect(location);
  };

  return (
    <div style={{ width: '100%', height: '350px' }}>
      <MapContainer
        center={position || DEFAULT_POSITION}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector onLocationSelect={handleMapClick} />

        {position && (
          <CircleMarker
            center={position}
            radius={9}
            pathOptions={{ color: 'green' }}
          >
            <Popup>Selected pickup location</Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}

export default MapPicker;