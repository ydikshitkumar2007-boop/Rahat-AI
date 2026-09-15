'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { StationWithMetrics } from '@/types';
import { LoadingState } from '@/components/ui/LoadingState';

const DynamicRiskMapContent = dynamic(() => import('./RiskMapContent'), {
  ssr: false,
  loading: () => <LoadingState message="Initializing GIS OpenStreetMap Engine..." />,
});

interface RiskMapProps {
  stations: StationWithMetrics[];
  selectedStationId?: string;
  onSelectStation?: (station: StationWithMetrics) => void;
}

export function RiskMap(props: RiskMapProps) {
  return <DynamicRiskMapContent {...props} />;
}
