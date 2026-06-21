import { promises as fs } from "fs";
import path from "path";
import type {
  IntroduceContactContent,
  IntroduceHeroContent,
  IntroducePageContent,
  IntroduceReason,
  IntroduceShowcaseContent,
  IntroduceTextBlock,
} from "@/types/introduce";

const contentPath = path.join(
  process.cwd(),
  "src",
  "data",
  "introduce-page-content.json",
);

const asText = (value: unknown, fallback: string) =>
  typeof value === "string" ? value : fallback;

const mergeHero = (
  value: Partial<IntroduceHeroContent> | undefined,
  fallback: IntroduceHeroContent,
): IntroduceHeroContent => ({
  eyebrow: asText(value?.eyebrow, fallback.eyebrow),
  title: asText(value?.title, fallback.title),
  highlight: asText(value?.highlight, fallback.highlight),
  excerpt: asText(value?.excerpt, fallback.excerpt),
  thumbnail: asText(value?.thumbnail, fallback.thumbnail),
});

const mergeBlock = (
  value: Partial<IntroduceTextBlock> | undefined,
  fallback: IntroduceTextBlock,
): IntroduceTextBlock => ({
  heading: asText(value?.heading, fallback.heading),
  body: asText(value?.body, fallback.body),
});

const mergeShowcase = (
  value: Partial<IntroduceShowcaseContent> | undefined,
  fallback: IntroduceShowcaseContent,
): IntroduceShowcaseContent => ({
  image: asText(value?.image, fallback.image),
  alt: asText(value?.alt, fallback.alt),
  caption: asText(value?.caption, fallback.caption),
});

const mergeContact = (
  value: Partial<IntroduceContactContent> | undefined,
  fallback: IntroduceContactContent,
): IntroduceContactContent => ({
  heading: asText(value?.heading, fallback.heading),
  addressLabel: asText(value?.addressLabel, fallback.addressLabel),
  address: asText(value?.address, fallback.address),
  hotlineLabel: asText(value?.hotlineLabel, fallback.hotlineLabel),
  hotline: asText(value?.hotline, fallback.hotline),
  emailLabel: asText(value?.emailLabel, fallback.emailLabel),
  email: asText(value?.email, fallback.email),
  hoursLabel: asText(value?.hoursLabel, fallback.hoursLabel),
  hours: asText(value?.hours, fallback.hours),
  cta: asText(value?.cta, fallback.cta),
});

const mergeReasons = (
  value: Partial<IntroduceReason>[] | undefined,
  fallback: IntroduceReason[],
) =>
  fallback.map((reason, index) => ({
    title: asText(value?.[index]?.title, reason.title),
    body: asText(value?.[index]?.body, reason.body),
  }));

export async function readIntroduceContent(): Promise<IntroducePageContent> {
  const file = await fs.readFile(contentPath, "utf8");
  return JSON.parse(file) as IntroducePageContent;
}

export function normalizeIntroduceContent(
  value: Partial<IntroducePageContent>,
  fallback: IntroducePageContent,
): IntroducePageContent {
  return {
    hero: mergeHero(value.hero, fallback.hero),
    story: mergeBlock(value.story, fallback.story),
    vision: mergeBlock(value.vision, fallback.vision),
    mission: mergeBlock(value.mission, fallback.mission),
    reasonsHeading: asText(value.reasonsHeading, fallback.reasonsHeading),
    reasons: mergeReasons(value.reasons, fallback.reasons),
    showcase: mergeShowcase(value.showcase, fallback.showcase),
    contact: mergeContact(value.contact, fallback.contact),
  };
}

export async function writeIntroduceContent(content: IntroducePageContent) {
  await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
