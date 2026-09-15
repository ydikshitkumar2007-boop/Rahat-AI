import { IEnvironmentProvider, TerrainSusceptibilityMetadata } from './types';

export class StaticSusceptibilityAdapter implements IEnvironmentProvider {
  private staticTerrainDatabase: Record<string, Partial<TerrainSusceptibilityMetadata>> = {
    st_01: {
      slopeDeg: 34.5,
      elevationM: 1420,
      aspectDeg: 180,
      geologyClass: 'Schist & Gneiss (Highly Fractured)',
      landcoverClass: 'Steep Forest / Sparse Vegetation',
      distanceToRoadM: 120,
      distanceToFaultM: 350,
      historicalSusceptibilityScore: 78,
      dataQualityScore: 92,
      provenance: 'GSI Geological Vulnerability Survey 2023',
    },
    st_02: {
      slopeDeg: 28.0,
      elevationM: 1150,
      aspectDeg: 135,
      geologyClass: 'Sedimentary Sandstone',
      landcoverClass: 'Dense Subtropical Forest',
      distanceToRoadM: 450,
      distanceToFaultM: 800,
      historicalSusceptibilityScore: 62,
      dataQualityScore: 88,
      provenance: 'State Disaster Management Authority Metadata',
    },
    st_03: {
      slopeDeg: 41.2,
      elevationM: 1680,
      aspectDeg: 225,
      geologyClass: 'Weathered Shale & Unconsolidated Soil',
      landcoverClass: 'Cut Slope / Highway Corridor',
      distanceToRoadM: 25,
      distanceToFaultM: 150,
      historicalSusceptibilityScore: 89,
      dataQualityScore: 95,
      provenance: 'High-Resolution LiDAR Terrain Model 2024',
    },
    st_04: {
      slopeDeg: 22.4,
      elevationM: 980,
      aspectDeg: 90,
      geologyClass: 'Alluvial Deposit / Stable Bedrock',
      landcoverClass: 'Agricultural Terraces',
      distanceToRoadM: 600,
      distanceToFaultM: 1200,
      historicalSusceptibilityScore: 40,
      dataQualityScore: 85,
      provenance: 'Regional Topographic Assessment',
    },
  };

  async getTerrainMetadata(
    stationId: string,
    lat: number,
    lon: number
  ): Promise<TerrainSusceptibilityMetadata> {
    const known = this.staticTerrainDatabase[stationId] || {};

    return {
      stationId,
      slopeDeg: known.slopeDeg ?? Math.round((Math.abs(lat * 10) % 25) + 15),
      elevationM: known.elevationM ?? Math.round((Math.abs(lon * 50) % 1200) + 500),
      aspectDeg: known.aspectDeg ?? 180,
      geologyClass: known.geologyClass || 'Weathered Metamorphic Rock',
      landcoverClass: known.landcoverClass || 'Mixed Slope Vegetation',
      distanceToRoadM: known.distanceToRoadM ?? 200,
      distanceToFaultM: known.distanceToFaultM ?? 500,
      historicalSusceptibilityScore: known.historicalSusceptibilityScore ?? 65,
      dataQualityScore: known.dataQualityScore ?? 90,
      provenance: known.provenance || 'Default Regional Vulnerability Baseline',
    };
  }
}
