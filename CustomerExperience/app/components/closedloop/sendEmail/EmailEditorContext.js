import {createContext, useContext} from 'react';

const EmailEditorContext = createContext(null);

export const useEmailEditor = () => useContext(EmailEditorContext);

export default EmailEditorContext;
