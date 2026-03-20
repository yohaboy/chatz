import client from './client';

export const getChats = () => client.get('/api/v1/chats');
export const getChatDetails = (chat_id: string) => client.get(`/api/v1/chats/${chat_id}`);
export const createGroupChat = (data: any) => client.post('/api/v1/chats/group', data);
export const getMessages = (chat_id: string) => client.get(`/api/v1/chats/${chat_id}/messages`);
export const sendMessage = (chat_id: string, text: string) => client.post(`/api/v1/chats/${chat_id}/messages`, { content: text });
