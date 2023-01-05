import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App, { QueryApp } from "./App";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <RecoilRoot>
    <QueryApp />
  </RecoilRoot>
);
