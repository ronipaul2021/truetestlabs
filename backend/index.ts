import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_for_local_mvp';

// Setup upload directory
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// --- Root Route for Status Check ---
app.get('/', (req: Request, res: Response) => {
  res.send('<h1>🚀 TrueTestLabs API is Running</h1><p>The backend is active and ready for mobile/admin connections.</p>');
});

// --- Auth Middleware ---
const authenticate = (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// --- Auth Routes ---
app.post('/register', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });
    
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- Mock Routing Engine ---
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  // Haversine formula for mock distance
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c; // Distance in km
}

function mockSendWhatsApp(phoneNumber: string, imageUrl: string) {
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

app.post('/upload', authenticate, upload.single('prescription'), async (req: MulterRequest, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Get the user who uploaded this
    const user = await prisma.user.findUnique({
      where: { id: (req as any).user.userId }
    });

    // Create the real Prescription record in the database
    // This makes it instantly visible to the Diagnostic Centers' Live Queue!
    const prescription = await (prisma as any).prescription.create({
      data: {
        patientName: user ? user.email.split('@')[0] : "Guest Patient",
        patientPhone: "+1-555-0199", // Placeholder until mobile app adds phone input
        imageUrl: imageUrl,
        latitude: DUMMY_LAT,
        longitude: DUMMY_LON,
        status: 'pending'
      }
    });

    // Query ONLY verified centers for prescription routing logic
    const allCenters = await (prisma as any).diagnosticCenter.findMany({
      where: { isVerified: true }
    });
    
    if (allCenters.length > 0) {
      // Sort by distance to dummy location and take top 5
      const centersWithDistance = allCenters.map((center: any) => ({
        ...center,
        distance: getDistance(DUMMY_LAT, DUMMY_LON, center.latitude, center.longitude)
      }));

      const top5Centers = centersWithDistance
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 5);

      // Trigger mock routing (WhatsApp)
      top5Centers.forEach((center: any) => {
        mockSendWhatsApp(center.phoneNumber, req.file!.filename);
      });

      return res.json({ 
        message: 'Prescription routed successfully', 
        prescriptionId: prescription.id,
        routedCenters: top5Centers.map((c: any) => ({ name: c.name, phoneNumber: c.phoneNumber, distance: (c.distance as number).toFixed(2) + ' km' }))
      });
    }

    res.json({ message: 'Prescription saved, waiting for centers.', prescriptionId: prescription.id });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    res.status(500).json({ error: 'Failed to process prescription' });
  }
});

