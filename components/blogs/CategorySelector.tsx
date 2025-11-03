import { BLOG_CATEGORIES } from "@/constants/blogCategories";

export default function CategorySelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const categories = BLOG_CATEGORIES;
  
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
    </div>
  );
}