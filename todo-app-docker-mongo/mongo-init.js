// Script khởi tạo database và user
db = db.getSiblingDB('todoapp');

// Tạo user cho app
db.createUser({
  user: 'todouser',
  pwd: 'todopass123',
  roles: [
    {
      role: 'readWrite',
      db: 'todoapp'
    }
  ]
});

print('Database todoapp và user todouser đã được tạo!');
