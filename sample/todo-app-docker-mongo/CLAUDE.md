# Project: Full-stack Todo Learning App

## Context

Educational project for learning Node.js backend with React frontend. User is beginner in backend, knows React basics.

## Permissions

- READ: all files/folders
- WRITE: all files/folders
- CREATE: all files/folders
- DELETE: ❌ FORBIDDEN

## Project Structure

```
fullstack-todo-app/
├── backend/          # Node.js Express API
├── frontend/         # React app
└── LEARNING_GUIDE.md # Main educational doc
```

## Tech Stack

**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend**: React (hooks), Context API, fetch API

## Coding Rules

1. All comments in Vietnamese
2. Function comments must describe input/output
3. Use async/await, no callbacks
4. Always try-catch for async operations
5. Error responses: `res.status(code).json({error: message})`
6. Variable names: clear, descriptive
7. Max 150 lines per file
8. No advanced patterns - keep simple for learning

## File Responsibilities

- `server.js`: Entry point, middleware setup, routes mounting
- `config/db.js`: MongoDB connection only
- `models/*.js`: Mongoose schemas only
- `routes/*.js`: Route handlers, business logic
- `middleware/*.js`: Reusable middleware functions

## API Conventions

- Base: `/api`
- Auth: `/api/auth/register`, `/api/auth/login`
- Todos: `/api/todos`, `/api/todos/:id`
- Protected routes require JWT in header: `Authorization: Bearer <token>`
- Response format: `{data}` or `{error: "message"}`

## Common Patterns

**Route handler template:**

```javascript
// Get all items
const getItems = async (req, res) => {
  try {
    const items = await Model.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

**Auth middleware check:**

```javascript
// Verify JWT and attach user to req
const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    // decode and verify
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
```

## When Creating Files

1. Create in correct folder per structure above
2. Add header comment explaining file purpose
3. Export functions/modules at bottom
4. No circular dependencies

## When Editing

1. Explain what you're changing and why
2. Preserve existing comments
3. Test mentally before saving
4. Update related files if needed

## Documentation Rules

- LEARNING_GUIDE.md: step-by-step phases, theory before code
- README.md: setup instructions only
- Comments: explain "why", not "what"

## Optimization

- Don't repeat code explanations across files
- Reference other files instead of duplicating
- Use brief inline comments for complex logic
- Long explanations go in LEARNING_GUIDE.md only

```

```
