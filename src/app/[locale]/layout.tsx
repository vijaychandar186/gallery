import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import { ActiveSchemeProvider } from '@/components/appearance/active-scheme';
import { LocaleHtml } from '@/components/layout/locale-html';
import { Providers } from '@/components/layout/providers';
import { DEFAULT_SCHEME } from '@/components/appearance/scheme.config';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const cookieStore = await cookies();
  const activeScheme = cookieStore.get('active_scheme')?.value;
  const initialTheme = cookieStore.get('theme')?.value === 'dark' ? 'dark' : 'light';

  return (
    <LocaleHtml locale={locale} activeScheme={activeScheme ?? DEFAULT_SCHEME}>
      <Providers initialTheme={initialTheme}>
        <ActiveSchemeProvider initialScheme={activeScheme}>
          <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>
        </ActiveSchemeProvider>
      </Providers>
    </LocaleHtml>
  );
}
