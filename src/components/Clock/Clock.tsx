import { useEffect, useState } from 'react';

type Props = { lastOnline: number };

export default function Clock({ lastOnline }: Props) {
  const [diff, setDiff] = useState(
    () => Math.floor(Date.now() / 1000) - lastOnline
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setDiff(Math.floor(Date.now() / 1000) - lastOnline);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastOnline]);

  const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const seconds = String(diff % 60).padStart(2, '0');

  return (
    <p>
      Last Online: {hours}:{minutes}:{seconds} ago
    </p>
  );
}
