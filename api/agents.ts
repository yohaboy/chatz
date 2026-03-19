import client from './client';

export const getAgentTemplates = () => client.get('/api/v1/agents/templates');
export const getAllAgents = () => client.get('/api/v1/agents');
export const getMyAgents = () => client.get('/api/v1/agents/my');
export const getAgent = (agent_id: string) => client.get(`/api/v1/agents/${agent_id}`);
export const getAgentPresence = (agent_id: string) => client.get(`/api/v1/agents/${agent_id}/presence`);
