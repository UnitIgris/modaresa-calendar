import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../Services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (
    fullname: string,
    email: string,
    password: string,
    type: string,
    company_name: string
  ) => void;
  loginUser: (email: string, password: string) => void;
  logout: () => void;
  isLoggedIn: () => boolean;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {

  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (user && token) {
      setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    fullname: string,
    email: string,
    password: string,
    type: string,
    company_name: string
  ) => {
    await registerAPI(email, fullname, password, type, company_name)
      .then((res) => {
        if (res?.status === 201) {
          Cookies.set("token", res?.data.token);
          const userObj = {
            id: res?.data.user.id,
            email: res?.data.user.email,
            fullname: res?.data.user.fullname,
            password: res?.data.user.password,
            type: res?.data.user.type,
          };
           
          setToken(res?.data.token!);
          setUser(userObj!);
          toast.success("Register Success!");
          navigate("/home");
          toast.success("Login Success!");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const loginUser = async (email: string, password: string) => {
    await loginAPI(email, password)
      .then((res) => {
        if (res?.status === 200) {
          Cookies.set("token", res?.data.token);
          const userObj = {
            id: res?.data.user.id,
            email: res?.data.user.email,
            fullname: res?.data.user.fullname,
            password: res?.data.user.password,
            type: res?.data.user.type,
          };console.log(userObj)
          Cookies.set("user", JSON.stringify({userObj}));
          setToken(res?.data.token!);
          setUser(userObj);
          toast.success("Login Success!");

          navigate("/home");
        }
      })
      .catch((e) => toast.warning("Server error occured"));
  };

  const isLoggedIn = () => {
    return !!user;
  };

  const logout = () => {
    Cookies.remove("token")
    Cookies.remove("user")
    setUser(null);
    setToken("");
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
