import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./locales/i18n/config"
import "./globals.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)