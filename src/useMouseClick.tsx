import { useEffect, useState } from "react";

const useMouseClick = () => {
  const [target, setTarget] = useState<HTMLElement>();

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => setTarget(e.target as HTMLElement);

    document.addEventListener("click", setFromEvent);

    return () => {
      window.removeEventListener("click", setFromEvent);
    };
  }, []);

  return target;
};

export default useMouseClick;
