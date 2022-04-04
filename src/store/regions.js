export default {
    namespaced: true,
    state: {
        item: {

        },
        dialog: false,
        added: false,
        isEdit: false,
    },
    mutations: {
        updateItem(state, val) {
            state.item = val
        },
        toggleDialog(state) {
            state.dialog = !state.dialog
            if(state.dialog) {
                state.added = false
            }
        },
        toggleAdded(state) {
            state.added = !state.added
        },
        toggleEdit(state) {
            state.isEdit = !state.isEdit
            // if(state.isEdit){
            //     state[dialog] = true
            // }
        },
    },
    actions: {},
}
