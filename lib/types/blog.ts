export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: { _id: string; userName: string } | string;
  readingTime: number;
  views: number;
  tags: string[];
  status: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}
