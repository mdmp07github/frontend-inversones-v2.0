import axios from '../axios'
import { AxiosResponse } from 'axios';

type Payload = Record<string, unknown>;
type APIResponse<T = any> = AxiosResponse<T>;

const RequestListAll = async (): Promise<APIResponse> => {
  return await axios.get("/entidad/list-all");
};

const RequestListPage = async (page: number, records: number): Promise<APIResponse> => {
  return await axios.get(`/entidad/list-page?page=${page}&records=${records}`);
};

const RequestListOne = async (id: string): Promise<APIResponse> => {
  return await axios.get(`/entidad/list-one/${id}`);
};

const RequestCount = async (): Promise<APIResponse> => {
  return await axios.get("/entidad/count");
};

const RequestFilter = async (
  P1: string,
  P2: string,
  P3: string,
  P4: string,
  P5: string,
  P6: string,
  P7: string,
  P8: string
): Promise<APIResponse> => {
  return await axios.get(`/entidad/filter/${P1}/${P2}/${P3}/${P4}/${P5}/${P6}/${P7}/${P8}`);
};

const RequestInsert = async (payload: Payload): Promise<APIResponse> => {
  return await axios.post("/entidad/insert", payload);
};

const RequestUpdate = async (id: string, payload: Payload): Promise<APIResponse> => {
  return await axios.patch(`/entidad/update/${id}`, payload);
};

const RequestDelete = async (id: string): Promise<APIResponse> => {
  return await axios.delete(`/entidad/delete/${id}`);
};

export {
  RequestListAll,
  RequestListPage,
  RequestListOne,
  RequestCount,
  RequestFilter,
  RequestInsert,
  RequestUpdate,
  RequestDelete
};