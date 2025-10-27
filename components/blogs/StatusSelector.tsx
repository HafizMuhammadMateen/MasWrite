export default function StatusSelector({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const statuses = ["draft", "published"];
  
  return (
    <div>
      <label className="block text-sm font-semibold mb-2 text-gray-700">Status</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer capitalize"
      >
        {statuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    </div>
  );
}
