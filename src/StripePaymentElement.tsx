import React, { ChangeEventHandler, FormEvent } from "react";
import {
  useElements,
  useStripe,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";
import Button from "./components/Button";
import { AddressMode } from "@stripe/stripe-js/types/stripe-js/elements/address";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import RemixFrame from "./RemixFrame";

const StripePaymentElement = (props: {
  collectAddress: boolean;
  addressMode: AddressMode;
  link: boolean;
  accordion: boolean;
}) => {
  const { collectAddress, addressMode, link, accordion } = props;
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const stripe = useStripe();
  const elements = useElements();

  const PEOptions = React.useMemo<StripePaymentElementOptions>(() => {
    const options: StripePaymentElementOptions = {};
    if (accordion) {
      options.layout = {
        type: "accordion",
        defaultCollapsed: false,
        radios: true,
        spacedAccordionItems: false,
      };
    } else {
      options.layout = {
        type: "tabs",
        defaultCollapsed: false,
      };
    }
    return options;
  }, [accordion]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      redirect: "if_required",
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      id="stripe-remix-payment-element-form"
    >
      {link ? (
        <LinkAuthenticationElement id="link-authentication-element" />
      ) : (
        ""
      )}
      <PaymentElement options={PEOptions} />
      {collectAddress ? <AddressElement options={{ mode: addressMode }} /> : ""}
      <RemixFrame>
        <div className="w-full flex flex-row-reverse">
          <Button
            onClick={handleSubmit}
            disabled={loading}
            showSpinner={loading}
            className="mt-3 right bg-blurple text-white"
          >
            Pay Now
          </Button>
        </div>
      </RemixFrame>
    </form>
  );
};
export default StripePaymentElement;
