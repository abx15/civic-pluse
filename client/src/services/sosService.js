const getActiveAlerts = async () => {
    // Mock response
    return [];
};

const createSOS = async (data) => {
    console.log("SOS Created", data);
    return { success: true };
};

export default {
    getActiveAlerts,
    createSOS
};
