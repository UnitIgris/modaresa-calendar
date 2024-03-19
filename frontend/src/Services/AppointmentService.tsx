import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import {
  AllAppointmentDataType,
  BuyerType,
  VendorType,
} from "../Models/Appointment";

const api = "http://localhost:8080/api/appointments";

export const createAppointmentAPI = async (
  title: string,
  description: string,
  type: string,
  location: string,
  start_time: string,
  end_time: string,
  user_id: number,
  buyer_email: string,
  created?: string,
  appointment_id?: number
) => {
  try {
    const data = await axios.post<AllAppointmentDataType>(api + "/create", {
      appointment_id: appointment_id,
      title: title,
      description: description,
      type: type,
      location: location,
      start_time: start_time,
      end_time: end_time,
      user_id: user_id,
      created: created,
      buyer_email: buyer_email,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getAppointmentAPI = async (appointment_id: number) => {
  try {
    const data = await axios.get<AllAppointmentDataType>(
      `${api}/${appointment_id}`
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};
export const updateAppointmentAPI = async (
  title: string,
  description: string,
  type: string,
  location: string,
  start_time: string,
  end_time: string,
  appointment_id?: number
) => {
  try {
    const data = await axios.post<AllAppointmentDataType>(
      `${api}/${appointment_id}`,
      {
        title: title,
        description: description,
        type: type,
        location: location,
        start_time: start_time,
        end_time: end_time,
        appointment_id:appointment_id
      }
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteAppointmentAPI = async (
  user_id: number,
  appointment_id?: number
) => {
  try {
    const data = await axios.post<AllAppointmentDataType>(
      `${api}/delete/${appointment_id}`,
      {
        user_id: user_id,
      }
    );

    return data;
  } catch (error) {
    handleError(error);
  }
};

export const getAppointmentsForVendorAPI = async (user_id: number) => {
  try {
    const data = await axios.get<AllAppointmentDataType>(
      `${api}/vendor/${user_id}`
    );
    return data;
  } catch (error) {
    handleError(error);
  }
};
export const getAppointmentsForAppointmentBuyerAPI = async (
  buyer_id: number
) => {
  try {
    const data = await axios.get<BuyerType>(`${api}/${buyer_id}`);
    return data;
  } catch (error) {
    handleError(error);
  }
};
