import type { BoardTileType, LandmarkId } from "../types";

export const STARTING_COINS = 650;
export const STARTING_SPINS = 12;
export const STARTING_SHIELDS = 1;
export const MAX_SHIELDS = 3;
export const LANDMARK_MAX_LEVEL = 5;

export type BoardTile = {
  type: BoardTileType;
  label: string;
  shortLabel: string;
};

export type LandmarkConfig = {
  id: LandmarkId;
  title: string;
  baseCost: number;
  color: string;
};

export const BOARD_TILES: BoardTile[] = [
  { type: "bonus", label: "Depart bonus", shortLabel: "GO" },
  { type: "coins", label: "Pieces", shortLabel: "C" },
  { type: "shield", label: "Bouclier", shortLabel: "S" },
  { type: "raid", label: "Raid coffre", shortLabel: "R" },
  { type: "coins", label: "Pieces", shortLabel: "C" },
  { type: "attack", label: "Attaque", shortLabel: "A" },
  { type: "bonus", label: "Bonus lancer", shortLabel: "B" },
  { type: "coins", label: "Pieces", shortLabel: "C" },
  { type: "jackpot", label: "Jackpot", shortLabel: "J" },
  { type: "shield", label: "Bouclier", shortLabel: "S" },
  { type: "coins", label: "Pieces", shortLabel: "C" },
  { type: "raid", label: "Raid coffre", shortLabel: "R" },
  { type: "bonus", label: "Bonus lancer", shortLabel: "B" },
  { type: "attack", label: "Attaque", shortLabel: "A" },
  { type: "coins", label: "Pieces", shortLabel: "C" },
  { type: "shield", label: "Bouclier", shortLabel: "S" }
];

export const LANDMARKS: LandmarkConfig[] = [
  { id: "vault", title: "Coffre", baseCost: 120, color: "#f6c343" },
  { id: "station", title: "Gare", baseCost: 160, color: "#14b8a6" },
  { id: "tower", title: "Tour", baseCost: 210, color: "#2563eb" },
  { id: "harbor", title: "Port", baseCost: 260, color: "#f97366" }
];

export const DISTRICTS = [
  "Baie Neon",
  "Quartier Casino",
  "Port Fortune",
  "Avenue Royale",
  "Ile Prestige"
];

export function createEmptyLandmarks() {
  return LANDMARKS.reduce(
    (levels, landmark) => ({
      ...levels,
      [landmark.id]: 0
    }),
    {} as Record<LandmarkId, number>
  );
}

export function getDistrictName(index: number) {
  const normalizedIndex = Math.max(0, Math.floor(index)) % DISTRICTS.length;

  return DISTRICTS[normalizedIndex] ?? DISTRICTS[0]!;
}

export function getLandmarkCost(landmarkId: LandmarkId, level: number, districtIndex: number) {
  const landmark = LANDMARKS.find((item) => item.id === landmarkId);
  const baseCost = landmark?.baseCost ?? 120;
  const districtMultiplier = 1 + districtIndex * 0.34;
  const levelMultiplier = level + 1;

  return Math.round((baseCost * districtMultiplier * levelMultiplier) / 10) * 10;
}

export function getDistrictCompletion(levels: Record<LandmarkId, number>) {
  const totalLevels = LANDMARKS.length * LANDMARK_MAX_LEVEL;
  const currentLevels = LANDMARKS.reduce((total, landmark) => total + levels[landmark.id], 0);

  return Math.round((currentLevels / totalLevels) * 100);
}
