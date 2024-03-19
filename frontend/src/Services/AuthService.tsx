import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

const api = "http://localhost:8080/api/users";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/login", {
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  fullname: string,
  email: string,
  password: string,
  type: string,
  company_name: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(api + "/register", {
      email: email,
      fullname: fullname,
      password: password,
      type: type,
      company_name: company_name,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};
