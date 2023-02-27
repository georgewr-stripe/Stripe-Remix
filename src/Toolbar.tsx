import { Stripe } from "@stripe/stripe-js/types/stripe-js";
import React from "react";
import ReactDOM from "react-dom";
import Toggle from "./components/Toggle";
import Button from "./components/Button";
import PaymentInjector from "./PaymentInjector";

interface Props {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selected: HTMLElement | null;
  paymentRef: React.RefObject<HTMLDivElement>;
  setSelected: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  stripePromise: Promise<Stripe | null>;
}

const buttonStyles: React.CSSProperties = {
  borderRadius: "7%",
  padding: "1rem",
  textAlign: "center",
  display: "inline-flex",
  alignItems: "center",
};

const toggleTransitionStyles: React.CSSProperties = {
  transitionProperty: "background-color, transform, visibility",
  transitionDuration: "0.25s",
  transitionTimingFunction: "ease-in, cubic-bezier(0.6,0.2,0.4,1.5), linear",
};

const Toolbar = React.forwardRef(
  (props: Props, ref: React.ForwardedRef<HTMLDivElement>) => {
    const {
      editMode,
      setEditMode,
      selected,
      setSelected,
      stripePromise,
      paymentRef,
    } = props;
    const [deletedElements, setDeletedElements] = React.useState<HTMLElement[]>(
      []
    );
    const [hide, setHide] = React.useState(false);
    const [paymentEl, setPaymentEl] = React.useState<React.ReactPortal | null>(
      null
    );

    const handleKeyboardShortcut = React.useCallback(
      (event: KeyboardEvent) => {
        if (editMode) {
          if (event.key === "Escape") {
            setEditMode(false);
          }
          if (
            ["Backspace", "Delete"].includes(event.key) &&
            selected &&
            !hide
          ) {
            deleteSelected();
          }
        }
      },
      [setEditMode, selected, editMode, hide]
    );

    const deleteSelected = React.useCallback(() => {
      if (selected) {
        setDeletedElements((prev) => [...prev, selected]);
        selected.style.display = "none";
        setSelected(null);
      }
    }, [selected, setSelected]);

    const restoreDeleted = React.useCallback(() => {
      if (deletedElements) {
        deletedElements.map((el) => (el.style.display = "block"));
        setDeletedElements([]);
      }
    }, [deletedElements]);

    const hideToolbar = React.useCallback(() => {
      document.body.style.top = "";
      setHide(true);
    }, []);

    const insertStripePaymentElement = React.useCallback(() => {
      if (selected) {
        const children = Array.from(
          selected.children as HTMLCollectionOf<HTMLElement>
        );
        children.map((e) => {
          e.style.display = "none";
        });
        setDeletedElements((prev) => [...prev, ...children]);
        setEditMode(false);
        setPaymentEl(
          ReactDOM.createPortal(
            <PaymentInjector ref={paymentRef} {...{ stripePromise }} />,
            selected
          )
        );
        setSelected(null);
      }
    }, [stripePromise, selected]);

    React.useEffect(() => {
      document.addEventListener("keydown", handleKeyboardShortcut, false);

      return () => {
        document.removeEventListener("keydown", handleKeyboardShortcut, false);
      };
    }, [handleKeyboardShortcut]);

    return (
      <div
        ref={ref}
        className={
          "fixed w-full items-center z-[10000] bg-blurple space-between " +
          (hide ? "hidden" : "flex")
        }
      >
        <div style={{ width: "30%", height: "100%", display: "flex" }}>
          <img
            src={chrome.runtime.getURL("assets/remix-logo.png")}
            style={{
              marginRight: "1rem",
              height: "4rem",
              display: "flex",
              alignSelf: "center",
            }}
            alt="stripe-logo"
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "1rem 2rem 1rem 0",
            width: "70%",
          }}
        >
          <Button
            style={buttonStyles}
            onClick={deleteSelected}
            disabled={!selected}
          >
            Delete
          </Button>
          <Button
            style={buttonStyles}
            disabled={!selected}
            onClick={insertStripePaymentElement}
          >
            Insert Stripe
          </Button>
          <Button style={buttonStyles} onClick={hideToolbar}>
            Hide Toolbar
          </Button>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <span
              style={{
                color: "transparent",
                fontSize: "1.5em",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                lineHeight: "1",
                overflow: "hidden",
                height: "1em",
                marginRight: "1rem",
                WebkitTextStroke: "0.05em #fff",
                ...toggleTransitionStyles,
              }}
            >
              EDIT MODE
            </span>
            <Toggle on={editMode} setOn={setEditMode} />
            <label
              htmlFor="toggle"
              className="slot"
              style={{
                color: "transparent",
                fontSize: "1.5em",
                fontWeight: "bold",
                letterSpacing: "0.1em",
                lineHeight: "1",
                overflow: "hidden",
                height: "1em",
                //   textIndent: "-0.9em",
                WebkitTextStroke: "0.05em #fff",
                ...toggleTransitionStyles,
              }}
            >
              <span
                className="slot__label"
                style={{
                  display: "block",
                  transformOrigin: " 50% 0",
                  transform: editMode ? "translateY(-100%) scaleY(1)" : "",
                  ...toggleTransitionStyles,
                }}
              >
                OFF
              </span>
              <span
                className="slot__label"
                style={{
                  display: "block",
                  color: "white",
                  transformOrigin: " 50% 100%",
                  transform: editMode ? "translateY(-100%) scaleY(1)" : "",
                  ...toggleTransitionStyles,
                }}
              >
                ON
              </span>
            </label>
          </div>
        </div>
        {paymentEl}
      </div>
    );
  }
);

export default Toolbar;
