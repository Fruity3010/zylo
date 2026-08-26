import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';
export interface SignupData { email:string; password:string; full_name:string; role:'sender'|'errander'|'both' }
export interface LoginData { email:string; password:string }
export interface User { id:string; email:string; full_name:string; role:'sender'|'errander'|'both'; tier?:number; phone?:string; avatar_url?:string; created_at:string; updated_at:string }
export interface AuthResponse { success:boolean; message:string; data?:{user:User;session:{access_token:string;refresh_token:string}}; error?:string }
const request=async(path:string,options:RequestInit):Promise<AuthResponse>=>{try{const result=await api<AuthResponse>(path,options);if(result.data?.session?.access_token)await AsyncStorage.multiSet([['auth_token',result.data.session.access_token],['user_data',JSON.stringify(result.data.user)]]);return result;}catch(error:any){return{success:false,message:error.message||'Request failed',error:error.message}}};
const demo=process.env.EXPO_PUBLIC_DEMO_MODE !== 'false';
const demoUser=(data:{email:string;full_name?:string;role?:User['role']}):User=>({id:'demo-user',email:data.email,full_name:data.full_name||'Demo User',role:data.role||'both',tier:2,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});
const startDemo=async(user:User):Promise<AuthResponse>=>{const token=`demo-${user.id}`;await AsyncStorage.multiSet([['auth_token',token],['user_data',JSON.stringify(user)]]);return{success:true,message:'Demo mode',data:{user,session:{access_token:token,refresh_token:token}}}};
export const signup=(data:SignupData)=>demo?startDemo(demoUser(data)):request('/auth/signup',{method:'POST',body:JSON.stringify(data)});
export const login=(data:LoginData)=>demo?startDemo(demoUser({email:data.email})):request('/auth/login',{method:'POST',body:JSON.stringify(data)});
export const logout=async()=>{try{await api('/auth/logout',{method:'POST'})}finally{await AsyncStorage.multiRemove(['auth_token','user_data'])}};
export const getCurrentUserFromStorage=async():Promise<User|null>=>{const value=await AsyncStorage.getItem('user_data');return value?JSON.parse(value):null};
export const getCurrentUser=getCurrentUserFromStorage;
export const isAuthenticated=async()=>Boolean(await AsyncStorage.getItem('auth_token'));
