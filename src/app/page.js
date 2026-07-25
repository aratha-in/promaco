"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("mission");
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStatus({
        type: "success",
        message: "Thank you! Your inquiry has been submitted successfully. Our team will contact you shortly.",
      });

      // Reset form
      setFormData({
        client_name: "",
        email: "",
        phone: "",
        project_type: "",
        budget: "",
        description: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to submit inquiry. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      {/* Top Header / Navigation */}
      <header className={`${styles.header} glass`}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "1.5rem", color: "var(--charcoal)", fontFamily: "var(--font-display)", fontWeight: "700" }}>
              PROMACON <span style={{ color: "var(--gold)", fontWeight: "400" }}>Buildtech</span>
            </h1>
            <p style={{ fontSize: "0.65rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "#888", marginTop: "-3px" }}>
              Interiors & Contracting
            </p>
          </div>
          <nav style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="#about" style={{ fontSize: "0.9rem", fontWeight: "500" }}>About</a>
            <a href="#mission" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Mission & Vision</a>
            <a href="#values" style={{ fontSize: "0.9rem", fontWeight: "500" }}>Values</a>
            <a href="#contact" className={styles.btnPrimary} style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>
              Get Quote
            </a>
            <Link href="/admin/login" style={{ fontSize: "0.9rem", color: "var(--gold-dark)", fontWeight: "600", borderLeft: "1px solid #ddd", paddingLeft: "1.5rem" }}>
              Admin Panel
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div>
            <span className={styles.heroSubtitle}>Building Excellence. Creating Inspiring Spaces.</span>
            <h2 className={styles.heroTitle}>
              Luxury Interior Design <span>& Masterful Construction</span>
            </h2>
            <p className={styles.heroDescription}>
              PROMACON Buildtech is a professionally managed construction and interior contracting company. We bring elegance, quality execution, and end-to-end building services to life.
            </p>
            <div className={styles.heroCTA}>
              <a href="#contact" className={styles.btnPrimary}>Start Your Project</a>
              <a href="#about" className={styles.btnSecondary}>Explore Our Work</a>
            </div>
          </div>
          {/* Visual card showcasing details */}
          <div className="glass-dark" style={{ padding: "2.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <h3 style={{ color: "var(--gold)", fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem", fontWeight: "400" }}>
              Brands of Excellence
            </h3>
            <ul style={{ listStyle: "none", color: "#ccc", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.95rem" }}>
              <li>
                <strong style={{ color: "var(--white)" }}>PROMACON Buildtech LLP</strong>
                <span style={{ display: "block", fontSize: "0.8rem", color: "#888" }}>Commercial & Residential Infrastructure</span>
              </li>
              <li>
                <strong style={{ color: "var(--white)" }}>PROMACON Interiors</strong>
                <span style={{ display: "block", fontSize: "0.8rem", color: "#888" }}>Corporate, Commercial & Retail Spaces</span>
              </li>
              <li>
                <strong style={{ color: "var(--white)" }}>Purple Interiors</strong>
                <span style={{ display: "block", fontSize: "0.8rem", color: "#888" }}>Bespoke Luxury Residential Design</span>
              </li>
            </ul>
            <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.1)", fontSize: "0.85rem", color: "#aaa" }}>
              <p>Established: 2012</p>
              <p>Founders: E. Phanindra & G. Naresh</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.section} style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div className={styles.aboutText}>
              <span className={styles.tag}>Who We Are</span>
              <h3 style={{ fontSize: "2.2rem" }}>Dedicated to high-quality construction and luxury interior contracting.</h3>
              <p>
                We specialize in the construction, renovation, and interior fit-out of premium apartments, villas, modern office environments, factories, educational institutions, hospitals, and high-end retail establishments—including luxury gold showrooms.
              </p>
              <p>
                Our experienced team of engineers, architects, project managers, and skilled craftsmen works in unity to transform your design concepts into highly functional, aesthetically breath-taking, and structural sound spaces.
              </p>
              <p>
                We handle everything from planning and coordination to final execution and handover, providing full transparency, absolute precision, and strict adherence to project timelines.
              </p>
            </div>
            <div>
              <div className={styles.tabContainer}>
                <div className={styles.tabHeaders}>
                  <button
                    className={`${styles.tabButton} ${activeTab === "mission" ? styles.tabButtonActive : ""}`}
                    onClick={() => setActiveTab("mission")}
                  >
                    Our Mission
                  </button>
                  <button
                    className={`${styles.tabButton} ${activeTab === "vision" ? styles.tabButtonActive : ""}`}
                    onClick={() => setActiveTab("vision")}
                  >
                    Our Vision
                  </button>
                </div>
                <div className={styles.tabContent}>
                  {activeTab === "mission" ? (
                    <div>
                      <h4>Delivering with Integrity</h4>
                      <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "#444" }}>
                        Building quality spaces with integrity, innovation, and excellence while delivering projects on time, within budget, and beyond client expectations. We are committed to transforming visions into enduring spaces through superior craftsmanship and transparent project management.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h4>Inspiring Future Spaces</h4>
                      <p style={{ fontSize: "0.95rem", lineHeight: "1.7", color: "#444" }}>
                        To become a leading construction and interior solutions company known for creating sustainable, innovative, and inspiring spaces across every sector. We aspire to shape spaces that enhance lives, empower businesses, and contribute to sustainable urban development.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className={styles.section} style={{ backgroundColor: "var(--ivory)" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Our Core Values</span>
            <h3 className={styles.title} style={{ fontSize: "2rem" }}>The Pillars of Our Success</h3>
            <p>Every blueprint we design and every space we build is guided by our fundamental commitment to these principles.</p>
          </div>
          <div className={styles.valuesGrid}>
            {[
              { id: "Q", title: "Quality", desc: "Excellence in workmanship, materials selection, and meticulous execution." },
              { id: "I", title: "Integrity", desc: "Honest, fully transparent, and highly ethical in every client project." },
              { id: "IV", title: "Innovation", desc: "Modern construction practices paired with creative spatial layout design." },
              { id: "C", title: "Customer First", desc: "Building long-term client relationships through trust, safety, and deep satisfaction." },
              { id: "S", title: "Safety", desc: "Maintaining the absolute highest standards of workplace safety." },
              { id: "ST", title: "Sustainability", desc: "Promoting environmentally responsible, sustainable construction practices." },
              { id: "CM", title: "Commitment", desc: "Delivering projects on schedule without ever compromising on safety or details." },
              { id: "TW", title: "Teamwork", desc: "Collaborating with clients, master consultants, and partners for success." }
            ].map((value) => (
              <div key={value.title} className={value.id === "Q" || value.id === "IV" ? `${styles.valueCard} fade-in` : styles.valueCard}>
                <div className={styles.valueIcon}>{value.id}</div>
                <h4>{value.title}</h4>
                <p style={{ fontSize: "0.9rem" }}>{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Request Form Section */}
      <section id="contact" className={styles.section} style={{ backgroundColor: "#ffffff" }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.tag}>Book Consultation</span>
            <h3 className={styles.title} style={{ fontSize: "2rem" }}>Request a Design Proposal</h3>
            <p>Tell us about your project requirements and spatial aspirations. Our design experts will prepare an initial proposal.</p>
          </div>

          <div className={styles.inquiryForm}>
            {status.message && (
              <div className={status.type === "success" ? styles.formSuccess : styles.formError}>
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Your Full Name</label>
                  <input
                    type="text"
                    name="client_name"
                    value={formData.client_name}
                    onChange={handleInputChange}
                    className={styles.input}
                    placeholder="Enter your name"
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
                    className={styles.input}
                    placeholder="Enter phone number"
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
                    className={styles.input}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Project Category</label>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    className={styles.select}
                    required
                  >
                    <option value="" disabled>Select project type</option>
                    <option value="Residential Construction">Residential Construction (Villa / Apartment)</option>
                    <option value="Luxury Home Interior">Luxury Home Interior</option>
                    <option value="Commercial Office Space">Commercial Office Space / Fit-out</option>
                    <option value="Retail / Gold Showroom">Premium Retail / Gold Showroom</option>
                    <option value="Factory / Industrial">Factory / Industrial Warehouse</option>
                    <option value="Healthcare / Educational">Hospital / School Infrastructure</option>
                    <option value="Renovation & Fit-out">Renovation / Refurbishment</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Estimated Budget Range</label>
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
                <label className={styles.label}>Project Details & Requirements</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={styles.textarea}
                  placeholder="Describe your design goals, property dimensions, location or material preferences..."
                />
              </div>

              <button type="submit" className={`${styles.btnPrimary} ${styles.submitBtn}`} disabled={loading}>
                {loading ? "Submitting Inquiry..." : "Submit Quote Request"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerInfo}>
              <h3>PROMACON</h3>
              <p style={{ color: "#aaa", fontSize: "0.95rem", margin: "1rem 0" }}>
                Professionally managed infrastructure and interior contracting, translating customer expectations into durable, high-aesthetics architecture since 2012.
              </p>
              <p style={{ color: "var(--gold)", fontSize: "0.9rem" }}>
                LLP Registration: PROMACAN Buildtech LLP
              </p>
            </div>
            <div className={styles.footerLinks}>
              <h4>Our Brands</h4>
              <ul>
                <li><span style={{ color: "#aaa" }}>PROMACON Buildtech</span></li>
                <li><span style={{ color: "#aaa" }}>PROMACON Interiors</span></li>
                <li><span style={{ color: "#aaa" }}>Purple Interiors</span></li>
              </ul>
            </div>
            <div className={styles.footerLinks}>
              <h4>Contact Channels</h4>
              <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                <strong>Emails:</strong><br />
                promaconbuildtech@gmail.com<br />
                promaconinteriors@gmail.com
              </p>
              <p style={{ color: "#aaa", fontSize: "0.9rem" }}>
                <strong>Phones:</strong><br />
                +91 9679307000<br />
                +91 9052343767
              </p>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; {new Date().getFullYear()} PROMACON Buildtech LLP. All rights reserved.</p>
            <p>Designed with excellence.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
