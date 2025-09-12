import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// helper แปลงเป็น Decimal
const D = (n: string | number) => new Prisma.Decimal(n)

/**
 * ถ้าต้องการเคลียร์ข้อมูลเก่าก่อน seed ให้เปิดคอมเมนต์ส่วน clearAll()
 * ระวัง: จะลบทุก prescription/item/medicine
 */
async function clearAll() {
    await prisma.$transaction([
        prisma.prescriptionItem.deleteMany(),
        prisma.prescription.deleteMany(),
        prisma.medicine.deleteMany(),
    ])
}

async function main() {
    // --- เลือกเปิดถ้าต้องการเริ่มจากฐานว่าง ---
    // await clearAll()

    // 1) สร้าง Medicine ตัวอย่าง (ใช้ upsert กันซ้ำ)
    const med1 = await prisma.medicine.upsert({
        where: { medicineCode: 'MED-001' },
        update: {
            nameEN: 'Paracetamol',
            nameTH: 'พาราเซตามอล',
            catagory: 'Painkiller',
            amount: D('100.00'),
            current_price: D('12.50'),
            advice: 'ทานหลังอาหาร',
        },
        create: {
            medicineCode: 'MED-001',
            nameEN: 'Paracetamol',
            nameTH: 'พาราเซตามอล',
            catagory: 'Painkiller',
            amount: D('100.00'),
            current_price: D('12.50'),
            advice: 'ทานหลังอาหาร',
        },
    })

    const med2 = await prisma.medicine.upsert({
        where: { medicineCode: 'MED-002' },
        update: {
            nameEN: 'Amoxicillin',
            nameTH: 'อะม็อกซีซิลลิน',
            catagory: 'Antibiotic',
            amount: D('50.00'),
            current_price: D('25.00'),
        },
        create: {
            medicineCode: 'MED-002',
            nameEN: 'Amoxicillin',
            nameTH: 'อะม็อกซีซิลลิน',
            catagory: 'Antibiotic',
            amount: D('50.00'),
            current_price: D('25.00'),
        },
    })

    // 2) สร้าง Prescription + Items (อ้างอิงด้วย medicineId)
    const prescription = await prisma.prescription.create({
        data: {
            name_patient: 'สมชาย ใจดี',
            name_docter: 'นพ. ธนา',
            date: new Date(), // schema เป็น @db.Date ได้แค่วันที่ DB จะ truncate เวลาให้เอง
            items: {
                create: [
                    {
                        medicineId: med1.id,
                        instruction: 'วันละ 3 ครั้ง หลังอาหาร',
                        amount: D('10.00'),
                        price: D('12.50'),
                    },
                    {
                        medicineId: med2.id,
                        instruction: 'วันละ 2 ครั้ง ก่อนนอน',
                        amount: D('5.00'),
                        price: D('25.00'),
                    },
                ],
            },
        },
        include: { items: { include: { medicine: true } } },
    })

    console.log('Seeded:', { med1: med1.medicineCode, med2: med2.medicineCode, prescription: prescription.id })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
