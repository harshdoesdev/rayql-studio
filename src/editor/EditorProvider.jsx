import { createContext, useReducer, useEffect } from "react";
import reducer from "./reducer";
import { LOAD_DEFAULT_STATE, LOAD_STATE } from "./actions.js";
import { createNewSchema } from "./utils.js";

export const EditorContext = createContext();

export const EditorContextProvider = ({ children }) => {
  const initialState = {
    schemas: [],
    editing: null,
    selectedSchema: null,
    schemaText: "",
    result: "",
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  // Load schema state from localStorage on component mount
  useEffect(() => {
    const storedSchemas = localStorage.getItem("editorState");
    if (storedSchemas) {
      dispatch({ type: LOAD_STATE, schemas: JSON.parse(storedSchemas) });
    } else {
      const schemas = [createNewSchema(0, true)];
      localStorage.setItem("editorState", JSON.stringify(schemas));
      dispatch({ type: LOAD_DEFAULT_STATE, schemas });
    }
  }, []);

  return (
    <EditorContext.Provider value={{ state, dispatch }}>
      {children}
    </EditorContext.Provider>
  );
};
