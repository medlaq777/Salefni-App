import React from "react";
import ReactDOM from "react-dom/client";
import {BrowerRouter} from "react-router-dom";
import App from "./App";
import "./assets/css/styles.css"


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowerRouter>
    <App/>
    </BrowerRouter>
  </React.StrictMode>
)
