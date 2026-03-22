import axios from '../axios'
import { AxiosResponse } from 'axios';

type Payload = Record<string, unknown>;
type APIResponse<T = any> = AxiosResponse<T>;

const RequestListAll = async (): Promise<APIResponse> => {
  return await axios.get("/tipo-vela/list-all");
};

export {
  RequestListAll
};