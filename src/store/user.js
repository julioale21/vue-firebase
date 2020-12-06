import { auth, fb } from "../firebase";

const state = {
    user: null
}

const getters = {}

const mutations = {
    setUser(state, user) {
        state.user = user;
    }
}

const actions = {
    getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsuscribe = auth.onAuthStateChanged(
                user => {
                    unsuscribe();
                    resolve(user)
                },
                () => {
                    reject();
                }
            );
        });
    },
    async updateProfileAction({ commit }, { name, email, password }) {
        const user = auth.currentUser;

        if(name) {
            await user.updateProfile({
                displayName: name
            });
        }

        if(email) {
            await user.updateEmail(email);
        }

        if(password) {
            await user.updatePassword(password);
        }

        commit('setUser', user);
    },
    async doLoginAction({ commit }, { email, password }) {
        await auth.setPersistence(fb.auth.Auth.Persistence.SESSION);
        await auth.signInWithEmailAndPassword(email, password);
        commit('setUser', auth.currentUser);
    },
    async doRegisterAction ({ commit }, { name, email, password }) {
        await auth.setPersistence(fb.auth.Auth.Persistence.SESSION);
        await auth.createUserWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        await user.updateProfile({
            displayName: name
        });
        commit('setUser', user);
    },
    async doLogoutAction({ commit }) {
        await auth.signOut();
        commit('setUser', null);
    },
    async doResetAction(context, email) {
        await auth.sendPasswordResetEmail(email);
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};