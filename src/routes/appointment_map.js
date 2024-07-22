import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const AppointmentMap = ({ appointments }) => {
  const center = [35.6895, 139.6917]; // 東京の中心座標

  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {appointments.map((appointment, index) => (
        <Marker key={index} position={appointment.position}>
          <Popup>{appointment.name}</Popup>
        </Marker>
      ))}
      <Polyline
        positions={appointments.map(a => a.position)}
        color="red"
      />
    </MapContainer>
  );
};

export default AppointmentMap;