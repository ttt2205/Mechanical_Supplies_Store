import React from "react";
import { readIntroduceContent } from "@/lib/introduce-content";
import ArticleLayout from "@/components/ui/ArticleLayout";
import { ArticleDisplayContent, ArticleSection } from "@/types/article";

export const dynamic = "force-dynamic";

const renderParagraphs = (text: string) =>
  text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p key={`${paragraph}-${index}`}>
        {paragraph}
      </p>
    ));

export default async function AboutUsPage() {
  const data = await readIntroduceContent();

  const sections: ArticleSection[] = [
    {
      id: "story",
      title: data.story.heading,
      content: (
        <>
          {renderParagraphs(data.story.body)}
          {data.showcase.image && (
            <figure>
              <img src={data.showcase.image} alt={data.showcase.alt} />
              {data.showcase.caption && <figcaption>{data.showcase.caption}</figcaption>}
            </figure>
          )}
        </>
      )
    },
    {
      id: "vision",
      title: data.vision.heading,
      content: (
        <>
          {renderParagraphs(data.vision.body)}
        </>
      )
    },
    {
      id: "mission",
      title: data.mission.heading,
      content: (
        <>
          {renderParagraphs(data.mission.body)}
        </>
      )
    },
    {
      id: "reasons",
      title: data.reasonsHeading,
      content: (
        <ul>
          {data.reasons.map((reason, idx) => (
            <li key={idx}>
              <strong>{reason.title}:</strong> {reason.body}
            </li>
          ))}
        </ul>
      )
    },
    {
      id: "contact",
      title: data.contact.heading,
      content: (
        <ul>
          <li><strong>{data.contact.addressLabel}:</strong> {data.contact.address}</li>
          <li><strong>{data.contact.hotlineLabel}:</strong> {data.contact.hotline}</li>
          <li><strong>{data.contact.emailLabel}:</strong> {data.contact.email}</li>
          <li><strong>{data.contact.hoursLabel}:</strong> {data.contact.hours}</li>
        </ul>
      )
    }
  ];

  const articleData: ArticleDisplayContent = {
    title: data.hero.title,
    excerpt: data.hero.excerpt,
    sections: sections,
  };

  return <ArticleLayout data={articleData} />;
}
