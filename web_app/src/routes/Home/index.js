import HomeView from './components/HomeView'

// Sync route definition
export default (store) => ({
    onEnter: (nextState, replace, cb) => {
        const state = store.getState();

        if(!state.auth.userToken){
            replace('/login');
        }

        cb();
    },
    component: HomeView
});
