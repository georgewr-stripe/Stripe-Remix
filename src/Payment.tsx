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
import PaymentSetup from "./PaymentSetup";
import { StripePaymentElementOptions } from "@stripe/stripe-js";

const StripePaymentForm = (props: {
  collectAddress: boolean;
  addressMode: AddressMode;
  link: boolean;
  accordion: boolean;
}) => {
  const { collectAddress, addressMode, link, accordion } = props;
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
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
  };

  return (
    <form onSubmit={handleSubmit} className="tw-mb-2">
      {link ? <LinkAuthenticationElement className="tw-mb-2" /> : ""}
      <PaymentElement options={PEOptions} />
      {collectAddress ? <AddressElement options={{ mode: addressMode }} /> : ""}
      <div className="tw-w-full tw-flex tw-flex-row-reverse">
        <Button className="tw-mt-3 tw-right">Pay Now</Button>
      </div>
    </form>
  );
};

interface PaymentProps {
  stripePromise: Promise<Stripe | null>;
}

const Payment = React.forwardRef(
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
              <StripePaymentForm
                link={link}
                collectAddress={collectAddress}
                addressMode={addressMode}
                accordion={accordion}
              />
            </Elements>
          );
        } else {
          setContent(
            <PaymentSetup
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

    return <div ref={ref}>{content}</div>;
  }
);

export default Payment;
