export type AllAppointmentDataType = {
  appointments: AppointmentType[];
};

export type AppointmentType = {
  appointment_id?: number;
  title: string;
  description: string;
  type: string;
  location: string;
  start_time: string;
  end_time: string;
  vendor_id: number;
  created?: string;
  buyer_names?: BuyerType;
};

export type VendorType = {
  vendor_id: number;
  fullname: string;
  user_id: string;
  created: string;
};

export type BuyerType = {
  buyer_id: number;
  fullname: string;
  company_name: string;
  user_id: string;
  created: string;
};
