import { createContext, useState } from "react";

export const EDITOR_LAYOUT = {
    Horizontal: 'EDITOR_LAYOUT_HZ',
    Vertical: 'EDITOR_LAYOUT_VT',
};

export const EditorLayoutContext = createContext(null);

export const EditorLayoutProvider = ({ children }) => {
    const [layout, setLayout] = useState(EDITOR_LAYOUT.Horizontal);

    return (
        <EditorLayoutContext.Provider value={{ currentLayout: layout, setLayout }}>
            {children}
        </EditorLayoutContext.Provider>
    )
};
