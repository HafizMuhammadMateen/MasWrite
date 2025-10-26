export interface Blog {
  _id: string;
  slug: string;
  title: string;
  content?: string;
  author: { _id: string; userName: string } | string;
  publishedAt?: string;
  updatedAt?: string;
  createdAt?: string;
  readingTime?: number;
  views?: number;
  tags: string[];
  status: string;
  category: string;
}


export interface BlogCardProps {
  title: string;
  slug: string;
  authorName: string;
  excerpt?: string;
  publishedAt?: string; // ISO string
  readingTime?: number;
  views?: number;
  tags?: string[];
}

