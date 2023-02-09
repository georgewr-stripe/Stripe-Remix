import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const ROOT_ID = "stripe-remix-app";

const oldApp = document.getElementById(ROOT_ID);
if (oldApp) {
  oldApp.remove();
}

const rootElement = document.createElement("div");
rootElement.id = ROOT_ID;
document.body.insertBefore(rootElement, document.body.childNodes[0]);
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
