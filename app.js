import init, { to_sql } from './rayql_wasm.js';

await init();

const exampleCode = `# Enum for user types

enum user_type {
    admin
    developer
    normal
}

# Model declaration for 'user'

model user {
    id: int primary_key auto_increment,
    username: str unique,
    email: str unique, # this is an inline comment
    phone_number: str?,
    user_type: user_type default(user_type.normal)
}

# Model declaration for 'post'

model post {
    id: int primary_key auto_increment,
    title: str default('New Post'),
    content: str,
    author_id: int foreign_key(user.id),
    created_at: timestamp default(now()),
}`;

class CodeEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <style>
          :host {
            display: block;
            width: 100%;
          }
          #editor {
            width: 100%;
            height: 300px;
            background-color: #2e2e2e;
            color: #e0e0e0;
            border: none;
            padding: 10px;
            box-sizing: border-box;
            font-family: inherit;
            resize: none;
          }
        </style>
        <textarea id="editor"></textarea>
      `;
        this.editor = this.shadowRoot.querySelector('#editor');
        this.output = document.getElementById('output');
        this.editor.value = exampleCode;
        this.updateEditorUI(this.editor.value);
        this.editor.addEventListener('input', () => this.updateEditorUI(this.editor.value));

        // Add event listener for tab keydown
        this.editor.addEventListener('keydown', (event) => {
            if (event.key === 'Tab') {
                event.preventDefault();
                const { selectionStart, selectionEnd } = this.editor;
                const start = this.editor.value.substring(0, selectionStart);
                const end = this.editor.value.substring(selectionEnd);
                this.editor.value = `${start}    ${end}`; // Four spaces for tab
                this.editor.setSelectionRange(selectionStart + 4, selectionStart + 4);
            }
        });
    }

    updateEditorUI(code) {
        try {
            const sql = to_sql(code);
            this.output.textContent = sql;
            this.output.classList.remove('error');
        } catch (error) {
            this.output.textContent = error;
            this.output.classList.add('error');
        }
    }

    get value() {
        return this.editor.value;
    }

    set value(newValue) {
        this.editor.value = newValue;
        this.updateEditorUI(newValue);
    }
}

customElements.define('code-editor', CodeEditor);
