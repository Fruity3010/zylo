import api from './api';
export interface Location{latitude:number;longitude:number;address:string}
export interface Errand{id:string;sender_id:string;errander_id?:string;category:'fuel_energy'|'courier_delivery'|'office_work'|'custom';title:string;description:string;budget:number;pickup_location?:Location;destination_location:Location;status:'open'|'assigned'|'in_progress'|'completed'|'cancelled';image_urls?:string[];created_at:string;updated_at:string;completed_at?:string}
export interface CreateErrandData{category:Errand['category'];title:string;description:string;budget:number;pickup_location?:Location;destination_location:Location;image_urls?:string[]}
export interface ErrandFilters{status?:Errand['status'];category?:Errand['category'];sender_id?:string;errander_id?:string}
type Response<T=unknown>={success:boolean;message:string;data?:T;error?:string};
const request=async<T>(path:string,options?:RequestInit):Promise<Response<T>>=>{try{return await api<Response<T>>(path,options)}catch(error:any){return{success:false,message:error.message||'Request failed',error:error.message}}};
export const createErrand=(data:CreateErrandData)=>request<{errand:Errand}>('/errands',{method:'POST',body:JSON.stringify(data)});
export const getErrands=(filters:ErrandFilters={})=>request<{errands:Errand[]}>(`/errands?${new URLSearchParams(Object.entries(filters).filter(([,value])=>value).map(([key,value])=>[key,String(value)]))}`);
export const getErrandById=(id:string)=>request<{errand:Errand}>(`/errands/${id}`);
export const updateErrand=(id:string,updates:Partial<CreateErrandData>)=>request<{errand:Errand}>(`/errands/${id}`,{method:'PATCH',body:JSON.stringify(updates)});
export const deleteErrand=(id:string)=>request(`/errands/${id}`,{method:'DELETE'});
export const applyToErrand=(id:string)=>request<{errand:Errand}>(`/errands/${id}/apply`,{method:'POST'});
export const getMyPostedErrands=()=>getErrands();
export const getMyAssignedErrands=()=>getErrands();
