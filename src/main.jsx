import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import store from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="892665723742-a5dipu14v11lll40jd2tvjg222iet7e4.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
      <Toaster position="buttom-center" reverseOrder={false} />
    </Provider>
  </GoogleOAuthProvider>
);
