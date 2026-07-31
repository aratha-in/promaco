import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
};

let pool = null;

async function getPool() {
  if (pool) return pool;

  try {
    // 1. Establish basic connection to check / create the database
    const tempConnection = await mysql.createConnection(dbConfig);
    await tempConnection.query('CREATE DATABASE IF NOT EXISTS `promacon_next_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    await tempConnection.end();

    // 2. Establish connection pool with the created database
    pool = mysql.createPool({
      ...dbConfig,
      database: 'promacon_next_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 3. Initialize schema
    await initTables();

    return pool;
  } catch (error) {
    console.error('Database connection / initialization failed:', error);
    throw error;
  }
}

async function initTables() {
  const conn = await pool.getConnection();
  try {
    // Create users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create inquiries table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        project_type VARCHAR(100) NOT NULL,
        budget VARCHAR(100) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'Lead',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    // Create projects table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        loc VARCHAR(100) NOT NULL,
        area VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        img VARCHAR(500) NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Create testimonials table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        loc VARCHAR(100) NOT NULL,
        role VARCHAR(100) NOT NULL,
        review TEXT NOT NULL,
        rating INT NOT NULL,
        img VARCHAR(500) NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Create FAQs table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        q TEXT NOT NULL,
        a TEXT NOT NULL
      ) ENGINE=InnoDB;
    `);

    // Seed default admin account if not exists
    const [adminUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['admin']);
    if (adminUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);
      console.log('Seeded default admin user: admin / admin123');
    }

    // Seed default customer account if not exists
    const [customerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['customer']);
    if (customerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('customer123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['customer', hashedPassword]);
      console.log('Seeded default customer user: customer / customer123');
    }

    // Seed default designer account if not exists
    const [designerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['designer']);
    if (designerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('designer123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['designer', hashedPassword]);
      console.log('Seeded default designer user: designer / designer123');
    }

    // Seed default manager account if not exists
    const [managerUsers] = await conn.query('SELECT * FROM users WHERE username = ?', ['manager']);
    if (managerUsers.length === 0) {
      const hashedPassword = bcrypt.hashSync('manager123', 10);
      await conn.query('INSERT INTO users (username, password) VALUES (?, ?)', ['manager', hashedPassword]);
      console.log('Seeded default manager user: manager / manager123');
    }

    // Seed projects if empty
    const [existingProjects] = await conn.query('SELECT COUNT(*) as count FROM projects');
    if (existingProjects[0].count === 0) {
      const projectsToSeed = [
        ["Grand Living Room", "Residential", "Jubilee Hills", "4,500 sqft", 2025, "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"],
        ["Modern Corporate Office", "Office", "Gachibowli", "12,000 sqft", 2025, "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop"],
        ["Luxury Penthouse", "Luxury Apartment", "Banjara Hills", "3,800 sqft", 2026, "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop"],
        ["Bespoke Royal Villa", "Villa", "Financial District", "7,500 sqft", 2024, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop"],
        ["Golden Boutique Lounge", "Retail", "Begumpet", "2,200 sqft", 2025, "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop"],
        ["Minimalist Dining Suite", "Hospitality", "Madhapur", "1,800 sqft", 2026, "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop"]
      ];
      for (const p of projectsToSeed) {
        await conn.query('INSERT INTO projects (title, type, loc, area, year, img) VALUES (?, ?, ?, ?, ?, ?)', p);
      }
      console.log('Seeded projects table');
    }

    // Seed testimonials if empty
    const [existingTestimonials] = await conn.query('SELECT COUNT(*) as count FROM testimonials');
    if (existingTestimonials[0].count === 0) {
      const testimonialsToSeed = [
        ["Phanindra Reddy", "Jubilee Hills", "Villa Owner", "The turnkey execution by PROMACON was seamless. They turned our raw structure into a breathtaking, luxurious villa. Their custom furniture design is world-class.", 5, "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop"],
        ["Ananya Rao", "Banjara Hills", "Penthouse Owner", "We are impressed with their transparent pricing and timely delivery. The modular kitchen and smart lighting layouts created by the team make our home look magical.", 5, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop"],
        ["Kiran Kumar", "Gachibowli", "Corporate Manager", "Our office interior design perfectly reflects our corporate brand identity. Excellent space planning, modern ergonomics, and zero timeline delays.", 5, "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop"]
      ];
      for (const t of testimonialsToSeed) {
        await conn.query('INSERT INTO testimonials (name, loc, role, review, rating, img) VALUES (?, ?, ?, ?, ?, ?)', t);
      }
      console.log('Seeded testimonials table');
    }

    // Seed FAQs if empty
    const [existingFaqs] = await conn.query('SELECT COUNT(*) as count FROM faqs');
    if (existingFaqs[0].count === 0) {
      const faqsToSeed = [
        ["What services do you offer?", "We provide comprehensive interior design, architectural planning, space planning, turnkey execution, false ceilings, custom wardrobes, modular kitchens, luxury 3D rendering, and lighting designs."],
        ["What is your main design style?", "Our signature style is Modern Minimal Luxury. We create clean, sophisticated, functional, and timeless spaces tailored to each client's tastes."],
        ["How long does a typical interior design project take?", "A standard residential project takes 45 to 60 days, whereas larger villas and commercial complexes take between 90 to 120 days depending on complexity."],
        ["Do you charge for the initial consultation?", "No, our initial design and site assessment consultation is completely free."],
        ["What is the difference between turnkey solutions and design-only services?", "Design-only provides blueprints and 3D mockups. Turnkey solutions include design, material procurement, on-site labor management, execution, quality control, and the final keys handover."],
        ["Do you offer a warranty on your materials?", "Yes, we provide up to a 10-year warranty on modular kitchens, wardrobe fittings, and selected premium materials."],
        ["How do you estimate the budget of a project?", "Budget estimation depends on square footage, design requirements, and material selection. We offer completely transparent, line-item pricing so you know exactly where every rupee goes."],
        ["Can we make changes to the design after work begins?", "Minor modifications are accommodated. Major revisions after material procurement are discussed alongside budget adjustments before execution."],
        ["Can you incorporate existing furniture into new designs?", "Absolutely! We love blending classic, sentimental pieces of furniture into our modern interior layouts."],
        ["Do you handle local municipal building approvals?", "Yes, our team of legal engineers handles planning approvals and paperwork for contracting and construction."],
        ["How do you ensure quality control during construction?", "We have dedicated site engineers and quality check managers performing multi-stage inspections at every stage of execution."],
        ["What areas do you serve?", "We primarily execute luxury interior projects across Hyderabad and neighboring regions."],
        ["Do you provide 3D visualizations before execution?", "Yes, we provide photo-realistic 3D visualizations and walkthroughs so you can inspect your space before a single brick is laid."],
        ["Who will be my point of contact during the project?", "A dedicated Project Manager will be assigned to you. They will send you daily progress reports and coordinate all design updates."],
        ["How do we make payments?", "Payments are broken down into logical milestones (e.g. Booking, 3D Approval, Material Delivery, Mid-Execution, Handover)."],
        ["What premium materials do you use?", "We partner with top global brands for plywood, fittings, paints, veneer, marble, and custom hardware to ensure durability and high-end finishes."],
        ["Do you execute commercial and office interiors?", "Yes, we have extensive experience executing corporate offices, tech parks, retail outlets, and luxury gold showrooms."],
        ["Do you offer after-sales support?", "Yes, we offer dedicated after-sales support with a 48-hour response time for any repair or alignment checks."],
        ["What happens during a site visit?", "During the site visit, our architect measures dimensions, checks structural pillars, inspects sunlight angles, and assesses water/electrical inlets."],
        ["How can I book a consultation?", "You can book a consultation by filling out our online form, sending a message on WhatsApp, or calling us directly."],
        ["What makes PROMACON unique?", "Our combination of high-end design, transparent pricing, dedicated management, on-time delivery, and 10+ years of contracting expertise."]
      ];
      for (const f of faqsToSeed) {
        await conn.query('INSERT INTO faqs (q, a) VALUES (?, ?)', f);
      }
      console.log('Seeded faqs table');
    }
  } catch (error) {
    console.error('Error initializing tables:', error);
    throw error;
  } finally {
    conn.release();
  }
}

// Global query execution wrapper
export async function query(sql, params) {
  const currentPool = await getPool();
  const [results] = await currentPool.query(sql, params);
  return results;
}
