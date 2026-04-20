import {
  Architects_Daughter,
  Baloo_Thambi_2,
  DM_Sans,
  Fira_Code,
  Geist,
  Geist_Mono,
  Inter,
  JetBrains_Mono,
  Kalam,
  Outfit,
  Space_Mono
} from 'next/font/google';
import { cn } from '@/lib/utils';

const fontSans = Geist({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' });
const fontInter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const fontOutfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const fontDMSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });
const fontSpaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono'
});
const fontFiraCode = Fira_Code({ subsets: ['latin'], variable: '--font-fira-code' });
const fontJetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono'
});
const fontArchitectsDaughter = Architects_Daughter({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-architects-daughter'
});

// Notebook theme fallbacks for non-Latin scripts
const fontKalam = Kalam({
  subsets: ['devanagari', 'latin'],
  weight: ['400', '700'],
  variable: '--font-kalam'
});

const fontBalooThambi2 = Baloo_Thambi_2({
  subsets: ['latin', 'tamil'],
  weight: ['400', '700'],
  variable: '--font-baloo-thambi-2'
});

export const fontVariables = cn(
  fontSans.variable,
  fontMono.variable,
  fontInter.variable,
  fontOutfit.variable,
  fontDMSans.variable,
  fontSpaceMono.variable,
  fontFiraCode.variable,
  fontJetBrainsMono.variable,
  fontArchitectsDaughter.variable,
  fontKalam.variable,
  fontBalooThambi2.variable
);
