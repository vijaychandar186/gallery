import Image from 'next/image';

interface AppPreviewProps {
  imagePath: string;
  appName: string;
}

export function AppPreview({ imagePath, appName }: AppPreviewProps) {
  return (
    <div className='relative h-full w-full overflow-hidden'>
      <Image src={imagePath} alt={`${appName} preview`} fill className='object-cover' priority />
    </div>
  );
}
