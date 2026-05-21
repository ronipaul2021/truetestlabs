"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const mockCenters = [
    { name: 'City Diagnostics - North', latitude: 40.7128, longitude: -74.0060, phoneNumber: '+12345678901' },
    { name: 'Apex Labs - Downtown', latitude: 40.7130, longitude: -74.0050, phoneNumber: '+12345678902' },
    { name: 'TrueTest Affiliate - East', latitude: 40.7150, longitude: -74.0010, phoneNumber: '+12345678903' },
    { name: 'HealthyLife Scans', latitude: 40.7110, longitude: -74.0080, phoneNumber: '+12345678904' },
    { name: 'QuickCare Imaging', latitude: 40.7180, longitude: -74.0100, phoneNumber: '+12345678905' },
    { name: 'Far Away Clinic', latitude: 40.7800, longitude: -73.9600, phoneNumber: '+12345678906' },
    { name: 'Suburban Medical Center', latitude: 40.6500, longitude: -73.9500, phoneNumber: '+12345678907' },
];
async function main() {
    console.log('Start seeding...');
    await prisma.diagnosticCenter.deleteMany(); // Clear existing
    for (const center of mockCenters) {
        const created = await prisma.diagnosticCenter.create({
            data: center,
        });
        console.log(`Created center with id: ${created.id}`);
    }
    console.log('Seeding finished.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
