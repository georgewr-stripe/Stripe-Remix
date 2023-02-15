import { AddressMode } from "@stripe/stripe-js";
import React, { ChangeEventHandler } from "react";
import Button from "./components/Button";
import Toggle from "./components/Toggle";
import CURRENCIES from "./currencies.json";
import env from "../env";

interface PaymentSetupProps {
  setClientSecret: React.Dispatch<React.SetStateAction<string | undefined>>;
  collectAddress: boolean;
  setCollectAddress: React.Dispatch<React.SetStateAction<boolean>>;
  addressMode: AddressMode;
  setAddressMode: React.Dispatch<React.SetStateAction<"shipping" | "billing">>;
  link: boolean;
  setLink: React.Dispatch<React.SetStateAction<boolean>>;
  accordion: boolean;
  setAccordion: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentSetup = (props: PaymentSetupProps) => {
  const [currency, setCurrency] = React.useState("gbp");
  const [price, setPrice] = React.useState<number | undefined>(10.99);
  const [description, setDescription] = React.useState("Test Product");

  const {
    collectAddress,
    setCollectAddress,
    addressMode,
    setAddressMode,
    link,
    setLink,
    accordion,
    setAccordion,
  } = props;

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
      <div className="tw-flex tw-justify-evenly tw-align-middle">
        
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
        <div className="tw-mt-2 tw-p-4">
          <div className="tw-flex tw-flex-row">
            <span className="tw-text tw-mr-2">Link?</span>
            <Toggle colour="#635BFF" on={link} setOn={setLink} />
          </div>
        </div>
        <div className="tw-mt-2 tw-p-4">
          <div className="tw-flex tw-flex-row">
            <span className="tw-text tw-mr-2">Accordion?</span>
            <Toggle colour="#635BFF" on={accordion} setOn={setAccordion} />
          </div>
        </div>
      </div>

      <div className="tw-w-full tw-flex tw-flex-row-reverse tw-mt-3 mr-4">
        <Button className="" onClick={handleSubmit}>
          Go
        </Button>
      </div>
    </div>
  );
};

export default PaymentSetup;
