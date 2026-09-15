'use client';

import React, { useEffect, useRef } from 'react';
import { StationWithMetrics } from '@/types';

interface RiskMapContentProps {
  stations: StationWithMetrics[];
  selectedStationId?: string;
  onSelectStation?: (station: StationWithMetrics) => void;
}

export default function RiskMapContent({
  stations,
  selectedStationId,
  onSelectStation,
}: RiskMapContentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container) return;

    // Dynamically import leaflet on client
    import('leaflet').then((L) => {
      // Fix leaflet marker icon URLs in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      if (!leafletMapRef.current && container) {
        // Center on Northeast India (Meghalaya/Assam region approx 25.8° N, 91.8° E)
        const map = L.map(container, {
          center: [25.8, 91.8],
          zoom: 7,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors | RAHAT Risk Intelligence',
          maxZoom: 18,
        }).addTo(map);

        leafletMapRef.current = map;
      }

      const map = leafletMapRef.current;

      if (!map) return;

      // Clear existing markers if any
      map.eachLayer((layer: any) => {
        if (layer instanceof L.CircleMarker || layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add Station Pins with mature risk colors
      stations.forEach((st) => {
        let circleColor = '#4F7A58'; // low (forest green)
        if (st.risk_level === 'severe') circleColor = '#A33D32';
        else if (st.risk_level === 'high') circleColor = '#B7602B';
        else if (st.risk_level === 'moderate') circleColor = '#B88422';

        const circle = L.circleMarker([st.latitude, st.longitude], {
          radius: st.risk_level === 'severe' ? 12 : 9,
          fillColor: circleColor,
          color: '#ffffff',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.9,
        }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; font-size: 12px; color: #1F2933; padding: 4px;">
            <div style="font-weight: bold; border-bottom: 1px solid #E6E1D8; padding-bottom: 4px; margin-bottom: 4px; font-size: 13px;">
              ${st.code} - ${st.name}
            </div>
            <div>State: <b>${st.state}</b> (${st.district})</div>
            <div>Risk Level: <b style="color: ${circleColor}; text-transform: uppercase;">${st.risk_level}</b></div>
            <div>24h Rainfall: <b>${st.latest_reading?.rainfall_24h_mm ?? 0} mm</b></div>
            <div>Soil Moisture: <b>${st.latest_reading?.soil_moisture_pct ?? 0}%</b></div>
            <div>Slope Angle: <b>${st.latest_reading?.slope_tilt_deg ?? 0}°</b></div>
          </div>
        `;

        circle.bindPopup(popupContent);

        circle.on('click', () => {
          if (onSelectStation) onSelectStation(st);
        });
      });
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [stations, onSelectStation]);

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-xl overflow-hidden border border-earth-300 dark:border-gray-700 shadow-xs">
      <div ref={mapContainerRef} className="w-full h-full min-h-[450px] z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 dark:bg-gray-800/95 border border-earth-300 dark:border-gray-700 p-3 rounded-xl text-xs text-earth-900 dark:text-white backdrop-blur-md space-y-1.5 shadow-md">
        <div className="font-bold text-earth-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
          Hazard Level Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#A33D32] inline-block animate-pulse" />
          <span>Severe (Critical Advisory)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#B7602B] inline-block" />
          <span>High Risk Corridor</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#B88422] inline-block" />
          <span>Moderate Advisory</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-[#4F7A58] inline-block" />
          <span>Low / Stable Baseline</span>
        </div>
      </div>
    </div>
  );
}
