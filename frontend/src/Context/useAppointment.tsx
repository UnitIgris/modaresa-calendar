import { createContext, useEffect, useState } from "react";
import { AppointmentType } from "../Models/Appointment";

import {
  createAppointmentAPI,
  deleteAppointmentAPI,
  getAppointmentsForVendorAPI,
  updateAppointmentAPI,
} from "../Services/AppointmentService";
import { toast } from "react-toastify";
import React from "react";

type AppointmentContextType = {
  appointment: AppointmentType[] | null;
  createAppointment: (
    title: string,
    description: string,
    type: string,
    location: string,
    start_time: string,
    end_time: string,
    user_id: number,
    buyer_email: string
  ) => void;
  getAppointmentsForVendor: (user_id: number) => void;
  deleteAppointment: (user_id: number, appointment_id?: number) => void;
  updateAppointment: (
    title: string,
    description: string,
    type: string,
    location: string,
    start_time: string,
    end_time: string,
    appointment_id?: number
  ) => void;
};

type Props = { children: React.ReactNode };

const AppointmentContext = createContext<AppointmentContextType>(
  {} as AppointmentContextType
);

export const AppointmentProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<AppointmentType[] | null>(
    null
  );

  const createAppointment = async (
    title: string,
    description: string,
    type: string,
    location: string,
    start_time: string,
    end_time: string,
    user_id: number,
    buyer_email: string
  ) => {
    try {
      const res = await createAppointmentAPI(
        title,
        description,
        type,
        location,
        start_time,
        end_time,
        user_id,
        buyer_email
      );


      if (res?.status === 201) {
        setAppointment(res.data.appointments);
        toast.success("Appointment is booked!");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  const getAppointmentsForVendor = async (user_id: number) => {
    try {
      const res = await getAppointmentsForVendorAPI(user_id);

      if (res?.status === 200) {
        setAppointment(res.data.appointments);
        toast.success("Appointments loaded!");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  const updateAppointment = async (
    title: string,
    description: string,
    type: string,
    location: string,
    start_time: string,
    end_time: string,
    appointment_id?: number
  ) => {
    try {
      const res = await updateAppointmentAPI(
        title,
        description,
        type,
        location,
        start_time,
        end_time,
        appointment_id
      );

      if (res?.status === 200) {
        setAppointment(res.data.appointments);
        toast.success("Appointments loaded!");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  const deleteAppointment = async (
    user_id: number,
    appointment_id?: number
  ) => {
    try {
      const res = await deleteAppointmentAPI(user_id, appointment_id);

      if (res?.status === 200) {
        setAppointment(res.data.appointments);
        toast.success("Appointment deleted!");
      }
    } catch (error) {
      toast.warning("Server error occurred");
    }
  };

  return (
    <AppointmentContext.Provider
      value={{
        getAppointmentsForVendor,
        appointment,
        createAppointment,
        deleteAppointment,
        updateAppointment,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => React.useContext(AppointmentContext);
