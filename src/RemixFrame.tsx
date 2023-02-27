import React from "react";
import Frame from "react-frame-component";
const cssStyles = require("!!css-loader!postcss-loader!./app.css");

const RemixFrame = ({ children }: { children: React.ReactNode }) => {
  const [count, setCount] = React.useState(0);
  const [intervalId, setIntervalId] = React.useState<NodeJS.Timer>();
  const [height, setHeight] = React.useState("100%");
  const ref = React.useRef<HTMLIFrameElement>(null);

  const handleMount = () => {
    if (ref?.current?.contentDocument?.documentElement?.scrollHeight) {
      setCount((prev) => prev + 1);
      setHeight(
        ref.current.contentDocument.documentElement.scrollHeight + "px"
      );
    }
  };

  React.useEffect(() => {
    if (count > 20) {
      clearTimeout(intervalId);
    }
  }, [count]);

  React.useEffect(() => {
    const id = setInterval(handleMount, 500);
    setIntervalId(id);
  }, []);

  return (
    <div className="stripe-remix-frame">
      <Frame
        ref={ref}
        head={<style>{cssStyles.default.toString()}</style>}
        height={height}
        width="100%"
        style={{ height, width: "100%" }}
      >
        {children}
      </Frame>
    </div>
  );
};

export default RemixFrame;
