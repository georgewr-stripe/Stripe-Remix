import React, { ChangeEventHandler, FormEvent } from "react";
import {
  Elements,
  useElements,
  useStripe,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js/types/stripe-js/stripe";
import Button from "./components/Button";
import { AddressMode } from "@stripe/stripe-js/types/stripe-js/elements/address";
import PaymentSetupForm from "./PaymentSetupForm";
import StripePaymentElement from "./StripePaymentElement";
import RemixFrame from "./RemixFrame";

interface PaymentProps {
  stripePromise: Promise<Stripe | null>;
}

const PaymentInjector = React.forwardRef(
  (props: PaymentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { stripePromise } = props;

    const [content, setContent] = React.useState<JSX.Element>();
    const [clientSecret, setClientSecret] = React.useState<string>();
    const [collectAddress, setCollectAddress] = React.useState(false);
    const [addressMode, setAddressMode] =
      React.useState<AddressMode>("billing");
    const [link, setLink] = React.useState(true);
    const [accordion, setAccordion] = React.useState(true);

    React.useEffect(() => {
      const f = async () => {
        if (clientSecret) {
          setContent(
            <Elements
              stripe={stripePromise}
              options={{ clientSecret, loader: "auto" }}
            >
              <StripePaymentElement
                link={link}
                collectAddress={collectAddress}
                addressMode={addressMode}
                accordion={accordion}
              />
            </Elements>
          );
        } else {
          setContent(
            <RemixFrame>
              <PaymentSetupForm
                {...{
                  setClientSecret,
                  setCollectAddress,
                  setAddressMode,
                  collectAddress,
                  addressMode,
                  link,
                  setLink,
                  accordion,
                  setAccordion,
                }}
              />
            </RemixFrame>
          );
        }
      };
      f();
    }, [
      stripePromise,
      clientSecret,
      addressMode,
      collectAddress,
      link,
      accordion,
    ]);

    if (!stripePromise) {
      return <></>;
    }

    return (
      <div className="stripe-remix-inserted-element" ref={ref}>
        {content}
      </div>
    );
  }
);

export default PaymentInjector;
