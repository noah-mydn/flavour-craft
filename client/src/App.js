import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";
import AnimatedRoutes from "./components/Routes/AnimatedRoutes";
import store from "./redux/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import React from "react";
function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </Provider>
      <Toaster position="top-right" reverseOrder={false} />
    </ThemeProvider>
  );
}

export default App;
