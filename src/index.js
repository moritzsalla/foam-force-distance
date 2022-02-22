import { StrictMode } from "react";
import ReactDOM from "react-dom";
import Canvas from "./components/Canvas";

const rootElement = document.getElementById("root");

ReactDOM.render(
  <StrictMode>
    <Canvas />
  </StrictMode>,
  rootElement
);