// --- Diagnostic Center Routes ---

 app.post('/centers/register', upload.fields([
  { name: 'isoCertificate', maxCount: 1 },
  { name: 'nablCertificate', maxCount: 1 }
]), async (req: Request, res: Response) => {
  console.log("REGISTRATION BODY:", req.body);
  console.log("REGISTRATION FILES:", req.files);
  
  const { 
    name, ownerName, email, password, latitude, longitude, 
    phoneNumber, address, googleMapUrl,
    isoNumber, nablNumber, gstNumber, tradeLicense,
    providesEmergency
  } = req.body;
  
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const count = await (prisma as any).diagnosticCenter.count();
    const randomSuffix = Math.floor(Math.random() * 900) + 100; // 3-digit random
    const generatedId = `TTL-${1000 + count + 1}${randomSuffix}`;

    const latVal = parseFloat(latitude as string) || 0;
    const lngVal = parseFloat(longitude as string) || 0;

    const center = await (prisma as any).diagnosticCenter.create({
      data: {
        name,
        generatedId,
        ownerName,
        email,
        password: hashedPassword,
        latitude: latVal,
        longitude: lngVal,
        phoneNumber,
        address,
        googleMapUrl,
        isoNumber,
        nablNumber,
        gstNumber,
        tradeLicense,
        isoCertificate: files['isoCertificate']?.[0]?.filename || null,
        nablCertificate: files['nablCertificate']?.[0]?.filename || null,
        providesEmergency: providesEmergency === 'true' || providesEmergency === true,
        isVerified: false
      },
    });
    res.json({ message: 'Registration successful. Awaiting admin verification.', generatedId: center.generatedId });
  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);
    res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

// Center Login
app.post('/centers/login', async (req: Request, res: Response) => {
  const { generatedId, password } = req.body;
  try {
    const center = await (prisma as any).diagnosticCenter.findUnique({ where: { generatedId } });
    if (!center) return res.status(400).json({ error: 'Invalid ID' });

    const validPassword = await bcrypt.compare(password, center.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ centerId: center.id, role: 'center' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, center: { id: center.id, name: center.name, generatedId: center.generatedId, isVerified: center.isVerified } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get single center profile
app.get('/centers/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const center = await (prisma as any).diagnosticCenter.findUnique({
      where: { id: parseInt(id as string) },
      include: { services: true }
    });
    if (!center) return res.status(404).json({ error: 'Center not found' });
    res.json(center);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch center profile' });
  }
});

// Admin: Verify a Center
app.patch('/centers/:id/verify', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const center = await (prisma as any).diagnosticCenter.update({
      where: { id: parseInt(id as string) },
      data: { isVerified: true },
    });
    res.json({ message: 'Center verified successfully', center });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Services Management
app.get('/centers/:id/services', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const services = await (prisma as any).service.findMany({ where: { centerId: parseInt(id as string) } });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.post('/centers/:id/services', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  try {
    const service = await (prisma as any).service.create({
      data: {
        name,
        price: parseFloat(price as string),
        centerId: parseInt(id as string),
      },
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add service' });
  }
});

// API for fetching centers (Filtered by verification for patients)
// Admin: Fetch all registered users
app.get('/admin/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, createdAt: true }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Admin: Platform Statistics
app.get('/admin/stats', async (req: Request, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const centerCount = await (prisma as any).diagnosticCenter.count();
    const verifiedCount = await (prisma as any).diagnosticCenter.count({ where: { isVerified: true } });
    res.json({
      totalUsers: userCount,
      totalCenters: centerCount,
      totalVerified: verifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

app.get('/centers', async (req: Request, res: Response) => {
  const { all } = req.query; // Admin can pass ?all=true to see unverified
  try {
    const centers = await (prisma as any).diagnosticCenter.findMany({
      where: all === 'true' ? {} : { isVerified: true },
      include: { services: true }
    });
    res.json({ centers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch centers' });
  }
});

// --- Patient Request Queue Routes ---

// Get requests for a specific center (Nearby + Assigned)
app.get('/centers/:id/requests', async (req: Request, res: Response) => {
  const centerId = parseInt(req.params.id as string);
  
  try {
    const center = await (prisma as any).diagnosticCenter.findUnique({
      where: { id: centerId }
    });

    if (!center) return res.status(404).json({ error: 'Center not found' });

    // Find prescriptions that are:
    // 1. Assigned to this center
    // 2. OR unassigned but nearby (within 10km)
    const allPrescriptions = await (prisma as any).prescription.findMany({
      where: {
        OR: [
          { centerId: centerId },
          { centerId: null, status: 'pending' }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });

    // Helper to calculate distance
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const filtered = allPrescriptions.filter((p: any) => {
      if (p.centerId === centerId) return true;
      const dist = getDistance(center.latitude, center.longitude, p.latitude, p.longitude);
      return dist <= 20; // 20km radius for diagnostic centers
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

// Accept a patient request
app.post('/requests/:id/accept', async (req: Request, res: Response) => {
  const requestId = parseInt(req.params.id as string);
  const { centerId } = req.body;

  try {
    const updated = await (prisma as any).prescription.update({
      where: { id: requestId },
      data: {
        centerId: parseInt(centerId as string),
        status: 'accepted'
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Update request status
app.patch('/requests/:id/status', async (req: Request, res: Response) => {
  const requestId = parseInt(req.params.id as string);
  const { status } = req.body;

  try {
    const updated = await (prisma as any).prescription.update({
      where: { id: requestId },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Upload digital report for a completed request
app.post('/requests/:id/upload-report', upload.single('report'), async (req: Request, res: Response) => {
  const requestId = parseInt(req.params.id as string);
  
  if (!req.file) return res.status(400).json({ error: 'No report file provided' });

  try {
    const updated = await (prisma as any).prescription.update({
      where: { id: requestId },
      data: {
        reportUrl: `/uploads/${req.file.filename}`,
        status: 'completed'
      }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload report' });
  }
});

app.listen(PORT, () => {
  console.log(`TrueTestLabs Backend running on http://localhost:${PORT}`);
});
