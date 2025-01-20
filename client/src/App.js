import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme/theme";
import { ToastContainer } from "react-toastify";
import AnimatedRoutes from "./components/Routes/AnimatedRoutes";
import store from "./redux/store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition="zoom"
      />
    </ThemeProvider>
  );
}

export default App;
