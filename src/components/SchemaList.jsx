import { useState } from 'react';
import { useEditor } from "../editor/hooks";

export default function SchemaList() {
  const { selectedSchema, schemas, editing, addSchema, removeSchema, selectSchema, editSchema, renameSchema } = useEditor();
  
  const [hoveredSchema, setHoveredSchema] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [schemaIdToDelete, setSchemaIdToDelete] = useState(null);

  const handleSchemaClick = (id) => {
    selectSchema(id);
  };

  const handleSchemaDoubleClick = (id) => {
    editSchema(id);
  };

  const handleInputChange = (id, newName) => {
    renameSchema(id, newName);
  };

  const handleRemoveSchema = (id) => {
    setSchemaIdToDelete(id);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    removeSchema(schemaIdToDelete);
    setShowConfirmationModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
  };

  return (
    <div className="flex min-h-0 flex-col border-r">
      <div className="flex items-center justify-between gap-2 px-4 py-2">
        <h2 className="m-0 text-base font-semibold">Schemas</h2>
        <button
          className="flex h-6 w-6 items-center justify-center rounded-md text-black hover:bg-black hover:text-guppie-green"
          onClick={addSchema}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-plus h-4 w-4"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        {
          !schemas.length
            ? <div className="py-2 px-4 text-sm">No schemas.</div>
            : (
              <ul className="flex flex-col gap-1 p-2 text-sm">
                {schemas.map((schema) => (
                  <li key={schema.id}>
                    {editing === schema.id ? (
                      <input
                        type="text"
                        value={schema.name}
                        onChange={(e) => handleInputChange(schema.id, e.target.value)}
                        onBlur={() => editSchema(null)}
                        className="w-full rounded border border-gray-300 p-2"
                        autoFocus
                      />
                    ) : (
                      <div
                        className={`flex justify-between items-center gap-2 rounded p-2 text-gray-500 transition-all ${selectedSchema?.id === schema.id ? "bg-gray-200" : ""}`}
                        onMouseEnter={() => setHoveredSchema(schema.id)}
                        onMouseLeave={() => setHoveredSchema(null)}
                      >
                        <a
                          className="text-gray-600 hover:text-gray-800"
                          href="#"
                          onClick={() => handleSchemaClick(schema.id)}
                          onDoubleClick={() => handleSchemaDoubleClick(schema.id)}
                        >
                          {schema.name}
                          {!schema.saved ? '*' : ''}
                        </a>
                        {(!editing && hoveredSchema === schema.id) && (
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveSchema(schema.id)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )
        }
      </div>
      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <DeleteConfirmationModal
          schemaName={schemas.find(schema => schema.id === schemaIdToDelete)?.name}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
}

function DeleteConfirmationModal({ schemaName, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="text-lg mb-4">Are you sure you want to delete {schemaName}?</p>
        <div className="flex justify-end">
          <button className="mr-2 px-4 py-2 border rounded-md bg-gray-200 hover:bg-gray-300" onClick={onCancel}>
            Cancel
          </button>
          <button className="px-4 py-2 border rounded-md bg-red-500 text-white hover:bg-red-600" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
