export interface Post {
  _id?: string;
  slug?: string;
  title: string;
  content: string;
  author?: { _id: string; userName: string } | string;
  publishedAt?: string;
  createdAt?: string;
  readingTime?: number;
  views?: number;
  tags?: string[];
}
