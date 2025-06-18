// /services/chessService.ts
import axios from 'axios';
import type { GMListResponse } from '../types/gm-list';
import type { PlayerProfile } from '../types/player';

let cachedGM: GMListResponse | null = null;
const BASE_URL = 'https://api.chess.com/pub';
export async function fetchGrandmasters(): Promise<GMListResponse> {
  if (cachedGM) return cachedGM;
  //didn't use the signal since on loading the Empty message is showing
  const { data } = await axios.get<GMListResponse>(`${BASE_URL}/titled/GM`);
  cachedGM = data;
  return data;
}

export async function fetchPlayerProfile(
  username: string,
  signal?: AbortSignal
): Promise<PlayerProfile> {
  const { data } = await axios.get<PlayerProfile>(
    `${BASE_URL}/player/${username}`,
    { signal }
  );
  return data;
}

export async function fetchCountryName(
  countryUrl: string,
  signal?: AbortSignal
): Promise<string | null> {
  try {
    const response = await fetch(countryUrl, { signal });
    const data = await response.json();
    return data.name || null;
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      console.error('Error fetching country name', error);
    }
    return null;
  }
}
