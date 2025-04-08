
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { provinces } from "./provinces";

const getCentralMeridian = (province: string): number => {
  const entry = provinces.find((p) => p.name === province);
  return entry ? entry.centralMeridian : 106.25; // default to HCM
};

function convertVN2000toWGS84(x: number, y: number, centralMeridian: number) {
  const long = centralMeridian + (x - 500000) / 100000;
  const lat = (y - 1000000) / 100000 + 10;
  return {
    lat: parseFloat(lat.toFixed(6)),
    lng: parseFloat(long.toFixed(6)),
  };
}

export default function Converter() {
  const [province, setProvince] = useState("TP. HCM");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [result, setResult] = useState<{ lat: number; lng: number } | null>(null);

  const handleConvert = () => {
    const centralMeridian = getCentralMeridian(province);
    const coords = convertVN2000toWGS84(x, y, centralMeridian);
    setResult(coords);
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chuyển đổi tọa độ VN2000 ➝ WGS84</h1>
      <Card>
        <CardContent className="space-y-4">
          <div>
            <Label>Tỉnh / Thành phố</Label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {provinces.map((p) => (
                <option key={p.name} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Tọa độ X (Easting)</Label>
            <Input type="number" value={x} onChange={(e) => setX(Number(e.target.value))} />
          </div>
          <div>
            <Label>Tọa độ Y (Northing)</Label>
            <Input type="number" value={y} onChange={(e) => setY(Number(e.target.value))} />
          </div>
          <Button onClick={handleConvert}>Chuyển đổi</Button>

          {result && (
            <div className="mt-4">
              <p>
                <strong>Lat:</strong> {result.lat}°, <strong>Lng:</strong> {result.lng}°
              </p>
              <a
                href={`https://www.google.com/maps?q=${result.lat},${result.lng}`}
                target="_blank"
                className="text-blue-600 underline"
              >
                Mở trên Google Maps
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
