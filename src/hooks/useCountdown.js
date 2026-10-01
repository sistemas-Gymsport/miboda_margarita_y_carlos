import { useEffect, useState } from 'react';

function diff(target) {
  const total = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

/** Cuenta regresiva hacia una fecha ISO (proveniente de PostgreSQL). Reacciona a cambios de fecha. */
export function useCountdown(targetIso) {
  const [time, setTime] = useState(() => diff(targetIso));

  useEffect(() => {
    setTime(diff(targetIso));
    if (!targetIso) return undefined;
    const id = setInterval(() => {
      const next = diff(targetIso);
      setTime(next);
      if (next.total === 0) clearInterval(id);
    }, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  return time;
}
