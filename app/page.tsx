'use client';

import { useState } from 'react';
import provinces from './provinces';

export default function Home() {
  const [inputX, setInputX] = useState('');
  const [inputY, setInputY] = useState('');
  const [zone, setZone] = useState('3');
  const [province, setProvince] = useState('');
  const [result, setResult] = useState('');

  const toRadians = (degree: number) => degree * (Math.PI / 180);
  const a = 6378137.0;
  const f = 1 / 298.257223563;
  const b = a * (1 - f);
  const e2 = (a ** 2 - b ** 2) / a ** 2;

  const convertVN2000ToLatLng = (X: number, Y: number, zone: number) => {
    const long0 = toRadians(zone * 3);
    const k0 = 0.9996;
    const x = X - 1000000;
    const y = Y;

    const M = y / k0;
    const mu = M / (a * (1 - e2 / 4 - (3 * e2 ** 2) / 64 - (5 * e2 ** 3) / 256));

    const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));

    const J1 = (3 * e1) / 2 - (27 * e1 ** 3) / 32;
    const J2 = (21 * e1 ** 2) / 16 - (55 * e1 ** 4) / 32;
    const J3 = (151 * e1 ** 3) / 96;
    const J4 = (1097 * e1 ** 4) / 512;

    const fp = mu + J1 * Math.sin(2 * mu) + J2 * Math.sin(4 * mu) + J3 * Math.sin(6 * mu) + J4 * Math.sin(8 * mu);

    const e2prime = e2 / (1 - e2);
    const C1 = e2prime * Math.cos(fp) ** 2;
    const T1 = Math.tan(fp) ** 2;
    const R1 = a * (1 - e2) / Math.pow(1 - e2 * Math.sin(fp) ** 2, 1.5);
    const N1 = a / Math.sqrt(1 - e2 * Math.sin(fp) ** 2);
    const D = x / (N1 * k0);

    const Q1 = N1 * Math.tan(fp) / R1;
    const Q2 = (D ** 2) / 2;
    const Q3 = (5 + 3 * T1 + 10 * C1 - 4 * C1 ** 2 - 9 * e2prime) * D ** 4 / 24;
    const Q4 = (61 + 90 * T1 + 298 * C1 + 45 * T1 ** 2 - 252 * e2prime - 3 * C1 ** 2) * D ** 6 / 720;
    const lat = fp - Q1 * (Q2 - Q3 + Q4);

    const Q5 = D;
    const Q6 = (1 + 2 * T1 + C1) * D ** 3 / 6;
    const Q7 = (5 - 2 * C1 + 28 * T1 - 3 * C1 ** 2 + 8 * e2prime + 24 * T1 ** 2) * D ** 5 / 120;
    const lng = long0 + (Q5 - Q6 + Q7) / Math.cos(fp);

    return {
      lat: lat * (180 / Math.PI),
      lng: lng * (180 / Math.PI),
    };
  };

  const handleConvert = () => {
    const X = parseFloat(inputX);
    const Y = parseFloat(inputY);

    const zoneNum = province ? provinces[province] : parseInt(zone);

    const { lat, lng } = convertVN2000ToLatLng(X, Y, zoneNum);
    setResult(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Chuyển đổi tọa độ VN2000 → Google Maps</h1>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Nhập tọa độ X"
          className="border px-2 py-1 rounded"
          value={inputX}
          onChange={(e) => setInputX(e.target.value)}
        />
        <input
          type="number"
          placeholder="Nhập tọa độ Y"
          className="border px-2 py-1 rounded"
          value={inputY}
          onChange={(e) => setInputY(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          className="border px-2 py-1 rounded"
          value={province}
          onChange={(e) => {
            setProvince(e.target.value);
            if (e.target.value) setZone(provinces[e.target.value].toString());
          }}
        >
          <option value="">-- Chọn tỉnh (nếu có) --</option>
          {Object.keys(provinces).map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Kinh tuyến trục (Zone)"
          className="border px-2 py-1 rounded"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleConvert}>
        Chuyển đổi
      </button>
      {result && <div className="text-green-600 font-semibold">Tọa độ WGS84: {result}</div>}
    </div>
  );
}
