import { memo, useMemo, useState } from 'react';
import { getParticipantAvatarHue, getParticipantInitials } from '../lib/room-ui';
import { getVoxelAvatarDataUri } from '../lib/voxel-avatar';

interface VoxelAvatarProps {
  displayName: string;
  seed?: string | null;
  className?: string;
  sizeClassName?: string;
  alt?: string;
}

/**
 * Renders a DiceBear Voxel Art avatar when a seed is present,
 * or gracefully falls back to the participant's stable hue & initials as before.
 */
export const VoxelAvatar = memo(function VoxelAvatar({
  displayName,
  seed,
  className = '',
  sizeClassName = 'h-full w-full',
  alt,
}: VoxelAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const initials = getParticipantInitials(displayName);
  const avatarHue = getParticipantAvatarHue(displayName);

  const effectiveSeed = seed?.trim() || null;

  const dataUri = useMemo(() => {
    if (!effectiveSeed || imgError) return null;
    return getVoxelAvatarDataUri(effectiveSeed);
  }, [effectiveSeed, imgError]);

  if (!dataUri || imgError) {
    return (
      <span
        className={`grid place-items-center text-xs font-semibold text-white select-none ${sizeClassName} ${className}`}
        style={{ backgroundColor: `hsl(${avatarHue} 42% 36%)` }}
        role="img"
        aria-label={alt || displayName}
      >
        {initials}
      </span>
    );
  }

  return (
    <img
      src={dataUri}
      alt={alt || displayName}
      onError={() => setImgError(true)}
      className={`h-full w-full object-cover select-none ${className}`}
    />
  );
});

