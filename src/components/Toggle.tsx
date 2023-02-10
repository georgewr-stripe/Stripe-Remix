import React from "react";

interface Props {
  on: boolean;
  setOn: React.Dispatch<React.SetStateAction<boolean>>;
  colour?: string;
}

const Toggle = (props: Props) => {
  const col = props.colour || "white";
  const handleChange = () => {
    props.setOn(!props.on);
  };
  return (
    <>
      <input
        id="toggle"
        className="toggle"
        type="checkbox"
        role="switch"
        name="toggle"
        onChange={handleChange}
        value="on"
        style={{
          borderRadius: "0.75em",
          boxShadow: "0 0 0 0.1em inset",
          cursor: "pointer",
          position: "relative",
          color: col,
          //   marginRight: "0.25em",
          width: "3em",
          height: "1.5em",
          WebkitAppearance: "none",
          MozAppearance: "none",
          WebkitTapHighlightColor: "transparent",
          appearance: "none",
          transitionProperty: "background-color, transform, visibility",
          transitionDuration: "0.25s",
          transitionTimingFunction:
            "ease-in, cubic-bezier(0.6,0.2,0.4,1.5), linear",
        }}
      />
      <div
        onClick={handleChange}
        style={{
          background: col,
          borderRadius: "50%",
          content: "",
          color: col,
          cursor: "pointer",
          alignSelf: "center",
          position: "relative",
          left: "-2.8rem",
          width: "1.1em",
          height: "1.1em",
          transform: props.on ? "translateX(1.5em)" : "",
          transitionProperty: "background-color, transform, visibility",
          transitionDuration: "0.25s",
          transitionTimingFunction:
            "ease-in, cubic-bezier(0.6,0.2,0.4,1.5), linear",
        }}
      />
    </>
  );
};

export default Toggle;
