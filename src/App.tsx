import React from "react";
import DOMEditor from "./DOMEditor";
import Toolbar from "./Toolbar";
import env from "../env";
import "./dom.css"

import { loadStripe, Stripe } from "@stripe/stripe-js";
import RemixFrame from "./RemixFrame";

if (!env.STRIPE_PK) {
  throw "Stripe Public Key NOT FOUND, check env file";
}

const stripePromise = loadStripe(env.STRIPE_PK);

function App() {
  const [editMode, setEditMode] = React.useState(false);
  const [selected, setSelected] = React.useState<HTMLElement | null>(null);
  const toolbarRef = React.createRef<HTMLDivElement>();
  const paymentRef = React.createRef<HTMLDivElement>();

  // const [stripePromise, setStripePromise] =
  //   React.useState<Promise<Stripe | null>>();
  // React.useEffect(() => {
  //   if (!stripePromise && window.Stripe) {
  //     setStripePromise(window.Stripe(env.STRIPE_PK));
  //   }
  // }, [window.Stripe]); // V3

  React.useEffect(() => {
    document.body.style.top = '5rem'
    document.body.style.position = 'absolute'
  }, [])

  if (!stripePromise) {
    return <></>;
  }
  return (
    <div>
      <RemixFrame>
      <Toolbar
        ref={toolbarRef}
        {...{
          editMode,
          setEditMode,
          selected,
          setSelected,
          stripePromise,
          paymentRef,
        }}
      />
      </RemixFrame>
      <DOMEditor
        visible={editMode}
        toolbarRef={toolbarRef}
        paymentRef={paymentRef}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}

export default App;
