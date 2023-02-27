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

const PaymentSetupForm = (props: PaymentSetupProps) => {
  const [currency, setCurrency] = React.useState("gbp");
  const [price, setPrice] = React.useState<number | undefined>(10.99);
  const [description, setDescription] = React.useState("Test Product");
  const [loading, setLoading] = React.useState(false);

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
    setLoading(true);
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
    setLoading(false);
  };
  return (
    <div className="p-4 rounded-md border-blurple border-4">
      <div className="">
        <div>
          <div className="px-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">
                  {currencySymbol}
                </span>
              </div>
              <input
                type="number"
                name="price"
                id="price"
                value={price}
                onChange={handlePriceChange}
                className="block w-full rounded-md border-blurple p-2 border pl-14 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <label htmlFor="currency" className="sr-only">
                  Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={currency}
                  defaultValue={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
      <div className="mt-2 p-4">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
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
            className="block w-full rounded-md p-2 border-blurple border shadow-sm focus:border-blurple focus:ring-blurple sm:text-sm"
            placeholder="Test Product"
          />
        </div>
      </div>
      <div className="flex justify-evenly align-middle">
        <div className="mt-2 p-4">
          <div className="flex flex-row">
            <span className="text mr-2">Collect Address?</span>
            <Toggle
              colour="#635BFF"
              on={collectAddress}
              setOn={setCollectAddress}
            />
          </div>
          {collectAddress ? (
            <div className="flex flex-row">
              <span className="mr-2">Billing</span>
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
        <div className="mt-2 p-4">
          <div className="flex flex-row">
            <span className="text mr-2">Link?</span>
            <Toggle colour="#635BFF" on={link} setOn={setLink} />
          </div>
        </div>
        <div className="mt-2 p-4">
          <div className="flex flex-row">
            <span className="text mr-2">Accordion?</span>
            <Toggle colour="#635BFF" on={accordion} setOn={setAccordion} />
          </div>
        </div>
      </div>

      <div className="w-full flex flex-row-reverse mt-3 mr-4">
        <Button
          className="bg-blurple text-white"
          onClick={handleSubmit}
          showSpinner={loading}
        >
          Go!
        </Button>
      </div>
    </div>
  );
};

export default PaymentSetupForm;
