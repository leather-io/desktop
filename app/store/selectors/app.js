const selectAppTime = ({ app }) => app.appTime;
const selectAcceptedTerms = ({ app }) => app.terms;
const selectToggleModal = ({ app }) => app.keepModalOpen;
const selectAppUpdateRequired = ({ app }) => app.updateRequired

export { selectAppTime, selectAcceptedTerms, selectToggleModal, selectAppUpdateRequired };
