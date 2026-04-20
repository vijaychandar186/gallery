import { BirdIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

interface OsLogoIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function OsLogoIcon({ size = 24, className, strokeWidth = 1.5 }: OsLogoIconProps) {
  return (
    <HugeiconsIcon icon={BirdIcon} size={size} strokeWidth={strokeWidth} className={className} />
  );
}
