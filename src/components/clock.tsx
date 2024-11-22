"use client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect, useState } from "react";

export default function Clock() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const date = time
    ? format(time, "PPPP", { locale: es })
        .split(" ")
        .map((word, i) => {
          if (i === 0 || i === 3) {
            // First word (day) and fourth word (month)
            return word.charAt(0).toUpperCase() + word.slice(1);
          }
          return word;
        })
        .join(" ")
    : "";
  return (
    <div className="text-center">
      <div className="text-lg">{date}</div>
      <div className="text-2xl">
        {time && format(time, "HH:mm:ss", { locale: es })}
      </div>
    </div>
  );
}
