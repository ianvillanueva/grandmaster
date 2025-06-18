import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  fetchPlayerProfile,
  fetchCountryName,
} from '../../services/chessService';
import type { PlayerProfile } from '../../types/player';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import PlayerDetails from '../../components/PlayerProfile/PlayerProfile';

export default function PlayerPage() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [countryName, setCountryName] = useState<string | null>(null);

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController(); //to cancel or abort asynchronous operations

    loadProfile(
      username,
      controller.signal,
      setProfile,
      setCountryName,
      setLoading
    );

    return () => controller.abort(); // cleanup on unmount or re-run
  }, [username]);

  const loadProfile = async (
    username: string,
    signal: AbortSignal,
    setProfile: (data: PlayerProfile) => void,
    setCountryName: (name: string | null) => void,
    setLoading: (isLoading: boolean) => void
  ) => {
    try {
      setLoading(true);

      const profile = await fetchPlayerProfile(username, signal);
      setProfile(profile);

      if (profile?.country) {
        const country = await fetchCountryName(profile.country, signal);
        setCountryName(country);
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error loading profile or country data', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="max-w-[600px] mx-auto p-4">
        <Skeleton width="100%" height="150px" className="mb-3" />
        <Skeleton width="60%" className="mb-2" />
        <Skeleton width="40%" className="mb-2" />
        <Skeleton width="80%" className="mb-2" />
      </div>
    );
  }

  return (
    <div className="max-w-[600px] mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            icon="pi pi-arrow-left"
            className="p-button-text p-0"
            onClick={() => navigate(-1)}
            tooltip="Back"
          />
          <h2 className="text-xl font-semibold">Grandmaster Profile</h2>
        </div>
      </div>

      <PlayerDetails profile={profile} countryName={countryName} />
    </div>
  );
}
