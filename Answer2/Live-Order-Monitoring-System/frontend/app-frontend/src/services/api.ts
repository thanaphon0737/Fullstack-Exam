import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});
export const apiLogin = (credentials: { email: string; password: string }) => {
  return apiClient.post("/auth/signIn", credentials,{withCredentials:true});
};

export const apiRegister = (credentials: { email: string; password: string, role:string }) => {
  return apiClient.post("/auth/signUp", credentials,{withCredentials:true});
};
export const apiLogout = async () => {
  return apiClient.post("/auth/signOut",{withCredentials:true});
};

export const apiGetProfile = (token:string) => {
  return apiClient.get("/auth/profile",{withCredentials:true});
};

export const apiCreateOrder = (payload: {details:string,status: string,userId:string}) =>{
  return apiClient.post(`/orders`,payload,{withCredentials:true})
}

export const apiGetOrders = () =>{
  return apiClient.get('/orders',{withCredentials:true})
}

export const apiUpdateOrderStatus = (orderId: string, payload: {status: string}) => {
  return apiClient.patch(`orders/${orderId}`,payload,{withCredentials:true})
}