"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

// Unsplash premium interior design image assets
const images = {
  hero: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1920&auto=format&fit=crop",
  about: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop",
  before: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop", // empty/simple room
  after: "https://images.unsplash.com/photo-1616486038856-3f62e3d3683f?q=80&w=800&auto=format&fit=crop", // beautifully designed room
  projects: [
    { id: 1, title: "Grand Living Room", type: "Residential", loc: "Jubilee Hills", area: "4,500 sqft", year: 2025, img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Modern Corporate Office", type: "Office", loc: "Gachibowli", area: "12,000 sqft", year: 2025, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Luxury Penthouse", type: "Luxury Apartment", loc: "Banjara Hills", area: "3,800 sqft", year: 2026, img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Bespoke Royal Villa", type: "Villa", loc: "Financial District", area: "7,500 sqft", year: 2024, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Golden Boutique Lounge", type: "Retail", loc: "Begumpet", area: "2,200 sqft", year: 2025, img: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=800&auto=format&fit=crop" },
    { id: 6, title: "Minimalist Dining Suite", type: "Hospitality", loc: "Madhapur", area: "1,800 sqft", year: 2026, img: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=800&auto=format&fit=crop" },
  ],
  testimonials: [
    { name: "Phanindra Reddy", loc: "Jubilee Hills", role: "Villa Owner", review: "The turnkey execution by PROMACON was seamless. They turned our raw structure into a breathtaking, luxurious villa. Their custom furniture design is world-class.", rating: 5, img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop" },
    { name: "Ananya Rao", loc: "Banjara Hills", role: "Penthouse Owner", review: "We are impressed with their transparent pricing and timely delivery. The modular kitchen and smart lighting layouts created by the team make our home look magical.", rating: 5, img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" },
    { name: "Kiran Kumar", loc: "Gachibowli", role: "Corporate Manager", review: "Our office interior design perfectly reflects our corporate brand identity. Excellent space planning, modern ergonomics, and zero timeline delays.", rating: 5, img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop" },
  ],
  team: [
    { name: "E. Phanindra", role: "Founder & Principal Architect", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" },
    { name: "G. Naresh", role: "Co-Founder & Technical Director", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop" },
    { name: "Priya Sharma", role: "Senior Interior Designer", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop" },
    { name: "Rohit Verma", role: "Project Manager", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop" },
  ]
};

const faqs = [
  { q: "What services do you offer?", a: "We provide comprehensive interior design, architectural planning, space planning, turnkey execution, false ceilings, custom wardrobes, modular kitchens, luxury 3D rendering, and lighting designs." },
  { q: "What is your main design style?", a: "Our signature style is Modern Minimal Luxury. We create clean, sophisticated, functional, and timeless spaces tailored to each client's tastes." },
  { q: "How long does a typical interior design project take?", a: "A standard residential project takes 45 to 60 days, whereas larger villas and commercial complexes take between 90 to 120 days depending on complexity." },
  { q: "Do you charge for the initial consultation?", a: "No, our initial design and site assessment consultation is completely free." },
  { q: "What is the difference between turnkey solutions and design-only services?", a: "Design-only provides blueprints and 3D mockups. Turnkey solutions include design, material procurement, on-site labor management, execution, quality control, and the final keys handover." },
  { q: "Do you offer a warranty on your materials?", a: "Yes, we provide up to a 10-year warranty on modular kitchens, wardrobe fittings, and selected premium materials." },
  { q: "How do you estimate the budget of a project?", a: "Budget estimation depends on square footage, design requirements, and material selection. We offer completely transparent, line-item pricing so you know exactly where every rupee goes." },
  { q: "Can we make changes to the design after work begins?", a: "Minor modifications are accommodated. Major revisions after material procurement are discussed alongside budget adjustments before execution." },
  { q: "Can you incorporate existing furniture into new designs?", a: "Absolutely! We love blending classic, sentimental pieces of furniture into our modern interior layouts." },
  { q: "Do you handle local municipal building approvals?", a: "Yes, our team of legal engineers handles planning approvals and paperwork for contracting and construction." },
  { q: "How do you ensure quality control during construction?", a: "We have dedicated site engineers and quality check managers performing multi-stage inspections at every stage of execution." },
  { q: "What areas do you serve?", a: "We primarily execute luxury interior projects across Hyderabad and neighboring regions." },
  { q: "Do you provide 3D visualizations before execution?", a: "Yes, we provide photo-realistic 3D visualizations and walkthroughs so you can inspect your space before a single brick is laid." },
  { q: "Who will be my point of contact during the project?", a: "A dedicated Project Manager will be assigned to you. They will send you daily progress reports and coordinate all design updates." },
  { q: "How do we make payments?", a: "Payments are broken down into logical milestones (e.g. Booking, 3D Approval, Material Delivery, Mid-Execution, Handover)." },
  { q: "What premium materials do you use?", a: "We partner with top global brands for plywood, fittings, paints, veneer, marble, and custom hardware to ensure durability and high-end finishes." },
  { q: "Do you execute commercial and office interiors?", a: "Yes, we have extensive experience executing corporate offices, tech parks, retail outlets, and luxury gold showrooms." },
  { q: "Do you offer after-sales support?", a: "Yes, we offer dedicated after-sales support with a 48-hour response time for any repair or alignment checks." },
  { q: "What happens during a site visit?", a: "During the site visit, our architect measures dimensions, checks structural pillars, inspects sunlight angles, and assesses water/electrical inlets." },
  { q: "How can I book a consultation?", a: "You can book a consultation by filling out our online form, sending a message on WhatsApp, or calling us directly." },
  { q: "What makes PROMACON unique?", a: "Our combination of high-end design, transparent pricing, dedicated management, on-time delivery, and 10+ years of contracting expertise." }
];

export default function Home() {
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    city: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Interactive component states
  const [activeFilter, setActiveFilter] = useState("all");
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [activeFaq, setActiveFaq] = useState(null);
  const [lightboxImg, setLightboxImg] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [showExitPopup, setShowExitPopup] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor scroll to add glass styling to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Exit Intent Popup trigger
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 50) {
        // Retrieve key from session storage to prevent multiple popups
        const shown = sessionStorage.getItem("exit_popup_shown");
        if (!shown) {
          setShowExitPopup(true);
          sessionStorage.setItem("exit_popup_shown", "true");
        }
      }
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const submissionData = {
        ...formData,
        description: formData.city 
          ? `City: ${formData.city} | Details: ${formData.description}`
          : formData.description
      };

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus({
        type: "success",
        message: "Thank you! Your luxury consultation booking has been received. Our Lead Architect will call you shortly.",
      });

      setFormData({
        client_name: "",
        email: "",
        phone: "",
        project_type: "",
        budget: "",
        city: "",
        description: "",
      });

      // Close modal after 3 seconds on success
      setTimeout(() => {
        setShowConsultModal(false);
        setShowExitPopup(false);
        setStatus({ type: "", message: "" });
      }, 3000);

    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to submit request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = activeFilter === "all"
    ? images.projects
    : images.projects.filter(p => p.type.toLowerCase().includes(activeFilter.toLowerCase()) || p.title.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <>
      <div className="fade-in">
      {/* Top Header / Navigation */}
      <header className={`${styles.header} ${isScrolled ? `${styles.scrolled} glass` : ""}`} style={{ backgroundColor: isScrolled ? "rgba(248, 248, 246, 0.95)" : "transparent" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className={styles.logo}>
            PROMACON <span>Luxury</span>
          </div>
          <nav className={styles.navLinks}>
            <a href="#home" className={styles.navLink}>Home</a>
            <a href="#about" className={styles.navLink}>About</a>
            <a href="#services" className={styles.navLink}>Services</a>
            <a href="#portfolio" className={styles.navLink}>Portfolio</a>
            <a href="#process" className={styles.navLink}>Process</a>
            <a href="#testimonials" className={styles.navLink}>Reviews</a>
            <a href="#faq" className={styles.navLink}>FAQ</a>
            <a href="#contact" className={styles.navLink}>Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${images.hero})` }}></div>
        <div className={styles.heroOverlay}></div>
        <div className="container" style={{ position: "relative", zIndex: 10 }}>
          <div className={styles.heroContent}>
            <span className={styles.heroSubtitle}>Bespoke Luxury Interiors & Architecture</span>
            <h2 className={styles.heroTitle}>
              Designing Elegant Spaces <span>That Inspire Everyday Living.</span>
            </h2>
            <p className={styles.heroDescription}>
              Transform your home, office, villa, apartment, or commercial space with bespoke interior design solutions crafted for luxury and functionality.
            </p>
            <div className={styles.heroCTA}>
              <button onClick={() => setShowConsultModal(true)} className={styles.btnPrimary}>
                Book Free Consultation
              </button>
              <a href="#portfolio" className={styles.btnSecondary}>
                View Portfolio
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.tag}>About Us</span>
              <h3>Crafting Timeless Architecture and Bespoke Luxury Interior Spaces</h3>
              <p>
                PROMACON is a premier luxury design and interior contracting firm. For over a decade, we have been translating high-aesthetic design concepts into masterfully constructed realities. 
              </p>
              <p>
                Our principal designers, engineers, and master craftsmen work in complete alignment to deliver turnkey infrastructure projects—from custom luxury villas and modular residences to premium corporate workspaces.
              </p>
              
              <div className={styles.aboutStatsGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>200+</span>
                  <span className={styles.statLabel}>Completed Projects</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>15+</span>
                  <span className={styles.statLabel}>Design Experts</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>98%</span>
                  <span className={styles.statLabel}>Happy Clients</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNum}>10+</span>
                  <span className={styles.statLabel}>Years Experience</span>
                </div>
              </div>
            </div>

            <div className={styles.aboutImgWrapper} style={{ backgroundImage: `url(${images.about})` }}>
              <div className={styles.aboutImgOverlay}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.tag} ${styles.tagGold}`}>Our Expertise</span>
            <h3 className={styles.title}>Bespoke Interior & Architectural Solutions</h3>
            <p>From design visualization to turnkey execution, we provide premium craftsmanship tailored to your space requirements.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.servicesGrid}>
            {[
              { title: "Residential Interior Design", desc: "Crafting beautiful living rooms, dining zones, and cozy spaces customized to your aesthetic." },
              { title: "Luxury Villa Interiors", desc: "Grand conceptual blueprints, premium custom panels, high-end marble details, and majestic lightscapes." },
              { title: "Apartment Interiors", desc: "Maximizing space utilization, smart wardrobes, modular layouts, and elegant interior styles." },
              { title: "Office & Corporate Interiors", desc: "Ergonomic open offices, executive boardrooms, soundproof meeting booths, and branding integration." },
              { title: "Commercial & Retail Showrooms", desc: "Strategic luxury layouts customized for jewelry boutiques, gold showrooms, and premium retail experiences." },
              { title: "Turnkey Interior Solutions", desc: "End-to-end contracting, civil works, lighting, false ceilings, furniture manufacturing, and final handover." },
              { title: "Modular Kitchens & Wardrobes", desc: "Italian styling cabinets, anti-scratch soft-close drawers, hydraulic lifts, and spacious organizers." },
              { title: "Space Planning & 3D Visualization", desc: "Detailed 2D space allocation paired with photorealistic 3D rendering and VR walkthrough models." },
              { title: "False Ceiling & Lighting Design", desc: "Custom gypsum panels, warm cove LED channels, spotlight allocation, and smart home lighting integrations." },
            ].map((service, idx) => (
              <div key={service.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>0{idx + 1}</div>
                <h4>{service.title}</h4>
                <p>{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Completed Works</span>
            <h3 className={styles.title}>Our Premium Design Portfolio</h3>
            <p>Explore our masonry grid of architectural masterpieces and custom interior designs.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.portfolioFilters}>
            {["all", "residential", "office", "villa", "apartment", "retail"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`${styles.filterBtn} ${activeFilter === category ? styles.filterBtnActive : ""}`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className={styles.portfolioGrid}>
            {filteredProjects.map((project) => (
              <div key={project.id} className={styles.projectCard} onClick={() => setLightboxImg(project)}>
                <div className={styles.projectImg} style={{ backgroundImage: `url(${project.img})` }}></div>
                <div className={styles.projectOverlay}>
                  <h4>{project.title}</h4>
                  <p>{project.type}</p>
                  <div className={styles.projectMeta}>
                    <span>{project.loc}</span>
                    <span>{project.area}</span>
                    <span>{project.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.tag} ${styles.tagGold}`}>Why PROMACON</span>
            <h3 className={styles.title}>Uncompromising Quality. Absolute Transparency.</h3>
            <p>Our commitment to design excellence and professional contracting sets us apart from local executioners.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.whyGrid}>
            {[
              { title: "Creative Designs", desc: "Bespoke concepts tailored specifically to your personality and space utility needs." },
              { title: "On-Time Delivery", desc: "Strict milestones management ensuring a penalty-backed timely project delivery." },
              { title: "Transparent Pricing", desc: "Line-item transparent quotes with zero hidden charges or last-minute additions." },
              { title: "Premium Materials", desc: "We source certified water-proof plywood, premium paints, and architectural hardware." },
              { title: "Experienced Team", desc: "A team of licensed architects, structural design engineers, and site managers." },
              { title: "After Sales Support", desc: "Dedicated support team offering regular checks and modular warranty assistance." },
            ].map((why, idx) => (
              <div key={why.title} className={styles.whyCard}>
                <div className={styles.whyIcon}>0{idx + 1}</div>
                <h4>{why.title}</h4>
                <p>{why.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Design Process */}
      <section id="process" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Our Process</span>
            <h3 className={styles.title}>Eight Steps to Your Dream Space</h3>
            <p>A systematic, transparent project flow from primary discussions to final keys handover.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.processTimeline}>
            {[
              { step: 1, title: "Free Consultation", desc: "Book an online or offline discussion with our design leads to conceptualize design requirements." },
              { step: 2, title: "Site Visit & Measurement", desc: "Our execution engineer visits the site for accurate measurements, light assessments, and layout planning." },
              { step: 3, title: "Concept Layout & Budgeting", desc: "We create 2D floor plans, suggest layouts, and present a transparent, itemized preliminary quote." },
              { step: 4, title: "3D Visualizations", desc: "You receive realistic 3D designs of modular units, false ceilings, furniture allocations, and color themes." },
              { step: 5, title: "Material Selection", desc: "Visit our curated materials gallery or select premium veneers, laminates, marbles, and fabrics with our designer." },
              { step: 6, title: "Factory & Site Execution", desc: "Modular kitchens and wardrobes are precision-manufactured in our factory, while civil works begin at site." },
              { step: 7, title: "Multi-Stage Quality Check", desc: "A dedicated QC inspector inspects structural joints, drawer slides, paint finishes, and wiring configurations." },
              { step: 8, title: "Handover & Warranty", desc: "Final cleanup, styling validation, and handover of your space keys along with the warranty book." },
            ].map((proc) => (
              <div key={proc.step} className={styles.processStep}>
                <div className={styles.processNode}>{proc.step}</div>
                <div className={styles.processContent}>
                  <h4>{proc.title}</h4>
                  <p>{proc.desc}</p>
                </div>
                <div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Interactive Slider */}
      <section className={`${styles.section} ${styles.sectionDark}`} style={{ backgroundColor: "#151515" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.tag} ${styles.tagGold}`}>Transformation</span>
            <h3 className={styles.title}>Before & After Design Comparison</h3>
            <p>Drag the slider below to see how our custom interior design transforms raw spaces into luxury living rooms.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.sliderContainer}>
            {/* Before image (always visible below) */}
            <div className={`${styles.sliderImg} ${styles.beforeImg}`} style={{ backgroundImage: `url(${images.before})` }}>
              <div className={`${styles.sliderLabel} ${styles.beforeLabel}`}>Before</div>
            </div>
            
            {/* After image (clipped by slider position) */}
            <div 
              className={`${styles.sliderImg} ${styles.afterImg}`} 
              style={{ 
                backgroundImage: `url(${images.after})`,
                clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)` 
              }}
            >
              <div className={`${styles.sliderLabel} ${styles.afterLabel}`}>After</div>
            </div>

            {/* Slider handles */}
            <div className={styles.sliderHandle} style={{ left: `${sliderPosition}%` }}>
              <div className={styles.sliderBtn}>&larr; &rarr;</div>
            </div>

            {/* Range input overlay */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPosition} 
              onChange={(e) => setSliderPosition(e.target.value)}
              className={styles.sliderRange} 
            />
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section id="testimonials" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Testimonials</span>
            <h3 className={styles.title}>What Our Prestigious Clients Say</h3>
            <p>Read honest reviews from homeowners and corporate clients who chose our turnkey contracting.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.testimonialContainer}>
            <div className={styles.testimonialRating}>
              {"★".repeat(images.testimonials[activeTestimonial].rating)}
              {"☆".repeat(5 - images.testimonials[activeTestimonial].rating)}
            </div>
            <p className={styles.testimonialText}>
              &ldquo;{images.testimonials[activeTestimonial].review}&rdquo;
            </p>
            <div className={styles.testimonialAuthor}>
              <div 
                className={styles.authorImg} 
                style={{ backgroundImage: `url(${images.testimonials[activeTestimonial].img})` }}
              ></div>
              <span className={styles.authorName}>{images.testimonials[activeTestimonial].name}</span>
              <span className={styles.authorLoc}>{images.testimonials[activeTestimonial].role} &bull; {images.testimonials[activeTestimonial].loc}</span>
            </div>

            <div className={styles.carouselNav}>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? images.testimonials.length - 1 : prev - 1))}
                className={styles.carouselArrow}
              >
                &larr;
              </button>
              <button 
                onClick={() => setActiveTestimonial((prev) => (prev === images.testimonials.length - 1 ? 0 : prev + 1))}
                className={styles.carouselArrow}
              >
                &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Team Showcase */}
      <section className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.tag} ${styles.tagGold}`}>Creative Minds</span>
            <h3 className={styles.title}>Our Core Expertise Team</h3>
            <p>Experienced professionals handling design concepts, site engineering, and project timelines.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.teamGrid}>
            {images.team.map((member) => (
              <div key={member.name} className={styles.teamCard}>
                <div className={styles.teamImg} style={{ backgroundImage: `url(${member.img})` }}></div>
                <div className={styles.teamInfo}>
                  <h4 className={styles.teamName}>{member.name}</h4>
                  <span className={styles.teamRole}>{member.role}</span>
                  <div className={styles.teamSocials}>
                    <a href="#" className={styles.teamSocialLink}>LinkedIn</a>
                    <a href="#" className={styles.teamSocialLink}>Instagram</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Blog & Ideas</span>
            <h3 className={styles.title}>Latest Trends & Design Inspirations</h3>
            <p>Expert tips on space utilization, color palettes, and luxury modular designs.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.blogGrid}>
            {[
              { tag: "Interior Trends", title: "Modern Minimalist Luxury: Less is More in 2026", img: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&auto=format&fit=crop" },
              { tag: "Color Psychology", title: "How Deep Olive Green & Gold Accents Influence Mood", img: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=400&auto=format&fit=crop" },
              { tag: "Space Saving", title: "Smart Multi-Functional Wardrobes & Hideaway Desks", img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop" },
            ].map((post) => (
              <div key={post.title} className={styles.blogCard}>
                <div className={styles.blogCardImg} style={{ backgroundImage: `url(${post.img})` }}></div>
                <div className={styles.blogCardContent}>
                  <span className={styles.blogCardTag}>{post.tag}</span>
                  <h4 className={styles.blogCardTitle}>{post.title}</h4>
                  <a href="#" className={styles.blogCardLink}>Read Article &rarr;</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordions (21 FAQ items) */}
      <section id="faq" className={`${styles.section} ${styles.sectionDark}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={`${styles.tag} ${styles.tagGold}`}>Got Questions?</span>
            <h3 className={styles.title}>Frequently Asked Questions</h3>
            <p>Explore answers to common questions about budget ranges, modular wardrobes, and turnkey delivery.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.faqContainer}>
            {faqs.map((faq, idx) => (
              <div key={idx} className={styles.faqItem}>
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className={styles.faqHeader}
                >
                  <span className={styles.faqQuestion}>{faq.q}</span>
                  <span className={styles.faqIcon}>{activeFaq === idx ? "−" : "+"}</span>
                </button>
                {activeFaq === idx && (
                  <div className={styles.faqAnswer}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section & Lead Generation Form */}
      <section id="contact" className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Contact Us</span>
            <h3 className={styles.title}>Start Your Luxury Transformation</h3>
            <p>Schedule a face-to-face meet with our lead interior architects. Tell us about your design requirements below.</p>
            <div className={styles.titleDivider}></div>
          </div>

          <div className={styles.contactGrid}>
            {/* Form card */}
            <div className={styles.inquiryForm}>
              {status.message && (
                <div className={status.type === "success" ? styles.formSuccess : styles.formError}>
                  {status.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Your Name</label>
                    <input 
                      type="text" 
                      name="client_name" 
                      value={formData.client_name}
                      onChange={handleInputChange}
                      placeholder="Enter full name" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Project Type</label>
                    <select 
                      name="project_type"
                      value={formData.project_type}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="" disabled>Select project type</option>
                      <option value="Residential Construction">Residential Construction</option>
                      <option value="Luxury Home Interior">Luxury Home Interior</option>
                      <option value="Commercial Office Space">Commercial Office Space</option>
                      <option value="Retail / Gold Showroom">Retail / Gold Showroom</option>
                      <option value="Factory / Industrial">Factory / Industrial</option>
                      <option value="Renovation & Fit-out">Renovation & Fit-out</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Est. Budget Range</label>
                    <select 
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className={styles.select}
                      required
                    >
                      <option value="" disabled>Select approximate budget</option>
                      <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                      <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                      <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                      <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                      <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Your City</label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Enter city name" 
                      className={styles.input} 
                      required 
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Requirements</label>
                  <textarea 
                    name="description" 
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Tell us about room details, layout requests, veneer preferences, etc." 
                    className={styles.textarea}
                  />
                </div>

                <button type="submit" className={`${styles.btnPrimary} ${styles.submitBtn}`} disabled={loading}>
                  {loading ? "Booking Consultation..." : "Submit Quote Request"}
                </button>
              </form>
            </div>

            {/* Info card & map */}
            <div>
              <div className={styles.contactInfoCard}>
                <h4>Corporate Office</h4>
                <div className={styles.contactDetail}>
                  <label>Visit Us</label>
                  <p>PROMACON Buildtech LLP,<br />High-tech Architecture Hub,<br />Jubilee Hills, Road No. 36,<br />Hyderabad, Telangana 500033</p>
                </div>
                <div className={styles.contactDetail}>
                  <label>Email Channels</label>
                  <p>promaconbuildtech@gmail.com<br />promaconinteriors@gmail.com</p>
                </div>
                <div className={styles.contactDetail}>
                  <label>Direct Call</label>
                  <p>+91 9679307000 / +91 9052343767</p>
                </div>
              </div>

              <div className={styles.mapWrapper}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.827222569502!2d78.40455857502444!3d17.420060983472856!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb90d4f26b528b%3A0xe54d5b278ad0350a!2sJubilee%20Hills%20Road%2036!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerInfo}>
              <h3>PROMACON</h3>
              <p>Crafting timeless architecture and bespoke luxury interior spaces. Registered contracting company executing residential villas and retail outlets since 2012.</p>
              <div style={{ fontSize: "0.85rem", color: "var(--gold)" }}>
                © 2026 All Rights Reserved.
              </div>
            </div>

            <div className={styles.footerLinks}>
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#services">Our Services</a></li>
                <li><a href="#portfolio">Our Portfolio</a></li>
                <li><a href="#process">Our Design Process</a></li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h4>Our Portfolios</h4>
              <ul>
                <li><a href="#portfolio" onClick={() => setActiveFilter("villa")}>Luxury Villas</a></li>
                <li><a href="#portfolio" onClick={() => setActiveFilter("residential")}>Modern Living Rooms</a></li>
                <li><a href="#portfolio" onClick={() => setActiveFilter("office")}>Corporate Fit-outs</a></li>
                <li><a href="#portfolio" onClick={() => setActiveFilter("retail")}>Gold Showrooms</a></li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h4>Contact & Timing</h4>
              <p style={{ color: "#ccc", fontSize: "0.85rem" }}>
                <strong>Inquiries:</strong> +91 9679307000 / +91 9052343767<br />
                <strong>Mon - Sat:</strong> 9:00 AM - 7:00 PM<br />
                Sunday: Closed
              </p>
              <Link href="/admin/login" style={{ color: "var(--gold-light)", display: "inline-block", marginTop: "1rem", fontSize: "0.85rem" }}>
                Employee Portal &rarr;
              </Link>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <p>PROMACON Buildtech LLP</p>
            <p>Designed & Developed by <a href="https://www.aratha.in" target="_blank" rel="noopener noreferrer">Aratha</a></p>
          </div>
        </div>
      </footer>

      {/* Image Lightbox Modal */}
      {lightboxImg && (
        <div className={styles.lightboxOverlay} onClick={() => setLightboxImg(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightboxImg(null)}>&times;</button>
            <img src={lightboxImg.img} alt={lightboxImg.title} className={styles.lightboxImg} />
            <div className={styles.lightboxMeta}>
              <h4>{lightboxImg.title}</h4>
              <p>{lightboxImg.type} &bull; {lightboxImg.loc} &bull; {lightboxImg.area} &bull; {lightboxImg.year}</p>
            </div>
          </div>
        </div>
      )}

      {/* Book Consultation Modal Popup */}
      {showConsultModal && (
        <div className={styles.modalOverlay} onClick={() => setShowConsultModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowConsultModal(false)}>&times;</button>
            <div className={styles.modalHeader}>
              <h3>Book Your Design Consultation</h3>
              <p>Receive a custom layout concept & transparent quote.</p>
            </div>

            {status.message && (
              <div className={status.type === "success" ? styles.formSuccess : styles.formError}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Your Name</label>
                <input 
                  type="text" 
                  name="client_name" 
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="Full Name" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Project Type</label>
                <select 
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleInputChange}
                  className={styles.select}
                  required
                >
                  <option value="" disabled>Select category</option>
                  <option value="Residential Construction">Residential Construction</option>
                  <option value="Luxury Home Interior">Luxury Home Interior</option>
                  <option value="Commercial Office Space">Commercial Office Space</option>
                  <option value="Retail / Gold Showroom">Retail / Gold Showroom</option>
                </select>
              </div>
              <button type="submit" className={`${styles.btnPrimary} ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Sending details..." : "Book Consultation Now"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Exit Intent Modal Popup */}
      {showExitPopup && (
        <div className={styles.modalOverlay} onClick={() => setShowExitPopup(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalCloseBtn} onClick={() => setShowExitPopup(false)}>&times;</button>
            <div className={styles.modalHeader}>
              <h3>Wait! Don't Miss Out</h3>
              <p>Get a free preliminary floor plan & materials design guide downloaded directly to your email.</p>
            </div>

            {status.message && (
              <div className={status.type === "success" ? styles.formSuccess : styles.formError}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  name="client_name" 
                  value={formData.client_name}
                  onChange={handleInputChange}
                  placeholder="Your Name" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your Email" 
                  className={styles.input} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Your Phone Number" 
                  className={styles.input} 
                  required 
                />
              </div>
              <button type="submit" className={`${styles.btnPrimary} ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Claiming Offer..." : "Get Free Guide & Concept Plan"}
              </button>
            </form>
          </div>
        </div>
      )}

      </div>

      {/* Floating Action Buttons */}
      <a 
        href="https://wa.me/919679307000?text=Hi%20PROMACON%2C%20I&#39;d%20like%20to%20book%20a%20luxury%20interior%20consultation." 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.whatsappFloat}
        aria-label="Contact on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="30" height="30" fill="currentColor" style={{ verticalAlign: "middle" }}>
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
      </a>
      
      <a href="tel:+919679307000" className={styles.mobileCallBtn}>
        📞 Call Our Architect Now
      </a>
    </>
  );
}
