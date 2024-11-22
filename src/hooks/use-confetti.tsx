import { useEffect, useState } from "react";

export default function useConfetti() {
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [isClient, setClient] = useState(false);
  useEffect(() => {
    const { innerWidth: width, innerHeight: height } = window;
    setDimensions({
      width,
      height,
    });
    if (typeof window !== "undefined") {
      setClient(true);
    }
  }, []);

  return { dimensions, isClient };
}
