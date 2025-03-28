import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  value: string;
  label: string;
}

export default function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
          <p className="text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
