import { ADD_SCHEMA, REMOVE_SCHEMA, EDIT_SCHEMA, SELECT_SCHEMA, UPDATE_RESULT, UPDATE_SCHEMA, UPDATE_SCHEMA_TEXT, SHOW_SCHEMA_ERROR, LOAD_STATE, SAVED, LOAD_DEFAULT_STATE } from "./actions";
import { createNewSchema } from "./utils.js";


const reducer = (state, action) => {
  let newState;
  switch (action.type) {
    case LOAD_STATE:
    case LOAD_DEFAULT_STATE:
      return { ...state, schemas: action.schemas, };
    case ADD_SCHEMA: {
      const newSchema = createNewSchema(state.schemas.length);
      newState = {
        ...state,
        schemas: [...state.schemas, newSchema],
        selectedSchema: newSchema,
        editing: newSchema.id,
      };
      localStorage.setItem("editorState", JSON.stringify(newState.schemas));
      return newState;
    }
    case REMOVE_SCHEMA: {
      const filteredSchemas = state.schemas.filter((schema) => schema.id !== action.id);
      newState = {
        ...state,
        schemas: filteredSchemas,
        selectedSchema: null,
        editing: null,
      };
      localStorage.setItem("editorState", JSON.stringify(filteredSchemas));
      return newState;
    }
    case SELECT_SCHEMA:
      return {
        ...state,
        selectedSchema: state.schemas.find((schema) => schema.id === action.id),
        editing: null,
      };
    case EDIT_SCHEMA:
      return {
        ...state,
        editing: action.id,
      };
    case UPDATE_SCHEMA: {
      const updatedSchemas = state.schemas.map((schema) =>
        schema.id === action.id ? { ...schema, name: action.newName } : schema,
      );
      newState = {
        ...state,
        schemas: updatedSchemas,
      };
      localStorage.setItem("editorState", JSON.stringify(updatedSchemas));
      return newState;
    }
    case UPDATE_SCHEMA_TEXT: {
      const updatedSchemas = state.schemas.map((schema) => {
        if (schema.id === action.id) {
          schema.code = action.code;
          schema.saved = false;
        }
        return schema;
      });
      newState = {
        ...state,
        schemas: updatedSchemas,
      };
      return newState;
    }
    case UPDATE_RESULT: {
      const updatedSchemas = state.schemas.map((schema) => {
        if (schema.id === action.id) {
          schema.result = action.result;
          schema.error = null;
        }
        return schema;
      });
      newState = {
        ...state,
        schemas: updatedSchemas,
      };
      return newState;
    }
    case SHOW_SCHEMA_ERROR: {
      const updatedSchemas = state.schemas.map((schema) => {
        if (schema.id === action.id) {
          schema.error = action.error;
          schema.result = null;
        }
        return schema;
      });
      newState = {
        ...state,
        schemas: updatedSchemas,
      };
      return newState;
    }
    case SAVED: {
      const updatedSchemas = state.schemas.map((schema) => {
        if (schema.id === action.id) {
          schema.saved = true;
        }
        return schema;
      });
      newState = {
        ...state,
        schemas: updatedSchemas,
      };
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
