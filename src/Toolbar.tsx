import { Stripe } from "@stripe/stripe-js/types/stripe-js";
import React from "react";
import ReactDOM from "react-dom";
import Toggle from "./components/Toggle";
import PaymentForm from "./PaymentForm";
import env from "../env";

interface Props {
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  selected: HTMLElement | null;
  setSelected: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  stripePromise: Stripe | null;
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
    const { editMode, setEditMode, selected, setSelected, stripePromise } =
      props;
    const [deletedElements, setDeletedELements] = React.useState<HTMLElement[]>(
      []
    );
    const [UPE, setUPE] = React.useState<React.ReactPortal | null>(null);

    const escFunction = React.useCallback(
      (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setEditMode(false);
        }
      },
      [setEditMode]
    );

    const deleteSelected = React.useCallback(() => {
      if (selected) {
        setDeletedELements((prev) => [...prev, selected]);
        selected.style.display = "none";
        setSelected(null);
      }
    }, [selected, setSelected]);

    const restoreDeleted = React.useCallback(() => {
      if (deletedElements) {
        deletedElements.map((el) => (el.style.display = "block"));
        setDeletedELements([]);
      }
    }, [deletedElements]);

    const hideToolbar = React.useCallback(() => {}, []);

    const insertStripePaymentElement = React.useCallback(async () => {
      if (selected) {
        const resp = await fetch(
          env.SERVER_URL + "/api/create_payment_intent",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 1099,
              currency: "gbp",
              description: "Test Product",
            }),
          }
        );
        if (resp.ok) {
          const { client_secret } = await resp.json();
          console.log(client_secret);
          const paymentForm = (
            <PaymentForm
              stripePromise={stripePromise}
              clientSecret={client_secret}
            />
          );
          const children = Array.from(
            selected.children as HTMLCollectionOf<HTMLElement>
          );
          children.map((e) => {
            e.style.display = "none";
          });
          setDeletedELements((prev) => [...prev, ...children]);
          setUPE(ReactDOM.createPortal(paymentForm, selected));
        } else {
          console.log("Payment Intent Creation Failed:", await resp.text());
        }
      }
    }, [stripePromise, selected]);

    React.useEffect(() => {
      document.addEventListener("keydown", escFunction, false);

      return () => {
        document.removeEventListener("keydown", escFunction, false);
      };
    }, [escFunction]);

    return (
      <div
        ref={ref}
        style={{
          backgroundColor: "rgba(99, 91, 255, 1)",
          height: "4rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div style={{ width: "30%", height: "100%" }}>
          <img
            src={chrome.runtime.getURL("assets/stripe-logo.png")}
            style={{
              marginRight: "1rem",
              height: "3rem",
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
          <button
            style={buttonStyles}
            onClick={deleteSelected}
            disabled={!selected}
          >
            Delete
          </button>
          <button
            style={buttonStyles}
            onClick={restoreDeleted}
            disabled={!deletedElements.length}
          >
            Restore
          </button>
          <button
            style={buttonStyles}
            disabled={!selected}
            onClick={insertStripePaymentElement}
          >
            Insert Stripe
          </button>
          <button style={buttonStyles} onClick={hideToolbar}>
            Hide
          </button>
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
                //   textIndent: "-0.9em",
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
        {UPE}
      </div>
    );
  }
);

export default Toolbar;