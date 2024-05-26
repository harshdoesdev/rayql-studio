import React, { useState } from "react";
import SchemaEditor from "./SchemaEditor";
import SchemaList from "./SchemaList";
import { EditorLayoutProvider } from "../editor/EditorLayoutProvider.jsx";

export default function MainContainer() {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      <div className="grid min-h-0 w-full md:grid-cols-[250px_1fr]">
        <SchemaList />
        <EditorLayoutProvider>
          <SchemaEditor />
        </EditorLayoutProvider>
      </div>
    </div>
  );
}
