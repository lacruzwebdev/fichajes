"use client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useConfetti from "@/hooks/use-confetti";
import { cn } from "@/lib/utils";
import { clockUser } from "@/server/actions/clockings";
import { Clock } from "lucide-react";
import { useAction } from "next-safe-action/hooks";
import { useState } from "react";
import Confetti from "react-confetti-boom";

export default function AddClockingForm({
  openedClocking,
}: {
  openedClocking: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { executeAsync } = useAction(clockUser);
  const { dimensions, isClient } = useConfetti();

  async function handleClick() {
    setIsLoading(true);
    setShowConfetti(false);
    await executeAsync();
    if (openedClocking) {
      setShowConfetti(true);
    }
    setIsLoading(false);
  }

  return (
    <>
      <Button
        size="lg"
        className={cn(
          "my-4 transition-transform hover:scale-105",
          openedClocking
            ? "bg-destructive hover:bg-destructive/90"
            : "bg-primary hover:bg-primary/90",
        )}
        type="submit"
        onClick={handleClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner className="text-white" />
            Cargando...
          </>
        ) : (
          <>
            <Clock />
            {openedClocking ? "Desfichar" : "Fichar"}
          </>
        )}
      </Button>
      {isClient && showConfetti && (
        <Confetti
          mode="boom"
          particleCount={100}
          shapeSize={22}
          colors={[
            "#f44336",
            "#e91e63",
            "#9c27b0",
            "#673ab7",
            "#3f51b5",
            "#2196f3",
            "#03a9f4",
            "#00bcd4",
            "#009688",
            "#4CAF50",
            "#8BC34A",
            "#CDDC39",
            "#FFEB3B",
            "#FFC107",
            "#FF9800",
            "#FF5722",
          ]}
        />
      )}
    </>
  );
}
