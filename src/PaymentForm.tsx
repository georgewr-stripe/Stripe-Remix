import React from "react";
import { Elements, PaymentElement } from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js/types/stripe-js/stripe";

interface Props {
  clientSecret: string;
  stripePromise: Stripe | null;
}
const PaymentForm = (props: Props) => {
  const { stripePromise, clientSecret } = props;

  if (!stripePromise) {
    return <></>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <form>
        <PaymentElement />
        <button>Submit</button>
      </form>
    </Elements>
  );
};

export default PaymentForm;
