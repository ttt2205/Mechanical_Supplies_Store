export interface IntroduceReason {
  title: string;
  body: string;
}

export interface IntroduceHeroContent {
  eyebrow: string;
  title: string;
  highlight: string;
  excerpt: string;
  thumbnail: string;
  stats?: { number: string; label: string }[];
}

export interface IntroduceTextBlock {
  heading: string;
  body: string;
}

export interface IntroduceShowcaseContent {
  image: string;
  alt: string;
  caption: string;
}

export interface IntroduceContactContent {
  heading: string;
  addressLabel: string;
  address: string;
  hotlineLabel: string;
  hotline: string;
  emailLabel: string;
  email: string;
  hoursLabel: string;
  hours: string;
  cta: string;
}

export interface IntroducePageContent {
  hero: IntroduceHeroContent;
  story: IntroduceTextBlock;
  quote?: string;
  vision: IntroduceTextBlock;
  mission: IntroduceTextBlock;
  reasonsHeading: string;
  reasons: IntroduceReason[];
  showcase: IntroduceShowcaseContent;
  contact: IntroduceContactContent;
}
