import { AlertTriangle, CheckCircle } from "lucide-react";
export default function StatusMessage({ type, message }) {
  if (!message) return null;

  const isError = type === "error";
  const bgColor = isError ? "bg-red-100" : "bg-green-100";
  const borderColor = isError ? "border-red-300" : "border-green-300";
  const textColor = isError ? "text-red-700" : "text-green-700";
  const Icon = isError ? AlertTriangle : CheckCircle;

  return (
    <div
      className={`flex items-center ${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-xl gsap-item`}
    >
      <Icon className="w-5 h-5 mr-2" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
