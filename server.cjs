const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/office_order_system';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Mongoose Schemas
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['employee', 'officeBoy', 'admin'] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: String,
    phone: String,
    createdAt: { type: Date, default: Date.now }
});

const stockSchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    min_level: { type: Number, required: true },
    icon: String,
    category: String
});

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user_name: { type: String, required: true },
    item_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Stock', required: true },
    item_name: { type: String, required: true },
    item_icon: String,
    status: { type: String, default: 'pending', enum: ['pending', 'delivered'] },
    date: { type: Date, default: Date.now },
    delivered_at: Date
});

// Models
const User = mongoose.model('User', userSchema);
const Stock = mongoose.model('Stock', stockSchema);
const Order = mongoose.model('Order', orderSchema);

// Seed Default Data
async function seedDatabase() {
    try {
        // Seed Users
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const defaultUsers = [
                { username: 'john.doe', password: await bcrypt.hash('emp123', 10), role: 'employee', name: 'John Doe', email: 'john@company.com', department: 'IT', phone: '0123456789' },
                { username: 'jane.smith', password: await bcrypt.hash('emp123', 10), role: 'employee', name: 'Jane Smith', email: 'jane@company.com', department: 'HR', phone: '0123456780' },
                { username: 'mike.jones', password: await bcrypt.hash('emp123', 10), role: 'employee', name: 'Mike Jones', email: 'mike@company.com', department: 'Marketing', phone: '0123456781' },
                { username: 'office.boy', password: await bcrypt.hash('boy123', 10), role: 'officeBoy', name: 'Ahmed Ali', email: 'ahmed@company.com', phone: '0123456782' },
                { username: 'admin', password: await bcrypt.hash('admin123', 10), role: 'admin', name: 'Admin User', email: 'admin@company.com', phone: '0123456783' }
            ];
            await User.insertMany(defaultUsers);
            console.log('✅ Default users seeded');
        }

        // Seed Stock
        const stockCount = await Stock.countDocuments();
        if (stockCount === 0) {
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
            await Stock.insertMany(defaultStock);
            console.log('✅ Default stock seeded with 19 items');
        }
    } catch (error) {
        console.error('Error seeding database:', error);
    }
}

// Initialize database after connection
mongoose.connection.once('open', () => {
    seedDatabase();
});

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

        // Create new user
        const user = new User({
            username,
            password: hashedPassword,
            role: 'employee',
            name,
            email,
            department,
            phone
        });

        await user.save();

        res.status(201).json({
            message: 'Registration successful!',
            user: { id: user._id, username, name, email, role: 'employee' }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Don't send password to client
        const userObj = user.toObject();
        delete userObj.password;
        res.json({ user: userObj });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get All Users
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get All Stock Items
app.get('/api/stock', async (req, res) => {
    try {
        const items = await Stock.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update Stock Quantity
app.put('/api/stock/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    try {
        await Stock.findByIdAndUpdate(id, { quantity });
        res.json({ message: 'Stock updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Create Order
app.post('/api/orders', async (req, res) => {
    const { user_id, user_name, item_id, item_name, item_icon } = req.body;

    try {
        // Check if user already ordered today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingOrder = await Order.findOne({
            user_id,
            date: { $gte: today }
        });

        if (existingOrder) {
            return res.status(400).json({ error: 'You have already placed an order today' });
        }

        // Create new order
        const order = new Order({
            user_id,
            user_name,
            item_id,
            item_name,
            item_icon,
            status: 'pending'
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Get All Orders
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find().sort({ date: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Update Order Status
app.put('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status, item_id } = req.body;

    try {
        const updateData = {
            status,
            delivered_at: new Date()
        };

        await Order.findByIdAndUpdate(id, updateData);

        // Decrease stock when delivered
        if (status === 'delivered' && item_id) {
            await Stock.findByIdAndUpdate(item_id, { $inc: { quantity: -1 } });
        }

        res.json({ message: 'Order updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Database error' });
    }
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running', database: 'MongoDB' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`💾 Database: MongoDB\n`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('\n✅ MongoDB connection closed');
    process.exit(0);
});
