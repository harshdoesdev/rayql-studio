import init, { to_sql } from './rayql_wasm.js';

// Initialize the RayQL WASM module
await init();

// Get elements
const schemaTextarea = document.getElementById('schema');
const sqlOutputPre = document.getElementById('sql-output');
const errorMessageDiv = document.getElementById('error-message');
const copyButton = document.querySelector('.rayql-editor-copy-btn');

// Demo code
const demoCode = `# Enum for user types

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

// Function to handle tab insertion
schemaTextarea.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        event.preventDefault();
        const { selectionStart, selectionEnd } = schemaTextarea;
        const start = schemaTextarea.value.substring(0, selectionStart);
        const end = schemaTextarea.value.substring(selectionEnd);
        schemaTextarea.value = `${start}    ${end}`; // Four spaces for tab
        schemaTextarea.setSelectionRange(selectionStart + 4, selectionStart + 4);
        updateOutput(); // Update output after tab insertion
    }
});

// Function to update SQL output and error message
function updateOutput() {
    const schemaCode = schemaTextarea.value;
    try {
        const sql = to_sql(schemaCode);
        sqlOutputPre.textContent = sql;
        errorMessageDiv.textContent = ''; // Clear error message if successful
    } catch (error) {
        sqlOutputPre.textContent = ''; // Clear SQL output if error
        errorMessageDiv.textContent = error;
    }
}

// Function to copy SQL output to clipboard
function copyToClipboard() {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(sqlOutputPre);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
    // Display 'Copied' message
    copyButton.textContent = 'Copied';
    setTimeout(() => {
        copyButton.textContent = 'Copy';
    }, 1500); // Reset button text after 1.5 seconds
}

// Initial update with demo code when page loads
schemaTextarea.value = demoCode;
updateOutput();

// Add event listeners for input changes
schemaTextarea.addEventListener('input', updateOutput);
copyButton.addEventListener('click', copyToClipboard);
