import { Outlet } from "react-router";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import { UserProvider, useAuth } from "./Context/useAuth";
import { AppointmentProvider } from "./Context/useAppointment";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

function App() {
  const  token = Cookies.get("token")
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (token) {
      navigate("/home");
    } else if (
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    }
  }, [token]);

  return (
    <>
      <UserProvider>
        <AppointmentProvider>
          <Outlet />
        </AppointmentProvider>
        <ToastContainer />
      </UserProvider>
    </>
  );
}

export default App;
