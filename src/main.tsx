import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.tsx";

ReactDOM.createRoot(document.getElementById("root")!, {
    identifierPrefix: "testing-app", // React useId doc
}).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
