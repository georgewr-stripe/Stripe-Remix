import React from "react";
import DOMEditor from "./DOMEditor";
import Toolbar from "./Toolbar";
import env from "../env";
import { Stripe } from "@stripe/stripe-js/types/stripe-js";

if (!env.STRIPE_PK) {
  throw "Stripe Public Key NOT FOUND, check env file";
}

function App() {
  const [editMode, setEditMode] = React.useState(false);
  const [stripePromise, setStripePromise] = React.useState<Stripe | null>(null);
  const [selected, setSelected] = React.useState<HTMLElement | null>(null);
  const toolbarRef = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (!stripePromise && window.Stripe) {
      setStripePromise(window.Stripe(env.STRIPE_PK));
    }
  }, [window.Stripe]);

  if (!stripePromise) {
    return <></>;
  }
  return (
    <div>
      <Toolbar
        ref={toolbarRef}
        {...{ editMode, setEditMode, selected, setSelected, stripePromise }}
      />
      <DOMEditor
        visible={editMode}
        toolbarRef={toolbarRef}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}

export default App;
