import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import CheckIn from "./pages/CheckIn";
import Signal from "./pages/Signal";
import CareCircle from "./pages/CareCircle";
import Nudges from "./pages/Nudges";
import Calendar from "./pages/Calendar";
import Privacy from "./pages/Privacy";
import Counsellor from "./pages/Counsellor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="checkin" element={<CheckIn />} />
          <Route path="signal" element={<Signal />} />
          <Route path="circle" element={<CareCircle />} />
          <Route path="nudges" element={<Nudges />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="counsellor" element={<Counsellor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
