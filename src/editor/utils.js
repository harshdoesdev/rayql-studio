export const EXAMPLE_SCHEMA = `\
# Enum for user types

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
}
`;

export const EXAMPLE_SCHEMA_ID = '$$RAYQL-EXAMPLE-SCHEMA$$';

const getExampleSchema = () => {
    return [EXAMPLE_SCHEMA_ID, 'example 1', EXAMPLE_SCHEMA];
};

const getNewSchema = (totalSchemas) => {
    return [crypto.randomUUID(), `new_schema_${totalSchemas + 1}`, ''];
};

export const createNewSchema = (totalSchemas, example_schema = false) => {
  const [id, name, code] = example_schema 
    ? getExampleSchema()
    : getNewSchema(totalSchemas);

  return { id, name, code, result: null, error: null, saved: false, };
};

function insertMatchingCharacters(event, leftChar, rightChar) {
  event.preventDefault();
  const { selectionStart, value } = event.target;
  const newValue = `${value.substring(0, selectionStart)}${leftChar}${rightChar}${value.substring(event.target.selectionEnd)}`;
  event.target.value = newValue;
  event.target.setSelectionRange(selectionStart + 1, selectionStart + 1);
}

const isCharacterKeyOrDel = key => key && key.length === 1;

const handleTabKey = (event, updateSchema) => {
  event.preventDefault();
  const { selectionStart, value } = event.target;
  const newValue = `${value.substring(0, selectionStart)}    ${value.substring(event.target.selectionEnd)}`;
  event.target.value = newValue;
  event.target.setSelectionRange(selectionStart + 4, selectionStart + 4);
  updateSchema(newValue);
};

const handleMatching = (event, updateSchema, leftChar, rightChar) => {
  insertMatchingCharacters(event, leftChar, rightChar);
  updateSchema(event.target.value);
};

const handleCharacterKeyOrDel = (event, updateSchema) => {
  updateSchema(event.target.value);
};

export const handleKeyAction = (event, updateSchema, selectedSchema) => {
  const keyActions = {
    Tab: () => handleTabKey(event, newValue => updateSchema(selectedSchema.id, newValue)),
    '{': () => handleMatching(event, newValue => updateSchema(selectedSchema.id, newValue), '{', '}'),
    '(': () => handleMatching(event, newValue => updateSchema(selectedSchema.id, newValue), '(', ')'),
    '[': () => handleMatching(event, newValue => updateSchema(selectedSchema.id, newValue), '[', ']'),
    '\'': () => handleMatching(event, newValue => updateSchema(selectedSchema.id, newValue), '\'', '\''),
    default: () => isCharacterKeyOrDel(event.key) && handleCharacterKeyOrDel(event, newValue => updateSchema(selectedSchema.id, newValue))
  };

  const action = keyActions[event.key] || keyActions.default;
  action();
};
