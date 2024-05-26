import React, { useCallback, useContext, useEffect, useState } from "react";
import { useEditor } from "../editor/hooks";
import { to_sql } from '../lib/rayql/rayql_wasm.js';
import { EDITOR_LAYOUT, EditorLayoutContext } from "../editor/EditorLayoutProvider.jsx";
import { IconClipboard, IconLayoutColumns, IconLayoutRows } from '@tabler/icons-react';
import { handleKeyAction } from '../editor/utils.js';

const SchemaEditor = () => {
  const { selectedSchema, updateSchema, updateResult, saveSchema, showError } = useEditor();
  const [copied, setCopied] = useState(false);
  const { currentLayout } = useContext(EditorLayoutContext);

  useEffect(() => {
    if (!selectedSchema) return;
    try {
      updateResult(selectedSchema.id, to_sql(selectedSchema.code));
    } catch (e) {
      showError(selectedSchema.id, e);
    }
  }, [selectedSchema?.code]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveSchema(selectedSchema.id);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedSchema]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(selectedSchema.result);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, [selectedSchema?.result]);

  const handleSchemaChange = event => {
    if (event.type === 'change') {
      updateSchema(selectedSchema.id, event.target.value);
      return;
    }

    handleKeyAction(event, updateSchema, selectedSchema);
  };

  return (
    <div className="flex flex-col flex-1 min-h-1">
      <div className={`flex ${currentLayout === EDITOR_LAYOUT.Horizontal ? "flex-col" : "flex-row"} px-4 py-2 flex-1 min-h-1 gap-2`}>
        {!selectedSchema ? (
          "No schema selected."
        ) : (
          <>
            <div className="flex flex-col flex-1 min-h-1 flex-shrink-0" style={{ width: currentLayout === EDITOR_LAYOUT.Horizontal ? "100%" : "50%" }}>
              <label className="text-gray-950 text-sm font-semibold mb-1">RayQL Schema</label>
              <textarea
                value={selectedSchema.code}
                onKeyDown={handleSchemaChange}
                onChange={handleSchemaChange}
                className="w-full rounded p-2 bg-gray-800 text-white text-sm font-mono min-h-1 h-full resize-none"
                placeholder="Enter your RayQL Schema here..."
                style={{ height: "100%", overflow: "auto" }}
              ></textarea>
            </div>
            <div className="flex flex-col flex-1 min-h-1" style={{ width: currentLayout === EDITOR_LAYOUT.Horizontal ? "100%" : "50%" }}>
              <label className="text-gray-950 text-sm font-semibold mb-1">Output</label>
              <div className="relative w-full rounded p-2 bg-gray-800 text-white text-sm font-mono flex-1 overflow-y-auto" style={{ height: "100%" }}>
                <pre>
                  {selectedSchema.result ?? ""}
                </pre>
                <button
                  onClick={copyToClipboard}
                  className="absolute inline-flex gap-1 items-center top-2 right-2 bg-gray-800 hover:bg-gray-700 text-white px-3 py-1 rounded"
                >
                  <IconClipboard />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <BottomPanel />
    </div>
  );
}

function BottomPanel() {
  const { selectedSchema } = useEditor();
  const { currentLayout, setLayout } = useContext(EditorLayoutContext);

  const handleSwitchLayout = () => {
    setLayout(currentLayout === EDITOR_LAYOUT.Horizontal ? EDITOR_LAYOUT.Vertical : EDITOR_LAYOUT.Horizontal)
  };

  if (!selectedSchema) {
    return null;
  }

  return (
    <div className="flex justify-between border-t border-gray-200 py-2 px-4">
      <p className={`whitespace-pre ${selectedSchema.error ? "text-red-600" : "text-black"}`}>
        {selectedSchema.error ? selectedSchema.error : "No errors 🎉"}
      </p>
      <div className="flex gap-4">
        <button onClick={handleSwitchLayout}>
          {
            currentLayout === EDITOR_LAYOUT.Horizontal
              ? (
                <IconLayoutColumns />
              )
              : (
                <IconLayoutRows />
              )
          }
        </button>
      </div>
    </div>
  );
}

export default SchemaEditor
