import React from "react";
import useMouseTarget from "./useMouseTarget";

interface Props {
  visible: boolean;
  toolbarRef: React.RefObject<HTMLDivElement>;
  paymentRef: React.RefObject<HTMLDivElement>;
  selected: HTMLElement | null;
  setSelected: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
}

const DOMEditor = (props: Props) => {
  const { visible, toolbarRef, selected, setSelected, paymentRef } = props;
  const [onScreen, setOnScreen] = React.useState(true);
  const target = useMouseTarget();

  const inspectorStyles: React.CSSProperties =
    React.useMemo<React.CSSProperties>(() => {
      const baseStyles: React.CSSProperties = {
        backgroundColor: "rgba(99, 91, 255, 0.5)",
        position: "absolute",
        pointerEvents: "none",
        border: selected ? "3px solid rgba(99, 91, 255, 1)" : "",
      };

      // If we have a selected element, then don't move the inspector
      if (selected) {
        console.log("element selected, returning existing position");
        const rect = selected.getBoundingClientRect();
        return {
          top: rect.top + "px",
          left: rect.left + "px",
          width: rect.width + "px",
          height: rect.height + "px",
          ...baseStyles,
        };
      }

      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var scrollLeft = window.scrollX || document.documentElement.scrollLeft;
      var width = target?.position.width;
      var height = target?.position.height;
      var top = Math.max(0, target?.position.top || 0 + scrollTop);
      var left = Math.max(0, target?.position.left || 0 + scrollLeft);
      return {
        top: top + "px",
        left: left + "px",
        width: width + "px",
        height: height + "px",
        ...baseStyles,
      };
    }, [target, selected]);

  const handleLeaveScreen = React.useCallback(() => {
    setOnScreen(false);
  }, []);

  const handleScreenEnter = React.useCallback(() => {
    setOnScreen(true);
  }, []);

  const handleDOMClick = React.useCallback(
    (e: MouseEvent) => {
      if (visible && !selected) {
        const clicked = e.target as HTMLElement;
        console.log("clicked", clicked);
        if (
          clicked !== toolbarRef.current &&
          !toolbarRef.current?.contains(clicked) &&
          !paymentRef.current?.contains(clicked)
        ) {
          console.log("setting selected");
          setSelected(clicked);
          return;
        }
      }
      console.log("unsetting selected", visible, selected);
      setSelected(null);
    },
    [visible, selected, setSelected, toolbarRef, paymentRef]
  );

  React.useEffect(() => {
    document.documentElement.addEventListener(
      "mouseleave",
      handleLeaveScreen,
      false
    );
    document.documentElement.addEventListener(
      "mouseenter",
      handleScreenEnter,
      false
    );
    document.addEventListener("click", handleDOMClick, false);
    return () => {
      document.documentElement.removeEventListener(
        "mouseleave",
        handleLeaveScreen,
        false
      );
      document.documentElement.removeEventListener(
        "mouseenter",
        handleScreenEnter,
        false
      );
      document.removeEventListener("click", handleDOMClick, false);
    };
  }, [handleLeaveScreen, handleScreenEnter, handleDOMClick]);

  const isOnToolbar = React.useMemo<boolean>(() => {
    if (target?.element === toolbarRef.current) return true;
    if (
      target?.element
        ? toolbarRef.current?.contains(target?.element) &&
          paymentRef.current?.contains(target?.element)
        : false
    )
      return true;
    return false;
  }, [target, toolbarRef, paymentRef]);

  const inspector = React.useCallback(() => {
    if (
      (!visible ||
        target?.element === toolbarRef.current ||
        isOnToolbar ||
        !onScreen) &&
      !selected
    ) {
      return <></>;
    }
    return <div style={inspectorStyles}></div>;
  }, [
    visible,
    toolbarRef,
    target?.element,
    isOnToolbar,
    onScreen,
    inspectorStyles,
    selected,
  ]);

  return inspector();
};

export default DOMEditor;
