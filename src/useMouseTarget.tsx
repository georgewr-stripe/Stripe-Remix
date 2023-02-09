import { useEffect, useState } from "react";

interface Target {
  element: HTMLElement;
  position: DOMRect;
}

const useMouseTarget = () => {
  const [target, setTarget] = useState<Target>();

  useEffect(() => {
    const setFromEvent = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el) {
        const pos = el.getBoundingClientRect();
        setTarget({ element: el, position: pos });
      }
    };

    window.addEventListener("mousemove", setFromEvent);

    return () => {
      window.removeEventListener("mousemove", setFromEvent);
    };
  }, []);

  return target;
};

export default useMouseTarget;
