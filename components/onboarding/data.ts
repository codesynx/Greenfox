import { OnboardingSlide, Language } from './types';

export const slides: OnboardingSlide[] = [
  {
    id: '1',
    titleKey: 'onboarding.slide1.title',
    subtitleKey: 'onboarding.slide1.subtitle',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=2000&fit=crop',
  },
  {
    id: '2',
    titleKey: 'onboarding.slide2.title',
    subtitleKey: 'onboarding.slide2.subtitle',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=2000&fit=crop',
  },
  {
    id: '3',
    titleKey: 'onboarding.slide3.title',
    subtitleKey: 'onboarding.slide3.subtitle',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1200&h=2000&fit=crop',
  },
];

export const LANGUAGES: Language[] = [
  { code: 'ru', label: 'Русский' },
  { code: 'en', label: 'English' },
  { code: 'kk', label: 'Қазақша' },
];
