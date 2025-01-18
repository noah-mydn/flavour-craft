import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";

import AnimatedRoutes from "./components/Routes/AnimatedRoutes";
import { store, persistor } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";
import { useSessionVerifier } from "./hooks/useSessionVerifier";
import React from "react";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
