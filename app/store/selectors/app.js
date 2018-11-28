const selectAppTime = ({ app }) => app.appTime;
const selectAcceptedTerms = ({ app }) => app.terms;
const selectToggleModal = ({ app }) => app.keepModalOpen;

export { selectAppTime, selectAcceptedTerms, selectToggleModal };
