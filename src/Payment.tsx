import React, { ChangeEventHandler, FormEvent } from "react";
import {
  Elements,
  useElements,
  useStripe,
  PaymentElement,
  AddressElement,
} from "@stripe/react-stripe-js";
import { Stripe } from "@stripe/stripe-js/types/stripe-js/stripe";
import env from "../env";
import CURRENCIES from "./currencies.json";
import Button from "./components/Button";
import Toggle from "./components/Toggle";
import { AddressMode } from "@stripe/stripe-js/types/stripe-js/elements/address";

interface PaymentFormProps {
  setClientSecret: React.Dispatch<React.SetStateAction<string | undefined>>;
  collectAddress: boolean;
  setCollectAddress: React.Dispatch<React.SetStateAction<boolean>>;
  addressMode: AddressMode;
  setAddressMode: React.Dispatch<React.SetStateAction<"shipping" | "billing">>;
}

const PaymentForm = (props: PaymentFormProps) => {
  const [currency, setCurrency] = React.useState("gbp");
  const [price, setPrice] = React.useState<number | undefined>(10.99);
  const [description, setDescription] = React.useState("Test Product");

  const { collectAddress, setCollectAddress, addressMode, setAddressMode } =
    props;

  const currencySymbol = React.useMemo(() => {
    return (0)
      .toLocaleString(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })
      .replace(/\d/g, "")
      .trim();
  }, [currency]);

  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const t = e.target as HTMLInputElement;
    if (!t.value) {
      setPrice(undefined);
      return;
    }
    const rounded = Number(t.value)
      .toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    setPrice(Number(rounded));
  };

  const handleSubmit = async () => {
    const resp = await fetch(env.SERVER_URL + "/api/create_payment_intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: price ? price * 100 : 1099,
        currency,
        description,
      }),
    });
    if (resp.ok) {
      const { client_secret } = await resp.json();
      props.setClientSecret(client_secret);
    } else {
      console.log("Payment Intent Creation Failed:", await resp.text());
    }
  };
  return (
    <div className="tw-p-4 tw-rounded-md tw-border-blurple tw-border-4">
      <div className="">
        <div>
          <div className="tw-px-4">
            <label
              htmlFor="price"
              className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
            >
              Price
            </label>
            <div className="tw-relative tw-mt-1 tw-rounded-md tw-shadow-sm">
              <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <span className="tw-text-gray-500 tw-sm:text-sm">
                  {currencySymbol}
                </span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handlePriceChange}
                className="tw-block tw-w-full tw-rounded-md tw-border-blurple tw-p-2 tw-border tw-pl-14 tw-pr-12 tw-focus:border-indigo-500 tw-focus:ring-indigo-500 tw-sm:text-sm"
              />
              <div className="tw-absolute tw-inset-y-0 tw-right-0 tw-flex tw-items-center">
                <label htmlFor="currency" className="tw-sr-only">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={currency}
                  defaultValue={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="tw-h-full tw-rounded-md tw-border-transparent tw-bg-transparent tw-py-0 tw-pl-2 tw-pr-7 tw-text-gray-500 tw-focus:border-indigo-500 tw-focus:ring-indigo-500 tw-sm:text-sm"
                >
                  {CURRENCIES.map((c) => (
                    <option value={c} key={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tw-mt-2 tw-p-4">
        <label
          htmlFor="description"
          className="tw-block tw-text-sm tw-font-medium tw-text-gray-700"
        >
          Description
        </label>
        <div className="mt-1">
          <input
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="tw-block tw-w-full tw-rounded-md tw-p-2 tw-border-blurple tw-border tw-tw-shadow-sm tw-focus:border-blurple tw-focus:ring-blurple tw-sm:text-sm"
            placeholder="Test Product"
          />
        </div>
      </div>
      <div className="tw-mt-2 tw-p-4">
        <div className="tw-flex tw-flex-row">
          <span className="tw-text tw-mr-2">Collect Address?</span>
          <Toggle
            colour="#635BFF"
            on={collectAddress}
            setOn={setCollectAddress}
          />
        </div>
        {collectAddress ? (
          <div className="tw-flex tw-flex-row">
            <span className="tw-mr-2">Billing</span>
            <Toggle
              colour="#635BFF"
              on={addressMode == "billing"}
              setOn={(shipping) =>
                setAddressMode(shipping ? "billing" : "shipping")
              }
            />
            <span>Shipping</span>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="tw-w-full tw-flex tw-flex-row-reverse tw-mt-3 mr-4">
        <Button className="" onClick={handleSubmit}>
          Go
        </Button>
      </div>
    </div>
  );
};

const StripePaymentElement = (props: {
  collectAddress: boolean;
  addressMode: AddressMode;
}) => {
  const { collectAddress, addressMode } = props;
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>();

  const stripe = useStripe();
  const elements = useElements();

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
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {collectAddress ? <AddressElement options={{ mode: addressMode }} /> : ""}
      <Button className="tw-mt-2 tw-right">Pay Now</Button>
    </form>
  );
};

interface PaymentProps {
  stripePromise: Stripe | null;
}

const Payment = React.forwardRef(
  (props: PaymentProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const { stripePromise } = props;

    const [content, setContent] = React.useState<JSX.Element>();
    const [clientSecret, setClientSecret] = React.useState<string>();
    const [collectAddress, setCollectAddress] = React.useState(false);
    const [addressMode, setAddressMode] =
      React.useState<AddressMode>("billing");

    React.useEffect(() => {
      const f = async () => {
        if (stripePromise && clientSecret) {
          setContent(
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentElement
                collectAddress={collectAddress}
                addressMode={addressMode}
              />
            </Elements>
          );
        } else {
          if (stripePromise) {
            setContent(
              <PaymentForm
                {...{
                  setClientSecret,
                  setCollectAddress,
                  setAddressMode,
                  collectAddress,
                  addressMode,
                }}
              />
            );
          }
          //
        }
      };
      f();
    }, [stripePromise, clientSecret, addressMode, collectAddress]);

    if (!stripePromise) {
      return <></>;
    }

    return <div ref={ref}>{content}</div>;
  }
);

export default Payment;
