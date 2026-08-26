import * as ImagePicker from 'expo-image-picker';
import api from './api';
export interface Message{id:string;conversation_id:string;sender_id:string;message_type:'text'|'image'|'system';content:string;image_url?:string;is_read:boolean;created_at:string;sender?:{id:string;full_name:string;avatar_url?:string}}
export interface Conversation{id:string;errand_id:string;sender_id:string;errander_id:string;last_message?:string;last_message_at?:string;created_at:string;updated_at:string;errand_title?:string;errand_status?:string;sender_name?:string;sender_avatar?:string;errander_name?:string;errander_avatar?:string;unread_count?:number}
type Response<T=unknown>={success:boolean;message:string;data?:T;error?:string};
const request=async<T>(path:string,options?:RequestInit):Promise<Response<T>>=>{try{return await api<Response<T>>(path,options)}catch(error:any){return{success:false,message:error.message||'Request failed',error:error.message}}};
export const getConversations=()=>request<{conversations:Conversation[]}>('/chat/conversations');
export const getConversationByErrand=(id:string)=>request<{conversation:Conversation}>(`/chat/conversations/errand/${id}`);
export const getMessages=(id:string,limit=50,before?:string)=>request<{messages:Message[]}>(`/chat/conversations/${id}/messages?${new URLSearchParams({limit:String(limit),...(before?{before}:{})})}`);
export const sendMessage=(id:string,content:string)=>request<{message:Message}>(`/chat/conversations/${id}/messages`,{method:'POST',body:JSON.stringify({content,message_type:'text'})});
export const sendImageMessage=(id:string,imageUri:string,content='Sent an image')=>request<{message:Message}>(`/chat/conversations/${id}/messages`,{method:'POST',body:JSON.stringify({content,message_type:'image',image_url:imageUri})});
export const uploadChatImage=async(uri:string)=>uri;
export const markMessagesAsRead=(id:string)=>request(`/chat/conversations/${id}/read`,{method:'PATCH'});
export const subscribeToMessages=(_id:string,_onMessage:(message:Message)=>void)=>null;
export const subscribeToConversations=(_userId:string,_onUpdate:()=>void)=>null;
export const unsubscribeFromMessages=(_subscription?:unknown)=>{};
export const pickImage=async()=>{const p=await ImagePicker.requestMediaLibraryPermissionsAsync();if(p.status!=='granted')return null;const r=await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.8});return r.canceled?null:r.assets[0]?.uri||null};
export const takePhoto=async()=>{const p=await ImagePicker.requestCameraPermissionsAsync();if(p.status!=='granted')return null;const r=await ImagePicker.launchCameraAsync({mediaTypes:['images'],quality:.8});return r.canceled?null:r.assets[0]?.uri||null};
