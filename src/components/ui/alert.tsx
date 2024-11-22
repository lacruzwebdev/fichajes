import { AlertCircle, Check } from "lucide-react";

type Props = {
  type: "error" | "success";
  message: string;
};

export default function Alert({ type, message }: Props) {
  const styles = {
    error: "bg-destructive/20 text-destructive",
    success: "bg-green-500/20 text-green-600",
  };
  return (
    <div className="w-full pt-5">
      <div
        className={`flex items-center gap-2 rounded px-3 py-2 ${styles[type]}`}
      >
        {type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}
