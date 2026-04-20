import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>
      <span className='from-foreground bg-linear-to-b to-transparent bg-clip-text text-[10rem] leading-none font-extrabold text-transparent'>
        404
      </span>
      <h2 className='my-2 text-2xl font-bold'>Page not found</h2>
      <p className='text-muted-foreground'>The page you are looking for doesn&apos;t exist.</p>
      <Link href='/' className='mt-8 inline-block underline underline-offset-4'>
        Go home
      </Link>
    </div>
  );
}
