// src/components/PlayerDetails/PlayerDetails.tsx
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import Clock from '../Clock/Clock';
import type { PlayerProfile } from '../../types/player';

interface PlayerDetailsProps {
  profile: PlayerProfile;
  countryName: string | null;
}

export default function PlayerDetails({
  profile,
  countryName,
}: PlayerDetailsProps) {
  return (
    <div>
      <Card title={profile.username}>
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            image={profile.avatar}
            shape="circle"
            size="xlarge"
            icon={!profile.avatar ? 'pi pi-user' : undefined}
            style={{
              backgroundColor: '#ccc',
            }}
          />
          <div className="ml-1">
            <p className="text-lg font-semibold flex items-center gap-2">
              {profile.name || profile.username}
              {profile.title && <Tag value={profile.title} severity="info" />}
              {profile.verified && (
                <Tag value="Verified" severity="success" icon="pi pi-check" />
              )}
            </p>
            <Tag
              value={profile.status}
              severity={profile.status === 'online' ? 'success' : 'warning'}
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <p>
            <strong>Country:</strong> {countryName ?? 'Unknown'}
          </p>
          <p>
            <strong>League:</strong> {profile.league || 'N/A'}
          </p>
          <p>
            <strong>Followers:</strong> {profile.followers}
          </p>
          <p>
            <strong>Joined:</strong>{' '}
            {new Date(profile.joined * 1000).toLocaleDateString()}
          </p>
          <Clock lastOnline={profile.last_online} />
        </div>

        <div className="mt-4">
          <Button
            label="View on Chess.com"
            icon="pi pi-external-link"
            className="p-button-sm"
            onClick={() => window.open(profile.url, '_blank')}
          />
        </div>
      </Card>
    </div>
  );
}
