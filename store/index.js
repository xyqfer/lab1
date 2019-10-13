export const state = () => ({
    API_HOST: '',
    GRAPHQL_TOKEN: '',
    RSS_HOST: '',
});
  
export const mutations = {
    setEnv (state) {
        const { API_HOST, GRAPHQL_TOKEN, RSS_HOST, } = process.env;
        state.API_HOST = API_HOST;
        state.GRAPHQL_TOKEN = GRAPHQL_TOKEN;
        state.RSS_HOST = RSS_HOST;
    },
};

export const actions = {
    nuxtServerInit ({ commit }) {
        commit('setEnv');
    },
};