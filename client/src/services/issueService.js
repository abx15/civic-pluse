import api from './api';

const createIssue = async (issueData) => {
    const response = await api.post('/issues', issueData);
    return response.data;
};

const getIssues = async () => {
    const response = await api.get('/issues');
    return response.data;
};

const updateStatus = async (id, statusData) => {
    const response = await api.put(`/issues/${id}/status`, statusData);
    return response.data;
};

export default {
    createIssue,
    getIssues,
    updateStatus
};
