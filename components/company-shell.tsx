"use client";

import clsx from "clsx";
import { Bell, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Search, Sun, UserCircle, X, ChevronRight, MessageSquare, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { companyNav } from "@/lib/company-data";
import { clearToken } from "@/lib/api-client";

// Index of all searchable pages in the application
const searchPages = [
  { title: "Dashboard Home", category: "Platform", href: "/admin/home" },
  { title: "Masters List", category: "Platform", href: "/admin/masters" },
  { title: "Activities", category: "Platform", href: "/admin/activities" },
  { title: "Activity Reports", category: "Platform", href: "/admin/activity-reports" },
  { title: "MIS Reports", category: "Platform", href: "/admin/mis-reports" },
  { title: "Settings Options", category: "Platform", href: "/admin/options" },
  { title: "Doctor Celebrations", category: "Platform", href: "/admin/doctor-celebrations" },
  
  // Workspace Masters
  { title: "Sub Division Master", category: "Subdivision", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/subdivision/entry" },
  { title: "View - Productwise", category: "Subdivision", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/subdivision/view-productwise" },
  { title: "View - Field Forcewise", category: "Subdivision", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/subdivision/view-field-forcewise" },
  { title: "Product Category Master", category: "Products", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/product/category" },
  { title: "Product Group Master", category: "Products", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/product/group" },
  { title: "Product Brand Master", category: "Products", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/product/brand" },
  { title: "Product Detail Master", category: "Products", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/product/product-detail" },
  { title: "Doctor Category Master", category: "Doctors", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/category" },
  { title: "Doctor Speciality Master", category: "Doctors", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/speciality" },
  { title: "Doctor Qualification Master", category: "Doctors", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/doctor/qualification" },
  { title: "Input Master", category: "Inputs", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/input" },
  { title: "Stockist Details", category: "Stockists", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/stockist-details/add-edit-deactivate" },
  { title: "Super Stockist Mapping", category: "Stockists", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/stockist-details/super-stockist-create-map" },
  { title: "Expense Master", category: "Expenses", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/expense" },
  { title: "Statewise Holiday Fixation", category: "Holidays", href: "/admin/workspace/division-dashboard/division-navigation-tabs/division-master/statewise-holiday-fixation" }
];

export function CompanyShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Search & Notifications states
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; message: string; type: string; time: string }>>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Save/Load theme and sidebar preferences
  useEffect(() => {
    const savedTheme = window.localStorage.getItem("zivira.admin.theme");
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme);
    }
    const savedSidebar = window.localStorage.getItem("zivira.admin.sidebar");
    if (savedSidebar === "closed") setSidebarOpen(false);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("zivira.admin.theme", theme);
  }, [theme]);

  useEffect(() => {
    window.localStorage.setItem("zivira.admin.sidebar", sidebarOpen ? "open" : "closed");
  }, [sidebarOpen]);

  // Load notifications (live notices + fallback alerts)
  useEffect(() => {
    async function loadNotifications() {
      try {
        const token = window.localStorage.getItem("zivira.company.token");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "https://zivira-labs-backend-1.onrender.com/api"}/company/notices`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
          }
        );
        let liveAlerts: any[] = [];
        if (res.ok) {
          const payload = await res.json();
          liveAlerts = (payload.data || []).map((notice: any) => ({
            id: notice.id,
            title: `Notice: ${notice.title}`,
            message: notice.message,
            type: notice.priority === "URGENT" ? "urgent" : "notice",
            time: new Date(notice.createdAt).toLocaleDateString()
          }));
        }
        
        // Dynamic fallback alerts
        const staticAlerts = [
          { id: "1", title: "DCR Submitted", message: "Vijay Kumar (BE) submitted today's DCR", type: "success", time: "Just now" },
          { id: "2", title: "API Sync Completed", message: "Successfully synced with HQ Server", type: "info", time: "2 hours ago" },
          { id: "3", title: "DCR Pending Warning", message: "3 field force members haven't submitted DCR yet", type: "warning", time: "4 hours ago" }
        ];
        
        setNotifications([...liveAlerts, ...staticAlerts]);
      } catch (e) {
        // Fallback alerts if fetch fails
        setNotifications([
          { id: "1", title: "DCR Submitted", message: "Vijay Kumar (BE) submitted today's DCR", type: "success", time: "Just now" },
          { id: "2", title: "API Sync Completed", message: "Successfully synced with HQ Server", type: "info", time: "2 hours ago" },
          { id: "3", title: "DCR Pending Warning", message: "3 field force members haven't submitted DCR yet", type: "warning", time: "4 hours ago" }
        ]);
      }
    }
    
    loadNotifications();
  }, []);

  // Click outside to close notifications popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut CMD/CTRL + K to open search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery("");
    }
  }, [searchOpen]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  function signOut() {
    clearToken();
    router.push("/admin/login");
  }

  const filteredPages = searchQuery
    ? searchPages.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchPages.slice(0, 6);

  return (
    <div className="app-shell">
      {/* ── Search Modal ── */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.45)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "10vh"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "600px",
              background: "var(--panel)",
              border: "1px solid var(--line)",
              borderRadius: "14px",
              boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
              overflow: "hidden",
              animation: "dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid var(--line)", padding: "4px 16px" }}>
              <Search size={20} style={{ color: "var(--muted)", marginRight: "12px" }} />
              <input
                ref={searchInputRef}
                placeholder="Search command pages or modules (e.g. Products, DCR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "16px 0",
                  color: "var(--ink)",
                  fontSize: "16px",
                  outline: "none"
                }}
              />
              <button
                onClick={() => setSearchOpen(false)}
                style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: "8px" }}
              >
                <X size={18} />
              </button>
            </div>
            
            <div style={{ padding: "8px", maxHeight: "380px", overflowY: "auto" }}>
              <p style={{ margin: "8px 12px 4px", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", color: "var(--muted)", letterSpacing: "0.05em" }}>
                {searchQuery ? "Matching Results" : "Recent Modules"}
              </p>
              {filteredPages.map((page) => (
                <div
                  key={page.href}
                  onClick={() => {
                    router.push(page.href);
                    setSearchOpen(false);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                  className="search-item-hover"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 6px", borderRadius: "4px", background: "var(--brand-strong)", color: "#fff", textTransform: "uppercase" }}>
                      {page.category}
                    </span>
                    <strong style={{ color: "var(--ink)", fontSize: "14px" }}>{page.title}</strong>
                  </div>
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                </div>
              ))}
              {filteredPages.length === 0 && (
                <p style={{ textAlign: "center", padding: "24px", color: "var(--muted)", fontSize: "14px" }}>
                  No pages matching "{searchQuery}"
                </p>
              )}
            </div>
            <div style={{ background: "var(--bg)", padding: "10px 16px", borderTop: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--muted)" }}>
              <span>Search inside Zivira Labs workspace</span>
              <span>ESC to close</span>
            </div>
          </div>
        </div>
      )}

      <aside className={clsx("sidebar", !sidebarOpen && "sidebar-collapsed")} style={{ paddingTop: 0 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          borderBottom: "1px solid var(--line)",
          height: "72px",
          marginLeft: sidebarOpen ? "-14px" : "-8px",
          marginRight: sidebarOpen ? "-14px" : "-8px",
          paddingLeft: sidebarOpen ? "22px" : "16px",
          paddingRight: sidebarOpen ? "22px" : "16px"
        }}>
          <Link className="brand" href="/admin/home" style={{ borderBottom: "none", padding: 0, gap: "12px" }}>
            <span className="brand-mark">Z</span>
            {sidebarOpen && (
              <span>
                <p className="brand-title">Zivira Labs</p>
                <p className="brand-subtitle">Admin Portal</p>
              </span>
            )}
          </Link>
          {sidebarOpen && (
            <button
              className="button button-secondary sidebar-toggle-btn"
              onClick={() => setSidebarOpen(false)}
              title="Collapse sidebar"
              type="button"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={18} />
            </button>
          )}
        </div>

        <nav aria-label="Company Admin navigation">
          {companyNav.map((group) => (
            <div className="nav-group" key={group.title}>
              {sidebarOpen && <p className="nav-group-title">{group.title}</p>}
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    className={clsx("nav-link", active && "nav-link-active")}
                    href={item.href}
                    key={item.href}
                    title={!sidebarOpen ? item.title : undefined}
                  >
                    <Icon size={18} />
                    {sidebarOpen && <span>{item.title}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {sidebarOpen && (
          <div className="theme-panel">
            <p className="nav-group-title">Theme</p>
            <div className="theme-toggle" aria-label="Theme mode">
              <button
                className={clsx("theme-option", theme === "light" && "theme-option-active")}
                onClick={() => setTheme("light")}
                type="button"
              >
                <Sun size={16} />
                Light
              </button>
              <button
                className={clsx("theme-option", theme === "dark" && "theme-option-active")}
                onClick={() => setTheme("dark")}
                type="button"
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        )}

        <button className="nav-signout" onClick={signOut} type="button" title={!sidebarOpen ? "Sign out" : undefined}>
          <LogOut size={16} />
          {sidebarOpen && "Sign out"}
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {!sidebarOpen && (
              <button
                className="button button-secondary sidebar-toggle-btn"
                onClick={() => setSidebarOpen(true)}
                title="Expand sidebar"
                type="button"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen size={18} />
              </button>
            )}
            <div>
              <h1>Tenant Operations</h1>
              <p>Zivira Labs · platform tabs</p>
            </div>
          </div>
          <div className="topbar-actions" style={{ position: "relative" }}>
            <button
              className="button button-secondary"
              title="Search (Ctrl+K)"
              onClick={() => setSearchOpen(true)}
              suppressHydrationWarning
            >
              <Search size={17} />
            </button>
            <button
              className="button button-secondary"
              title="Notifications"
              onClick={() => setNotificationsOpen((o) => !o)}
              style={{ position: "relative" }}
              suppressHydrationWarning
            >
              <Bell size={17} />
              {notifications.length > 0 && (
                <span style={{ position: "absolute", top: "-2px", right: "-2px", background: "var(--brand)", width: "8px", height: "8px", borderRadius: "50%" }} />
              )}
            </button>

            {/* ── Notifications Popover ── */}
            {notificationsOpen && (
              <div
                ref={notifRef}
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 12px)",
                  zIndex: 9999,
                  width: "340px",
                  background: "color-mix(in srgb, var(--panel) 92%, transparent)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid var(--line)",
                  borderRadius: "14px",
                  boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
                  padding: "16px",
                  animation: "dropdownFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                  <h4 style={{ margin: 0, fontSize: "15px", color: "var(--ink)", fontWeight: 700 }}>Notifications</h4>
                  <button onClick={() => setNotificationsOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer" }}>
                    <X size={15} />
                  </button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "280px", overflowY: "auto", paddingRight: "4px" }} className="scroll-panel">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      style={{
                        display: "flex",
                        gap: "10px",
                        padding: "10px",
                        borderRadius: "8px",
                        background: "var(--bg)",
                        border: "1px solid var(--line)"
                      }}
                    >
                      <span style={{ marginTop: "2px" }}>
                        {notif.type === "urgent" || notif.type === "warning" ? (
                          <AlertCircle size={16} color="var(--amber)" />
                        ) : notif.type === "success" ? (
                          <Info size={16} color="#10b981" />
                        ) : (
                          <MessageSquare size={16} color="var(--brand)" />
                        )}
                      </span>
                      <div style={{ flex: 1 }}>
                        <strong style={{ display: "block", fontSize: "13px", color: "var(--ink)", fontWeight: 700 }}>{notif.title}</strong>
                        <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)", lineHeight: 1.4 }}>{notif.message}</p>
                        <span style={{ display: "block", marginTop: "4px", fontSize: "10px", color: "var(--muted)" }}>{notif.time}</span>
                      </div>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <p style={{ textAlign: "center", padding: "16px 0", color: "var(--muted)", fontSize: "13px" }}>No alerts today</p>
                  )}
                </div>
              </div>
            )}

            <span className="badge" style={{ gap: "6px" }}>
              <UserCircle size={16} /> Admin Zivira
            </span>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  );
}
