
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import { data } from './data';

// Manually define marker icon
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const uniqueCountries = [...new Set(data.map(d => d.country))];
const uniqueTypes = [...new Set(data.map(d => d.type))];

export default function App() {
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);

  const handleMultiSelectChange = (event, setFunc) => {
    const selected = Array.from(event.target.selectedOptions).map(o => o.value);
    setFunc(selected);
  };

  const filteredData = data.filter(site => {
    const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(site.country);
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(site.type);
    return countryMatch && typeMatch;
  });

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <div style={{ position: 'absolute', zIndex: 1000, background: 'white', padding: '10px', margin: '10px', borderRadius: '8px' }}>
        <label>
          Country:
          <select multiple value={selectedCountries} onChange={e => handleMultiSelectChange(e, setSelectedCountries)}>
            {uniqueCountries.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </label>
        <label style={{ marginLeft: '12px' }}>
          Type:
          <select multiple value={selectedTypes} onChange={e => handleMultiSelectChange(e, setSelectedTypes)}>
            {uniqueTypes.map((t, i) => <option key={i} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <MapContainer center={[-10, 20]} zoom={3} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {filteredData.map((site, idx) => (
          <Marker key={idx} position={[site.lat, site.lon]}>
            <Popup>
              <strong>{site.name}</strong><br />
              <em>{site.operator}</em><br />
              Country: {site.country}<br />
              Type: {site.type}<br />
              产量: {site.production} 千吨 Cu
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
