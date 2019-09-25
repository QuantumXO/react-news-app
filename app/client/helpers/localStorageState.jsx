
export const loadLocalStorageState = () => {
    try {
        const serializedState = localStorage.getItem('state');

        if(serializedState === null) return;

        return JSON.parse(serializedState);

    }catch (err) {
        return;
    }
};

export const saveLocalStorageState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState)
    }catch (err) {
        //
    }
};
