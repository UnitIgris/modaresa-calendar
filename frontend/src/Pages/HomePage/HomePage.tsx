import React, { useEffect, useState } from "react";
import "./HomePage.css";
import {
  Button,
  Calendar,
  Form,
  Input,
  Layout,
  Radio,
  RadioChangeEvent,
  TimePicker,
  theme,
  Badge,
  Avatar,
  Card,
  Skeleton,
  Modal,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { useAuth } from "../../Context/useAuth";
import { useAppointment } from "../../Context/useAppointment";
import { Store } from "antd/es/form/interface";
import Meta from "antd/es/card/Meta";
import { AppointmentType } from "../../Models/Appointment";
import { toast } from "react-toastify";

const { Content, Footer, Sider } = Layout;

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const { RangePicker } = TimePicker;
  const { user, logout } = useAuth();
  const {
    appointment,
    createAppointment,
    getAppointmentsForVendor,
    deleteAppointment,
    updateAppointment,
  } = useAppointment();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const [appointmentType, setAppointmentType] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setmodalData] = useState<AppointmentType | null>(null);

  const format = "HH:mm";
  const onChangeRadio = (e: RadioChangeEvent) => {
    setAppointmentType(e.target.value);
  };

  const showModal = (appointment: AppointmentType) => {
    setIsModalOpen(true);
    setmodalData(appointment);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onBookingAppointment = (values: Store) => {
    const { DatePicker, ...rest } = values;
    if (user !== null) {
      checkAppointmentConflict(DatePicker[0], DatePicker[1], appointment);
      createAppointment(
        rest.title,
        rest.description,
        rest.type,
        rest.location,
        DatePicker[0],
        DatePicker[1],
        user.id,
        rest.guest
      );
    }
  };
  const onChangingAppointment = (values: Store) => {
    const { DatePicker, ...rest } = values;
    checkAppointmentConflict(DatePicker[0], DatePicker[1], appointment);
    if (user !== null) {
      updateAppointment(
        rest.title,
        rest.description,
        rest.type,
        rest.location,
        DatePicker[0],
        DatePicker[1],
        modalData?.appointment_id
      );
    }
  };
  function checkAppointmentConflict(
    startTime: Date,
    endTime: Date,
    appointments: AppointmentType[] | null
  ) {
    if (appointments !== null) {
      for (const appointment of appointments) {
        const appointmentStartTime = new Date(appointment.start_time);
        const appointmentEndTime = new Date(appointment.end_time);
        const currentStartTime = new Date(startTime);
        const currentEndTime = new Date(endTime);

        if (
          (currentStartTime >= appointmentStartTime &&
            currentStartTime < appointmentEndTime) ||
          (currentEndTime > appointmentStartTime &&
            currentEndTime <= appointmentEndTime) ||
          (currentStartTime <= appointmentStartTime &&
            currentEndTime >= appointmentEndTime)
        ) {
          toast.error(
            "ATTENTION: Cet horaire se situe sur une plage horaire réservée."
          );
          break;
        }
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (user?.type === "vendor" && !appointment) {
        //😅
        getAppointmentsForVendor(user?.id);
      }
    })();
  }, [appointment]);

  return (
    <Layout className="min-h-screen">
      <Sider theme="light" breakpoint="md" width={"400"} collapsedWidth="0">
        <Form
          {...formItemLayout}
          onFinish={onBookingAppointment}
          variant="outlined"
          style={{ maxWidth: 600, margin: "24px 16px 0" }}
        >
          <div style={{ margin: " 0 24px 16px" }}>
            <strong> Book an appointment for today</strong>
          </div>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            label="Guest"
            name="guest"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Radio.Group onChange={onChangeRadio} value={appointmentType}>
              <Radio value={"virtual"}>virtual</Radio>
              <Radio value={"physical"}>physical</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Location"
            name="location"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DatePicker"
            name="DatePicker"
            rules={[{ required: true, message: "Please input!" }]}
          >
            <RangePicker
              needConfirm={false}
              minuteStep={15}
              hourStep={1}
              format={format}
            />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="default" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Sider>
      <Layout>
        <Content className="min-h-screen" style={{ margin: "24px 16px 0" }}>
          <div
            style={{
              padding: 24,
              minHeight: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <div className="flex flex-row justify-between">
                <h2>Appointment list : ({appointment?.length} planned)</h2>{" "}
                <Button onClick={logout}>Logout</Button>
              </div>
              <ul className=" flex flex-wrap justify-between">
                {appointment?.map((appointment) => (
                  <li key={appointment.appointment_id}>
                    <Card
                      title={appointment.title}
                      style={{ width: 300, marginTop: 16 }}
                      actions={[
                        <DeleteOutlined
                          key="setting"
                          onClick={() =>
                            deleteAppointment(
                              user?.id || 0,
                              appointment?.appointment_id || 0
                            )
                          }
                        />,
                        <EditOutlined
                          key="edit"
                          onClick={() => showModal(appointment)}
                        />,
                      ]}
                    >
                      <div> Info :{appointment.description}</div>
                      <div> {appointment.type}</div>
                      <div> With :{appointment.buyer_names?.company_name}</div>
                      <div> At :{appointment.location}</div>
                      <strong>Start at:</strong>{" "}
                      {new Date(appointment.start_time).toLocaleString()}
                      <br />
                      <strong>End at:</strong>{" "}
                      {new Date(appointment.end_time).toLocaleString()}
                    </Card>
                    <Modal
                      title="Basic Modal"
                      open={isModalOpen}
                      onOk={handleOk}
                      footer={null}
                      onCancel={handleCancel}
                    >
                      <Form
                        {...formItemLayout}
                        onFinish={onChangingAppointment}
                        variant="outlined"
                        style={{ maxWidth: 600, margin: "24px 16px 0" }}
                      >
                        <div style={{ margin: " 0 24px 16px" }}>
                          <strong> Changing "{modalData?.title}" </strong>
                        </div>
                        <Form.Item
                          label="Title"
                          name="title"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="Description"
                          name="description"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <Input.TextArea />
                        </Form.Item>

                        <Form.Item
                          label="Guest"
                          name="guest"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <Input />
                        </Form.Item>
                        <Form.Item
                          label="Type"
                          name="type"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <Radio.Group
                            onChange={onChangeRadio}
                            value={appointmentType}
                          >
                            <Radio value={"virtual"}>virtual</Radio>
                            <Radio value={"physical"}>physical</Radio>
                          </Radio.Group>
                        </Form.Item>

                        <Form.Item
                          label="Location"
                          name="location"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <Input />
                        </Form.Item>

                        <Form.Item
                          label="DatePicker"
                          name="DatePicker"
                          rules={[{ required: true, message: "Please input!" }]}
                        >
                          <RangePicker
                            needConfirm={false}
                            minuteStep={15}
                            hourStep={1}
                            format={format}
                          />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                          <Button type="default" htmlType="submit">
                            Submit
                          </Button>
                        </Form.Item>
                      </Form>
                    </Modal>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          {new Date().getFullYear()} Dev by Samuel LUNION
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
