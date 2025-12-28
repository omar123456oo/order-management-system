const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./office_order.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize Database Tables
function initializeDatabase() {
    // Users Table
    db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
        if (err) {
            console.error('Error creating users table:', err);
        } else {
            console.log('✅ Users table ready');
            seedDefaultUsers();
        }
    });

    // Orders Table
    db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      user_name TEXT NOT NULL,
      item_id INTEGER NOT NULL,
      item_name TEXT NOT NULL,
      item_icon TEXT,
      status TEXT DEFAULT 'pending',
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      delivered_at DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `, (err) => {
        if (err) {
            console.error('Error creating orders table:', err);
        } else {
            console.log('✅ Orders table ready');
        }
    });

    // Stock Table
    db.run(`
    CREATE TABLE IF NOT EXISTS stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      min_level INTEGER NOT NULL,
      icon TEXT,
      category TEXT
    )
  `, (err) => {
        if (err) {
            console.error('Error creating stock table:', err);
        } else {
            console.log('✅ Stock table ready');
            seedDefaultStock();
        }
    });
}

// Seed Default Users
async function seedDefaultUsers() {
    db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
        if (err) {
            console.error('Error checking users:', err);
            return;
        }

        if (row.count === 0) {
            const defaultUsers = [
                { username: 'john.doe', password: 'emp123', role: 'employee', name: 'John Doe', email: 'john@company.com', department: 'IT', phone: '0123456789' },
                { username: 'jane.smith', password: 'emp123', role: 'employee', name: 'Jane Smith', email: 'jane@company.com', department: 'HR', phone: '0123456780' },
                { username: 'mike.jones', password: 'emp123', role: 'employee', name: 'Mike Jones', email: 'mike@company.com', department: 'Marketing', phone: '0123456781' },
                { username: 'office.boy', password: 'boy123', role: 'officeBoy', name: 'Ahmed Ali', email: 'ahmed@company.com', department: null, phone: '0123456782' },
                { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin User', email: 'admin@company.com', department: null, phone: '0123456783' }
            ];

            for (const user of defaultUsers) {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                db.run(
                    'INSERT INTO users (username, password, role, name, email, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [user.username, hashedPassword, user.role, user.name, user.email, user.department, user.phone],
                    (err) => {
                        if (err) console.error('Error seeding user:', err);
                    }
                );
            }
            console.log('✅ Default users seeded');
        }
    });
}

// Seed Default Stock
function seedDefaultStock() {
    db.get('SELECT COUNT(*) as count FROM stock', (err, row) => {
        if (err) {
            console.error('Error checking stock:', err);
            return;
        }

        if (row.count === 0) {
            const defaultStock = [
                { name: 'Espresso', quantity: 120, min_level: 25, icon: '☕', category: 'Hot Drinks' },
                { name: 'Cappuccino', quantity: 100, min_level: 20, icon: '☕', category: 'Hot Drinks' },
                { name: 'Latte', quantity: 95, min_level: 20, icon: '☕', category: 'Hot Drinks' },
                { name: 'Green Tea', quantity: 80, min_level: 15, icon: '🍵', category: 'Hot Drinks' },
                { name: 'Herbal Tea', quantity: 70, min_level: 12, icon: '🍵', category: 'Hot Drinks' },
                { name: 'Hot Chocolate', quantity: 60, min_level: 12, icon: '🍫', category: 'Hot Drinks' },
                { name: 'Mineral Water', quantity: 150, min_level: 30, icon: '💧', category: 'Cold Drinks' },
                { name: 'Sparkling Water', quantity: 110, min_level: 20, icon: '💧', category: 'Cold Drinks' },
                { name: 'Orange Juice', quantity: 85, min_level: 15, icon: '🍊', category: 'Cold Drinks' },
                { name: 'Apple Juice', quantity: 75, min_level: 15, icon: '🍎', category: 'Cold Drinks' },
                { name: 'Energy Drink', quantity: 55, min_level: 10, icon: '⚡', category: 'Cold Drinks' },
                { name: 'Protein Shake', quantity: 45, min_level: 10, icon: '🥤', category: 'Cold Drinks' },
                { name: 'Granola Bar', quantity: 90, min_level: 18, icon: '🥜', category: 'Snacks' },
                { name: 'Chocolate Bar', quantity: 65, min_level: 12, icon: '🍫', category: 'Snacks' },
                { name: 'Mixed Nuts', quantity: 70, min_level: 14, icon: '🥜', category: 'Snacks' },
                { name: 'Fresh Fruit', quantity: 80, min_level: 16, icon: '🍎', category: 'Snacks' },
                { name: 'Yogurt', quantity: 50, min_level: 10, icon: '🥛', category: 'Snacks' },
                { name: 'Sandwich', quantity: 40, min_level: 8, icon: '🥪', category: 'Light Meals' },
                { name: 'Salad Bowl', quantity: 35, min_level: 7, icon: '🥗', category: 'Light Meals' }
            ];

            const insertStock = db.prepare('INSERT INTO stock (name, quantity, min_level, icon, category) VALUES (?, ?, ?, ?, ?)');

            defaultStock.forEach(item => {
                insertStock.run(item.name, item.quantity, item.min_level, item.icon, item.category);
            });

            insertStock.finalize();
            console.log('✅ Default stock seeded with 19 items');
        }
    });
}

// ============= API ROUTES =============

// Register New Employee
app.post('/api/register', async (req, res) => {
    const { username, password, name, email, department, phone } = req.body;

    // Validation
    if (!username || !password || !name || !email) {
        return res.status(400).json({ error: 'All required fields must be filled' });
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.run(
            'INSERT INTO users (username, password, role, name, email, department, phone) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [username, hashedPassword, 'employee', name, email, department, phone],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: 'Database error' });
                }

                res.status(201).json({
                    message: 'Registration successful!',
                    user: { id: this.lastID, username, name, email, role: 'employee' }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Don't send password to client
        const { password: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
    });
});

// Get All Users
app.get('/api/users', (req, res) => {
    db.all('SELECT id, username, role, name, email, department, phone, created_at FROM users', (err, users) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(users);
    });
});

// Get All Stock Items
app.get('/api/stock', (req, res) => {
    db.all('SELECT * FROM stock', (err, items) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(items);
    });
});

// Update Stock Quantity
app.put('/api/stock/:id', (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    db.run('UPDATE stock SET quantity = ? WHERE id = ?', [quantity, id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Stock updated successfully' });
    });
});

// Create Order
app.post('/api/orders', (req, res) => {
    const { user_id, user_name, item_id, item_name, item_icon } = req.body;

    // Check if user already ordered today
    const today = new Date().toISOString().split('T')[0];
    db.get(
        'SELECT * FROM orders WHERE user_id = ? AND date(date) = ?',
        [user_id, today],
        (err, existingOrder) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (existingOrder) {
                return res.status(400).json({ error: 'You have already placed an order today' });
            }

            // Create new order
            db.run(
                'INSERT INTO orders (user_id, user_name, item_id, item_name, item_icon, status) VALUES (?, ?, ?, ?, ?, ?)',
                [user_id, user_name, item_id, item_name, item_icon, 'pending'],
                function (err) {
                    if (err) {
                        return res.status(500).json({ error: 'Database error' });
                    }

                    db.get('SELECT * FROM orders WHERE id = ?', [this.lastID], (err, order) => {
                        if (err) {
                            return res.status(500).json({ error: 'Database error' });
                        }
                        res.status(201).json(order);
                    });
                }
            );
        }
    );
});

// Get All Orders
app.get('/api/orders', (req, res) => {
    db.all('SELECT * FROM orders ORDER BY date DESC', (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(orders);
    });
});

// Update Order Status
app.put('/api/orders/:id', (req, res) => {
    const { id } = req.params;
    const { status, item_id } = req.body;

    db.run(
        'UPDATE orders SET status = ?, delivered_at = ? WHERE id = ?',
        [status, new Date().toISOString(), id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            // Decrease stock when delivered
            if (status === 'delivered' && item_id) {
                db.run('UPDATE stock SET quantity = quantity - 1 WHERE id = ?', [item_id]);
            }

            res.json({ message: 'Order updated successfully' });
        }
    );
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`💾 Database: office_order.db\n`);
});

// Graceful Shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('\n✅ Database connection closed');
        process.exit(0);
    });
});
