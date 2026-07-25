"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../../../styles/Admin.module.css";
import homeStyles from "../../../styles/Home.module.css";

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [username, setUsername] = useState("");
  const [inquiries, setInquiries] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  
  // Filtering states
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modals state
  const [activeInquiry, setActiveInquiry] = useState(null); // for editing
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientData, setNewClientData] = useState({
    client_name: "",
    email: "",
    phone: "",
    project_type: "",
    budget: "",
    description: "",
  });
  
  const router = useRouter();

  // 1. Check Authentication on Mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch("/api/auth/check");
        if (!response.ok) {
          throw new Error("Not authenticated");
        }
        const data = await response.json();
        setUsername(data.username || "User");
        setAuthenticated(true);
        fetchInquiries();
      } catch (err) {
        router.push("/admin/login");
      } finally {
        setCheckingAuth(false);
      }
    }
    checkAuth();
  }, [router]);

  // 2. Fetch Client Database records
  async function fetchInquiries() {
    setLoadingData(true);
    try {
      const response = await fetch("/api/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error("Failed to load records:", error);
    } finally {
      setLoadingData(false);
    }
  }

  // 3. Logout action
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 4. Update Inquiry Details (Status / Notes / Profile)
  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    if (!activeInquiry) return;

    try {
      const response = await fetch(`/api/inquiries/${activeInquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activeInquiry),
      });

      if (response.ok) {
        // Update local list
        setInquiries((prev) =>
          prev.map((item) => (item.id === activeInquiry.id ? activeInquiry : item))
        );
        setActiveInquiry(null);
      } else {
        alert("Failed to update inquiry.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating record.");
    }
  };

  // 5. Delete Client Inquiry
  const handleDeleteInquiry = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this client inquiry? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
      } else {
        alert("Failed to delete record.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting record.");
    }
  };

  // 6. Create New Lead / Client directly from CRM
  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClientData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setNewClientData({
          client_name: "",
          email: "",
          phone: "",
          project_type: "",
          budget: "",
          description: "",
        });
        fetchInquiries();
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to add client.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding client.");
    }
  };

  // 7. Filtering logic
  const filteredInquiries = inquiries.filter((item) => {
    const matchesSearch =
      item.client_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.phone.includes(search);

    const matchesType = typeFilter === "all" || item.project_type === typeFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  // 8. CSV Data Exporter
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Client Name",
      "Email",
      "Phone",
      "Project Type",
      "Budget",
      "Project Description",
      "Status",
      "Follow-up Notes",
      "Date Added",
    ];

    const rows = filteredInquiries.map((item) => [
      item.id,
      item.client_name,
      item.email,
      item.phone,
      item.project_type,
      item.budget,
      item.description || "",
      item.status,
      item.notes || "",
      new Date(item.created_at).toLocaleDateString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" + // Include BOM for Excel UTF-8 display
      [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `PROMACON_Client_Database_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 9. Dashboard statistics calculation
  const stats = {
    total: inquiries.length,
    leads: inquiries.filter((i) => i.status === "Lead").length,
    design: inquiries.filter((i) => i.status === "In Design").length,
    construction: inquiries.filter((i) => i.status === "Execution").length,
    completed: inquiries.filter((i) => i.status === "Completed").length,
  };

  if (checkingAuth) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--ivory)", fontFamily: "var(--font-display)" }}>
        <p style={{ fontSize: "1.2rem", color: "var(--gold-dark)" }}>Verifying CRM credentials...</p>
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className={styles.layout}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          PROMACON <span style={{ textTransform: "capitalize" }}>{username} Panel</span>
        </div>
        <ul className={styles.menu}>
          <li className={styles.menuItemActive}>
            <span className={styles.menuItem}>Client Database</span>
          </li>
        </ul>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Log Out ({username})
        </button>
      </aside>

      {/* Main CRM Workspace */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Client Database</h1>
            <p className={styles.dateDisplay}>
              PROMACON Buildtech LLP &bull; Registered Leads Manager
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className={homeStyles.btnPrimary}
            style={{ padding: "0.75rem 1.5rem" }}
          >
            + Add Client
          </button>
        </header>

        {/* Dashboard Stat Cards */}
        <section className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statCardGold}`}>
            <span className={styles.statTitle}>Total Inquiries</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Open Leads</span>
            <span className={styles.statValue}>{stats.leads}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statCardBlue}`}>
            <span className={styles.statTitle}>In Design Stage</span>
            <span className={styles.statValue}>{stats.design}</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statTitle}>Construction/Execution</span>
            <span className={styles.statValue}>{stats.construction}</span>
          </div>
          <div className={`${styles.statCard} ${styles.statCardGreen}`}>
            <span className={styles.statTitle}>Projects Completed</span>
            <span className={styles.statValue}>{stats.completed}</span>
          </div>
        </section>

        {/* Interactive Data List section */}
        <section className={styles.tableCard}>
          {/* Filtering Header bar */}
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search clients by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.filterInput}
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterInput}
            >
              <option value="all">All Project Types</option>
              <option value="Residential Construction">Residential Construction</option>
              <option value="Luxury Home Interior">Luxury Home Interior</option>
              <option value="Commercial Office Space">Commercial Office Space</option>
              <option value="Retail / Gold Showroom">Retail / Gold Showroom</option>
              <option value="Factory / Industrial">Factory / Industrial</option>
              <option value="Healthcare / Educational">Healthcare / Educational</option>
              <option value="Renovation & Fit-out">Renovation & Fit-out</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterInput}
            >
              <option value="all">All Stages</option>
              <option value="Lead">Lead</option>
              <option value="In Design">In Design</option>
              <option value="Execution">Execution</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button onClick={handleExportCSV} className={styles.csvBtn}>
              Export to CSV
            </button>
          </div>

          {/* Table Container */}
          <div className={styles.tableWrapper}>
            {loadingData ? (
              <div style={{ padding: "3rem", textAlign: "center", color: "#888" }}>
                Loading client details...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No client records matched your active search criteria.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Client / Contact</th>
                    <th>Project Category</th>
                    <th>Est. Budget</th>
                    <th>Stage Status</th>
                    <th>Administrative Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((item) => (
                    <tr key={item.id}>
                      <td>#{item.id}</td>
                      <td>
                        <strong style={{ display: "block", color: "var(--charcoal)" }}>{item.client_name}</strong>
                        <span style={{ display: "block", fontSize: "0.85rem", color: "#666" }}>{item.phone}</span>
                        <span style={{ display: "block", fontSize: "0.85rem", color: "#666" }}>{item.email}</span>
                      </td>
                      <td>{item.project_type}</td>
                      <td>{item.budget}</td>
                      <td>
                        <span
                          className={`${styles.badge} ${
                            item.status === "Lead"
                              ? styles.badgeLead
                              : item.status === "In Design"
                              ? styles.badgeDesign
                              : item.status === "Execution"
                              ? styles.badgeConstruction
                              : item.status === "Completed"
                              ? styles.badgeCompleted
                              : styles.badgeCancelled
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <span style={{ fontSize: "0.85rem", color: "#666" }}>
                          {item.notes || <em style={{ color: "#aaa" }}>No administrative notes...</em>}
                        </span>
                      </td>
                      <td>
                        <div className={styles.actions}>
                          <button
                            onClick={() => setActiveInquiry(item)}
                            className={`${styles.actionBtn} ${styles.actionBtnEdit}`}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteInquiry(item.id)}
                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Edit Client Lead Details Modal */}
      {activeInquiry && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Edit Lead details for #{activeInquiry.id}</h3>
              <button onClick={() => setActiveInquiry(null)} className={styles.modalClose}>
                &times;
              </button>
            </div>
            <form onSubmit={handleUpdateInquiry} className={styles.modalForm}>
              <div className={homeStyles.formGrid}>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Client Name</label>
                  <input
                    type="text"
                    value={activeInquiry.client_name}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, client_name: e.target.value }))
                    }
                    className={homeStyles.input}
                    required
                  />
                </div>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Phone Number</label>
                  <input
                    type="text"
                    value={activeInquiry.phone}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className={homeStyles.input}
                    required
                  />
                </div>
              </div>

              <div className={homeStyles.formGrid}>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Email Address</label>
                  <input
                    type="email"
                    value={activeInquiry.email}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={homeStyles.input}
                    required
                  />
                </div>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Project Stage Status</label>
                  <select
                    value={activeInquiry.status}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, status: e.target.value }))
                    }
                    className={homeStyles.select}
                    required
                  >
                    <option value="Lead">Lead (Inquiry Received)</option>
                    <option value="In Design">In Design (Proposal Stage)</option>
                    <option value="Execution">Execution (Under Construction)</option>
                    <option value="Completed">Completed (Handed Over)</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className={homeStyles.formGrid}>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Project Type</label>
                  <select
                    value={activeInquiry.project_type}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, project_type: e.target.value }))
                    }
                    className={homeStyles.select}
                    required
                  >
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Luxury Home Interior">Luxury Home Interior</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Retail / Gold Showroom">Retail / Gold Showroom</option>
                    <option value="Factory / Industrial">Factory / Industrial</option>
                    <option value="Healthcare / Educational">Healthcare / Educational</option>
                    <option value="Renovation & Fit-out">Renovation & Fit-out</option>
                  </select>
                </div>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Est. Budget</label>
                  <select
                    value={activeInquiry.budget}
                    onChange={(e) =>
                      setActiveInquiry((prev) => ({ ...prev, budget: e.target.value }))
                    }
                    className={homeStyles.select}
                    required
                  >
                    <option value="Under ₹10 Lakhs">Under ₹10 Lakhs</option>
                    <option value="₹10 Lakhs - ₹25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                    <option value="₹25 Lakhs - ₹50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                    <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
                    <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                  </select>
                </div>
              </div>

              <div className={homeStyles.formGroup}>
                <label className={homeStyles.label}>Project Original Request</label>
                <textarea
                  value={activeInquiry.description || ""}
                  onChange={(e) =>
                    setActiveInquiry((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className={homeStyles.textarea}
                />
              </div>

              <div className={homeStyles.formGroup}>
                <label className={homeStyles.label}>Follow-up Notes / Activity Logs</label>
                <textarea
                  value={activeInquiry.notes || ""}
                  onChange={(e) =>
                    setActiveInquiry((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  className={homeStyles.textarea}
                  placeholder="Record site visit details, negotiations, or material choices..."
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setActiveInquiry(null)} className={styles.btnCancel}>
                  Cancel
                </button>
                <button type="submit" className={homeStyles.btnPrimary}>
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Client Lead Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Client Lead</h3>
              <button onClick={() => setShowAddModal(false)} className={styles.modalClose}>
                &times;
              </button>
            </div>
            <form onSubmit={handleAddClient} className={styles.modalForm}>
              <div className={homeStyles.formGrid}>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Client Name</label>
                  <input
                    type="text"
                    value={newClientData.client_name}
                    onChange={(e) =>
                      setNewClientData((prev) => ({ ...prev, client_name: e.target.value }))
                    }
                    className={homeStyles.input}
                    placeholder="Enter full name"
                    required
                  />
                </div>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Phone Number</label>
                  <input
                    type="text"
                    value={newClientData.phone}
                    onChange={(e) =>
                      setNewClientData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className={homeStyles.input}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div className={homeStyles.formGrid}>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Email Address</label>
                  <input
                    type="email"
                    value={newClientData.email}
                    onChange={(e) =>
                      setNewClientData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className={homeStyles.input}
                    placeholder="Enter email address"
                    required
                  />
                </div>
                <div className={homeStyles.formGroup}>
                  <label className={homeStyles.label}>Project Category</label>
                  <select
                    value={newClientData.project_type}
                    onChange={(e) =>
                      setNewClientData((prev) => ({ ...prev, project_type: e.target.value }))
                    }
                    className={homeStyles.select}
                    required
                  >
                    <option value="" disabled>Select project type</option>
                    <option value="Residential Construction">Residential Construction</option>
                    <option value="Luxury Home Interior">Luxury Home Interior</option>
                    <option value="Commercial Office Space">Commercial Office Space</option>
                    <option value="Retail / Gold Showroom">Retail / Gold Showroom</option>
                    <option value="Factory / Industrial">Factory / Industrial</option>
                    <option value="Healthcare / Educational">Healthcare / Educational</option>
                    <option value="Renovation & Fit-out">Renovation & Fit-out</option>
                  </select>
                </div>
              </div>

              <div className={homeStyles.formGroup}>
                <label className={homeStyles.label}>Est. Budget</label>
                <select
                  value={newClientData.budget}
                  onChange={(e) =>
                    setNewClientData((prev) => ({ ...prev, budget: e.target.value }))
                  }
                  className={homeStyles.select}
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

              <div className={homeStyles.formGroup}>
                <label className={homeStyles.label}>Project Requirements</label>
                <textarea
                  value={newClientData.description}
                  onChange={(e) =>
                    setNewClientData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className={homeStyles.textarea}
                  placeholder="Describe property sizes, requirements, preferences..."
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="button" onClick={() => setShowAddModal(false)} className={styles.btnCancel}>
                  Cancel
                </button>
                <button type="submit" className={homeStyles.btnPrimary}>
                  Save Client Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
