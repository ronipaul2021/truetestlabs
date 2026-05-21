"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_for_local_mvp';
// Setup upload directory
const uploadDir = path_1.default.join(__dirname, 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir);
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = (0, multer_1.default)({ storage });
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static(uploadDir));
// --- Auth Middleware ---
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
// --- Auth Routes ---
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser)
            return res.status(400).json({ error: 'User already exists' });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(400).json({ error: 'Invalid credentials' });
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({ error: 'Invalid credentials' });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user.id, email: user.email } });
    }
    catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// --- Mock Routing Engine ---
function getDistance(lat1, lon1, lat2, lon2) {
    // Haversine formula for mock distance
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}
function mockSendWhatsApp(phoneNumber, imageUrl) {
    console.log(`\n======================================================`);
    console.log(`🚀 [TRUETESTLABS MOCK ROUTER] Sending Prescription`);
    console.log(`   To Center Phone : ${phoneNumber}`);
    console.log(`   Image File      : ${imageUrl}`);
    console.log(`======================================================\n`);
}
// --- Upload Route ---
// Use a dummy user coordinate (New York approx) to find closest centers
const DUMMY_LAT = 40.7120;
const DUMMY_LON = -74.0060;
app.post('/upload', authenticate, upload.single('prescription'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    try {
        const imageUrl = `/uploads/${req.file.filename}`;
        // Query all centers
        const allCenters = await prisma.diagnosticCenter.findMany();
        // Sort by distance to dummy location and take top 5
        const centersWithDistance = allCenters.map((center) => ({
            ...center,
            distance: getDistance(DUMMY_LAT, DUMMY_LON, center.latitude, center.longitude)
        }));
        const top5Centers = centersWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5);
        // Trigger mock routing
        top5Centers.forEach((center) => {
            mockSendWhatsApp(center.phoneNumber, req.file.filename);
        });
        res.json({
            message: 'Prescription routed successfully',
            routedCenters: top5Centers.map((c) => ({ name: c.name, phoneNumber: c.phoneNumber, distance: c.distance.toFixed(2) + ' km' }))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process prescription' });
    }
});
// API for fetching centers
app.get('/centers', async (req, res) => {
    try {
        const centers = await prisma.diagnosticCenter.findMany();
        res.json({ centers });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch centers' });
    }
});
// Admin API to add new center
app.post('/centers', async (req, res) => {
    const { name, latitude, longitude, phoneNumber } = req.body;
    try {
        const center = await prisma.diagnosticCenter.create({
            data: {
                name,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                phoneNumber,
            },
        });
        res.json(center);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create center' });
    }
});
app.listen(PORT, () => {
    console.log(`TrueTestLabs Backend running on http://localhost:${PORT}`);
});
