import { isRedFamily, transformFamily, transformValue } from "@/utils/cards";
import type { CardFamily } from "@/utils/connection/protocol";

interface CardProps {
  value: number;
  family: CardFamily;
  disabled?: boolean;
}

export default function Card({ value, family, disabled }: CardProps) {
  return (
    <div
      className={`flex h-40 w-24 bg-white border-2 border-black rounded-lg shadow ${isRedFamily(family) ? "text-skin-red" : "text-black"} ${disabled ? "text-gray-400" : ""}`}
    >
      <span className="text-4xl ml-3">{transformValue(value)}</span>
      <span className="text-4xl">{transformFamily(family)}</span>
    </div>
  );
}
