import React from 'react';

export interface ArticleSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface ArticleDisplayContent {
  title: string;
  excerpt?: React.ReactNode;
  sections: ArticleSection[];
}
