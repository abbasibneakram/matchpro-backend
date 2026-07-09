"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
const DEMO_EMAIL = 'demo@matchpro.test';
const DEMO_PASSWORD = 'password123';
// A mix of male/female profiles across a few cities, sects, and castes with
// overlapping preferences — enough variety that the matching engine actually
// has something interesting to rank, rather than one obvious pair.
const profiles = [
    // — Male —
    { gender: 'MALE', name: 'Hamza Raza', age: 29, education: 'BSc Computer Science', profession: 'Software Engineer', city: 'Lahore', religion: 'Islam', sect: 'Sunni', caste: 'Rajput', familyDetails: 'Father is a businessman, one younger sister.', prefAgeMin: 24, prefAgeMax: 29, prefCity: 'Lahore', prefReligion: 'Islam', prefSect: 'Sunni', feeAgreed: 30000, amountPaid: 15000, status: 'ACTIVE' },
    { gender: 'MALE', name: 'Ahmed Iqbal', age: 32, education: 'MBBS', profession: 'Doctor', city: 'Karachi', religion: 'Islam', sect: 'Sunni', caste: 'Sheikh', familyDetails: 'Settled family, father a retired army officer.', prefAgeMin: 25, prefAgeMax: 30, prefCity: 'Karachi', prefEducation: 'Masters', feeAgreed: 50000, amountPaid: 50000, status: 'ACTIVE' },
    { gender: 'MALE', name: 'Bilal Ahmed', age: 27, education: 'BBA', profession: 'Marketing Manager', city: 'Islamabad', religion: 'Islam', sect: 'Shia', caste: 'Syed', familyDetails: 'Only son, close-knit family.', prefAgeMin: 22, prefAgeMax: 27, prefReligion: 'Islam', prefSect: 'Shia', feeAgreed: 25000, amountPaid: 0, status: 'PENDING_REVIEW' },
    { gender: 'MALE', name: 'Usman Tariq', age: 31, education: 'CA', profession: 'Chartered Accountant', city: 'Lahore', religion: 'Islam', sect: 'Sunni', caste: 'Arain', familyDetails: 'Family owns a textile business.', prefAgeMin: 24, prefAgeMax: 29, prefCity: 'Lahore', feeAgreed: 40000, amountPaid: 20000, status: 'ACTIVE' },
    { gender: 'MALE', name: 'Fahad Malik', age: 26, education: 'BS Electrical Engineering', profession: 'Engineer at WAPDA', city: 'Faisalabad', religion: 'Islam', sect: 'Sunni', caste: 'Malik', familyDetails: 'Joint family system, two brothers.', prefAgeMin: 22, prefAgeMax: 26, feeAgreed: 20000, amountPaid: 5000, status: 'INACTIVE' },
    // — Female —
    { gender: 'FEMALE', name: 'Aisha Khan', age: 27, education: 'MBA', profession: 'Bank Manager', city: 'Lahore', religion: 'Islam', sect: 'Sunni', caste: 'Rajput', familyDetails: 'Youngest of three, father is a doctor.', prefAgeMin: 27, prefAgeMax: 33, prefCity: 'Lahore', prefReligion: 'Islam', prefSect: 'Sunni', feeAgreed: 30000, amountPaid: 30000, status: 'ACTIVE' },
    { gender: 'FEMALE', name: 'Sana Malik', age: 25, education: 'MBBS', profession: 'Doctor', city: 'Karachi', religion: 'Islam', sect: 'Sunni', caste: 'Sheikh', familyDetails: 'Well-educated family, one elder brother abroad.', prefAgeMin: 28, prefAgeMax: 34, prefCity: 'Karachi', prefEducation: 'Masters', feeAgreed: 50000, amountPaid: 25000, status: 'ACTIVE' },
    { gender: 'FEMALE', name: 'Zainab Hussain', age: 24, education: 'BS Psychology', profession: 'Teacher', city: 'Islamabad', religion: 'Islam', sect: 'Shia', caste: 'Syed', familyDetails: 'Religious family, values tradition.', prefAgeMin: 26, prefAgeMax: 32, prefReligion: 'Islam', prefSect: 'Shia', feeAgreed: 25000, amountPaid: 10000, status: 'ACTIVE' },
    { gender: 'FEMALE', name: 'Mahnoor Sheikh', age: 29, education: 'CA', profession: 'Auditor', city: 'Lahore', religion: 'Islam', sect: 'Sunni', caste: 'Arain', familyDetails: 'Elder daughter, family runs a business.', prefAgeMin: 29, prefAgeMax: 35, prefCity: 'Lahore', feeAgreed: 40000, amountPaid: 40000, status: 'ACTIVE' },
    { gender: 'FEMALE', name: 'Hira Yousaf', age: 23, education: 'BSc Nursing', profession: 'Nurse', city: 'Faisalabad', religion: 'Islam', sect: 'Sunni', caste: 'Malik', familyDetails: 'Middle child, family based in Faisalabad.', prefAgeMin: 25, prefAgeMax: 30, feeAgreed: 20000, amountPaid: 20000, status: 'PENDING_REVIEW' },
];
async function main() {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
    const matchmaker = await prisma.matchmaker.upsert({
        where: { email: DEMO_EMAIL },
        update: {},
        create: { name: 'Demo Matchmaker', email: DEMO_EMAIL, passwordHash },
    });
    // Idempotent: clear this demo account's profiles before reseeding, so
    // running this repeatedly doesn't pile up duplicates.
    await prisma.profile.deleteMany({ where: { matchmakerId: matchmaker.id } });
    for (const p of profiles) {
        await prisma.profile.create({ data: { ...p, matchmakerId: matchmaker.id } });
    }
    console.log(`\nSeeded ${profiles.length} profiles.`);
    console.log(`Log in with:\n  email:    ${DEMO_EMAIL}\n  password: ${DEMO_PASSWORD}\n`);
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
