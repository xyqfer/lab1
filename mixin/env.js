const asyncData = () => {
    const { API_HOST } = process.env;

    return {
        API_HOST,
    };
};

export {
    asyncData,
};