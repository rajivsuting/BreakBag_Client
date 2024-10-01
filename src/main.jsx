import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@material-tailwind/react";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* <Provider store={store}>
      <BrowserRouter>
        <MaterialTailwindControllerProvider> */}
          <ThemeProvider>
            <App />
          </ThemeProvider>
        {/* </MaterialTailwindControllerProvider>
      </BrowserRouter>
    </Provider> */}
  </React.StrictMode>
);
