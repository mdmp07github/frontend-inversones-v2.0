import axios from '../axios'
import { AxiosResponse } from 'axios';

type Payload = Record<string, unknown>;
type APIResponse<T = any> = AxiosResponse<T>;

const RequestSignIn = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/login", s_payload);
}

const RequestVerifyToken = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/verify-token", s_payload);
}

const RequestRegister = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/register", s_payload);
}

const RequestGetOne = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/list-one-email/", s_payload);
}

const RequestProfile = async (): Promise<APIResponse> => {
  return await axios.get("/auth/profile");
}

const RequestLogout = async (): Promise<APIResponse> => {
  return await axios.post("/auth/logout");
}

const RequestEmail = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/send-email", s_payload);
}

const RequestVerificarCodigo = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/verificar-codigo", s_payload);
}

const RequestRestPassword = async (s_payload: Payload): Promise<APIResponse> => {
  return await axios.post("/auth/rest-password", s_payload);
}

export {
  RequestSignIn,
  RequestVerifyToken,
  RequestRegister,
  RequestGetOne,
  RequestProfile,
  RequestLogout,
  RequestEmail,
  RequestVerificarCodigo,
  RequestRestPassword
}