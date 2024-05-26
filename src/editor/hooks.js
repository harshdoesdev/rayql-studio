import { useContext } from "react";
import { EditorContext } from "./EditorProvider";
import { SELECT_SCHEMA, EDIT_SCHEMA, UPDATE_SCHEMA, ADD_SCHEMA, UPDATE_SCHEMA_TEXT, UPDATE_RESULT, SHOW_SCHEMA_ERROR, REMOVE_SCHEMA, SAVED } from "./actions";

export const useEditorContext = () => useContext(EditorContext);

export const useEditor = () => {
  const { state, dispatch } = useEditorContext();

  const addSchema = () => {
    dispatch({ type: ADD_SCHEMA });
  };

  const removeSchema = (id) => {
    dispatch({ type: REMOVE_SCHEMA, id });
  };

  const selectSchema = (id) => {
    dispatch({ type: SELECT_SCHEMA, id });
  };

  const editSchema = (id) => {
    dispatch({ type: EDIT_SCHEMA, id });
  };

  const renameSchema = (id, newName) => {
    dispatch({ type: UPDATE_SCHEMA, id, newName: newName.replaceAll(' ', '_') });
  };

  const updateSchema = (id, code) => {
    dispatch({ type: UPDATE_SCHEMA_TEXT, id, code });
  };

  const updateResult = (id, result) => {
    dispatch({ type: UPDATE_RESULT, id, result });
  };

  const showError = (id, error) => {
    dispatch({ type: SHOW_SCHEMA_ERROR, id, error });
  };

  const saveSchema = (id) => {
    const schemaToSave = state.schemas.find((schema) => schema.id === id);

    schemaToSave.saved = true;
    
    if (schemaToSave) {
      let savedSchemas = JSON.parse(localStorage.getItem("editorState")) || [];
      
      const existingSchemaIndex = savedSchemas.findIndex((schema) => schema.id === id);
      
      if (existingSchemaIndex !== -1) {
        savedSchemas[existingSchemaIndex] = schemaToSave;
      } else {
        savedSchemas.push(schemaToSave);
      }
      
      localStorage.setItem("editorState", JSON.stringify(savedSchemas));

      dispatch({ type: SAVED, id });
    } else {
      console.error(`Schema with ID ${id} not found.`);
    }
  };
  
  return {
    schemas: state.schemas,
    selectedSchema: state.selectedSchema,
    editing: state.editing,
    addSchema,
    removeSchema,
    selectSchema,
    editSchema,
    renameSchema,
    updateSchema,
    updateResult,
    saveSchema,
    showError,
  };
};
