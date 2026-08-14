import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  Package,
  CheckCircle2,
  Wrench,
  XCircle,
  Plus,
  RefreshCw,
  Search,
  AlertTriangle,
  ClipboardList,
  LogIn,
  LogOut,
  Clock,
  Pencil,
  Trash2,
  ChevronDown,
  LayoutDashboard,
  Download,
  QrCode,
  User,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Building2,
  Layers,
  ArrowRight,
  Camera,
  Sparkles,
  Tag,
  X,
  FileSpreadsheet,
  Settings,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import UserPortal from './UserPortal';
import CadetIdGenerator from './CadetIdGenerator';


const API_BASE = '/api/inventory';
const CSU_ROTC_LOGO = '/csu-rotc-logo.png';


// ─── Native Excel (.xlsx) Exporter with Column Auto-Widths ───────────────────
function exportToExcel(filename, rows, columns, sheetName = 'Equipment Status') {
  if (!rows || rows.length === 0) return;

  const formattedData = rows.map(row => {
    const formattedRow = {};
    columns.forEach(col => {
      let val = row[col.key] ?? '';
      if (typeof val === 'number' || (!isNaN(val) && val !== '' && !String(val).startsWith('0') && String(val).length < 10)) {
        val = isNaN(Number(val)) ? val : Number(val);
      }
      formattedRow[col.label] = val;
    });
    return formattedRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);

  // Auto-fit column widths so text is never truncated in Excel
  const colWidths = columns.map(col => {
    let maxLen = col.label.length;
    rows.forEach(row => {
      const valStr = String(row[col.key] ?? '');
      if (valStr.length > maxLen) maxLen = valStr.length;
    });
    return { wch: Math.min(Math.max(maxLen + 4, 14), 60) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  XLSX.writeFile(workbook, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
}

// ─── Intelligent Search Assistance Component ─────────────────────────────
function SearchWithAssistance({ value, onChange, placeholder, suggestions = [], categories = [] }) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = React.useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const q = value.toLowerCase().trim();

  const matchingSuggestions = suggestions.filter(s =>
    !q || (s.name && s.name.toLowerCase().includes(q)) || (s.category && s.category.toLowerCase().includes(q))
  ).slice(0, 5);

  const matchingCategories = categories.filter(c =>
    !q || c.toLowerCase().includes(q)
  ).slice(0, 4);

  const showPanel = focused && (matchingSuggestions.length > 0 || matchingCategories.length > 0);

  return (
    <div className="search-assistance-wrap" ref={wrapperRef}>
      <div className="search-box" style={{ width: '100%' }}>
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder={placeholder || "Type to search..."}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
        />
        {value && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={() => onChange('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {showPanel && (
        <div className="search-assistance-panel">
          {matchingCategories.length > 0 && (
            <div className="search-assist-section">
              <div className="search-assist-label"><Sparkles size={12} /> Category Suggestions</div>
              <div className="search-assist-chips">
                {matchingCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className="search-chip"
                    onMouseDown={() => { onChange(cat); setFocused(false); }}
                  >
                    <Tag size={11} /> {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingSuggestions.length > 0 && (
            <div className="search-assist-section">
              <div className="search-assist-label"><Search size={12} /> Matching Items</div>
              <div className="search-assist-items">
                {matchingSuggestions.map(item => (
                  <div
                    key={item.id || item.name}
                    className="search-assist-item-row"
                    onMouseDown={() => { onChange(item.name); setFocused(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Package size={14} className="text-muted" />
                      <div>
                        <strong className="assist-item-title">{item.name}</strong>
                        {item.category && <span className="assist-item-sub"> ({item.category})</span>}
                      </div>
                    </div>
                    {item.serviceable_qty !== undefined && (
                      <span className="qty-badge qty-green" style={{ fontSize: '0.7rem' }}>
                        {item.serviceable_qty} available
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Condition Badge ──────────────────────────────────────────────────────────
function ConditionBadge({ label, count, type }) {
  const styles = {
    serviceable: { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' },
    repairable:  { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' },
    condemned:   { background: 'rgba(239,68,68,0.15)',  color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
  };
  const icons = {
    serviceable: <CheckCircle2 size={12} />,
    repairable:  <Wrench size={12} />,
    condemned:   <XCircle size={12} />,
  };
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', padding:'3px 8px', borderRadius:'12px', fontSize:'0.78rem', fontWeight:600, ...styles[type] }}>
      {icons[type]} {count} {label}
    </span>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('csu_rotc_viewMode') || 'landing';
  });
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('csu_rotc_activeTab') || 'overview';
  });

  // Save navigation state to localStorage to persist across browser refreshes
  useEffect(() => {
    localStorage.setItem('csu_rotc_viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('csu_rotc_activeTab', activeTab);
  }, [activeTab]);

  const [settingsTab, setSettingsTab] = useState(() => {
    return localStorage.getItem('csu_rotc_settingsTab') || 'actions';
  });

  useEffect(() => {
    localStorage.setItem('csu_rotc_settingsTab', settingsTab);
  }, [settingsTab]);

  // Data
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState(() => {
    return localStorage.getItem('csu_rotc_domainFilter') || '';
  });
  const [categoryFilter, setCategoryFilter] = useState(() => {
    return localStorage.getItem('csu_rotc_categoryFilter') || '';
  });

  useEffect(() => {
    localStorage.setItem('csu_rotc_domainFilter', domainFilter);
  }, [domainFilter]);

  useEffect(() => {
    localStorage.setItem('csu_rotc_categoryFilter', categoryFilter);
  }, [categoryFilter]);
  const [equipmentViewTab, setEquipmentViewTab] = useState('actions'); // 'actions' | 'borrowable'
  const [borrowStatusFilter, setBorrowStatusFilter] = useState('');
  const [returnConditionFilter, setReturnConditionFilter] = useState('');

  // Modals
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningBorrow, setReturningBorrow] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [quickUploadingId, setQuickUploadingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // Toast notification
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Forms
  const [itemForm, setItemForm] = useState({ name: '', category: 'Armory Equipment', unit_of_measure: 'pcs', serviceable_qty: 0, repairable_qty: 0, condemned_qty: 0, borrowable: true, description: '' });
  const [checkoutForm, setCheckoutForm] = useState({ item_id: '', quantity: 1, borrower_name: '', borrower_id: '', borrower_contact: '', expected_return_date: '', checkout_notes: '', handled_by: 'CDT LTC CHRISTIAN B ABAMO' });
  const [returnForm, setReturnForm] = useState({ return_condition: 'Good', return_notes: '', handled_by: 'CDT LTC CHRISTIAN B ABAMO' });

  // ─── Fetch Data ─────────────────────────────────────────────────────────────
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [sumRes, itemsRes, borrowRes] = await Promise.all([
        fetch(`${API_BASE}/summary`),
        fetch(`${API_BASE}/items`),
        fetch(`${API_BASE}/borrowings`),
      ]);
      const [sumData, itemsData, borrowData] = await Promise.all([
        sumRes.json(), itemsRes.json(), borrowRes.json(),
      ]);
      setSummary(sumData);
      setItems(Array.isArray(itemsData) ? itemsData : []);
      setBorrowings(Array.isArray(borrowData) ? borrowData : []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 4000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // ─── Image Upload Handler ──────────────────────────────────────────────────
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setErrorMessage('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to upload image.');
      } else {
        setItemForm(prev => ({ ...prev, image_url: data.imageUrl }));
      }
    } catch (err) {
      setErrorMessage('Network error during upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  // ─── Domain Helpers ──────────────────────────────────────────────────────────
  const getDomainByCategory = (cat) => {
    if (!cat) return 'Office';
    if (cat.startsWith('Office')) return 'Office';
    if (cat.startsWith('Supply')) return 'Supply';
    if (cat.startsWith('Armory')) return 'Armory';
    return 'Office';
  };

  const getCleanSubCategoryName = (cat) => {
    if (!cat) return '';
    if (cat.startsWith('Office ')) return cat.replace('Office ', '');
    if (cat.startsWith('Supply ')) return cat.replace('Supply ', '');
    if (cat.startsWith('Armory ')) return cat.replace('Armory ', '');
    return cat;
  };

  // ─── Computed ────────────────────────────────────────────────────────────────
  const activeBorrowings = borrowings.filter(b => b.status === 'Active');
  const returnedBorrowings = borrowings.filter(b => b.status === 'Returned');

  const activeBorrowCount = activeBorrowings.length;
  const returnedBorrowCount = returnedBorrowings.length;

  const officeCategoriesSummary = (summary?.byCategory || []).filter(c => c.category.startsWith('Office'));
  const supplyCategoriesSummary = (summary?.byCategory || []).filter(c => c.category.startsWith('Supply'));
  const armoryCategoriesSummary = (summary?.byCategory || []).filter(c => c.category.startsWith('Armory'));

  const filteredItems = items.filter(i => {
    const matchSearch = !searchQuery || i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.category.toLowerCase().includes(searchQuery.toLowerCase()) || (i.description && i.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const itemDomain = getDomainByCategory(i.category);
    const matchDomain = !domainFilter || itemDomain === domainFilter;
    const matchCat = !categoryFilter || i.category === categoryFilter;
    return matchSearch && matchDomain && matchCat;
  });

  const filteredActiveBorrowings = activeBorrowings.filter(b => {
    const matchSearch = !searchQuery || b.borrower_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.borrower_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !borrowStatusFilter || (borrowStatusFilter === 'Overdue' ? b.is_overdue : b.status === borrowStatusFilter);
    return matchSearch && matchStatus;
  });

  const filteredReturns = returnedBorrowings.filter(b => {
    const matchSearch = !searchQuery || b.borrower_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.item_name.toLowerCase().includes(searchQuery.toLowerCase()) || b.borrower_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCondition = !returnConditionFilter || b.return_condition === returnConditionFilter;
    return matchSearch && matchCondition;
  });

  // ─── Item CRUD ───────────────────────────────────────────────────────────────
  const openAddItem = () => {
    setEditingItem(null);
    setItemForm({ name: '', category: 'Armory Equipment', unit_of_measure: 'pcs', serviceable_qty: 0, repairable_qty: 0, condemned_qty: 0, borrowable: true, image_url: '', description: '' });
    setErrorMessage('');
    setShowItemModal(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      unit_of_measure: item.unit_of_measure,
      serviceable_qty: item.serviceable_qty,
      repairable_qty: item.repairable_qty,
      condemned_qty: item.condemned_qty,
      borrowable: item.borrowable === 0 ? false : true,
      image_url: item.image_url || '',
      description: item.description || ''
    });
    setErrorMessage('');
    setShowItemModal(true);
  };

  const saveItem = async () => {
    if (!itemForm.name.trim() || !itemForm.category) { setErrorMessage('Name and category are required.'); return; }
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `${API_BASE}/items/${editingItem.id}` : `${API_BASE}/items`;
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemForm) });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || data.error || 'Error saving item.';
        setErrorMessage(msg);
        showToast(`❌ ${msg}`, 'error');
        return;
      }
      setShowItemModal(false);
      showToast(`✅ "${itemForm.name}" successfully saved to inventory!`, 'success');
      setItemForm({ name: '', category: 'Office Equipment', unit_of_measure: 'pcs', serviceable_qty: 0, repairable_qty: 0, condemned_qty: 0, borrowable: true, image_url: '', description: '' });
      setSettingsTab('actions');
      fetchData();
    } catch (err) {
      setErrorMessage('Network error.');
      showToast('❌ Network error while saving equipment.', 'error');
    }
  };

  const deleteItem = async (item) => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    await fetch(`${API_BASE}/items/${item.id}`, { method: 'DELETE' });
    fetchData();
  };

  // ─── Quick Borrowable Toggle ─────────────────────────────────────────────────
  const toggleBorrowable = async (item) => {
    setTogglingId(item.id);
    try {
      const newVal = item.borrowable ? 0 : 1;
      const res = await fetch(`${API_BASE}/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, borrowable: newVal }),
      });
      const data = await res.json();
      if (res.ok) {
        const newState = data.borrowable ? 'Enabled' : 'Disabled';
        const icon = data.borrowable ? '✅' : '🚫';
        showToast(`${icon} "${item.name}" borrowing ${newState} — ${data.borrowable ? 'Cadets CAN now borrow this item' : 'Cadets CANNOT borrow this item'}`, data.borrowable ? 'success' : 'warning');
        fetchData();
      } else {
        showToast('Failed to update borrowable status.', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
      console.error('Toggle failed:', err);
    } finally {
      setTogglingId(null);
    }
  };

  // ─── Quick Image Upload (inline from table row) ───────────────────────────────
  const handleQuickImageUpload = async (itemId, file) => {
    if (!file) return;
    setQuickUploadingId(itemId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const uploadRes = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) { console.error(uploadData.error); return; }
      // Save the new image_url to the item
      const item = items.find(i => i.id === itemId);
      if (!item) return;
      await fetch(`${API_BASE}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, image_url: uploadData.imageUrl }),
      });
      fetchData();
    } catch (err) {
      console.error('Quick upload failed:', err);
    } finally {
      setQuickUploadingId(null);
    }
  };

  // ─── Checkout ────────────────────────────────────────────────────────────────
  const openCheckout = () => {
    const borrowableItems = items.filter(i => i.serviceable_qty > 0 && Boolean(i.borrowable));
    setCheckoutForm({ item_id: borrowableItems.length ? borrowableItems[0].id : '', quantity: 1, borrower_name: '', borrower_id: '', borrower_contact: '', expected_return_date: '', checkout_notes: '', handled_by: 'CDT LTC CHRISTIAN B ABAMO' });
    setErrorMessage('');
    setShowCheckoutModal(true);
  };

  const submitCheckout = async () => {
    if (!checkoutForm.item_id || !checkoutForm.borrower_name || !checkoutForm.borrower_id || !checkoutForm.expected_return_date) {
      setErrorMessage('Please fill in all required fields.'); return;
    }
    try {
      const res = await fetch(`${API_BASE}/borrowings`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(checkoutForm) });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.message || data.error || 'Checkout failed.'); return; }
      setShowCheckoutModal(false);
      fetchData();
    } catch (err) { setErrorMessage('Network error.'); }
  };

  // ─── Return ──────────────────────────────────────────────────────────────────
  const openReturn = (borrow) => {
    setReturningBorrow(borrow);
    setReturnForm({ return_condition: 'Good', return_notes: '', handled_by: 'CDT LTC CHRISTIAN B ABAMO' });
    setErrorMessage('');
    setShowReturnModal(true);
  };

  const submitReturn = async () => {
    try {
      const res = await fetch(`${API_BASE}/borrowings/${returningBorrow.id}/return`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(returnForm) });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.message || data.error || 'Return failed.'); return; }
      setShowReturnModal(false);
      fetchData();
    } catch (err) { setErrorMessage('Network error.'); }
  };

  const categories = [
    'Armory Equipment',
    'Office Equipment',
    'Office Furniture',
    'Office Flag & Decoration',
    'Supply Equipment',
    'Supply Furniture',
    'Supply Kitchenware',
    'Supply Uniform & Clothing',
    'Supply Ceremonial & Display',
    'Supply Tools',
    'Supply Miscellaneous',
  ];

  // ─── CADET USER PORTAL ───────────────────────────────────────────────────────
  if (viewMode === 'cadet') {
    return <UserPortal onBack={() => setViewMode('landing')} />;
  }

  // ─── LANDING PAGE ─────────────────────────────────────────────────────────────
  if (viewMode === 'landing') {
    return (
      <div className="landing-page">
        <div className="landing-content">
          <div className="landing-logo">
            <img src={CSU_ROTC_LOGO} alt="CSU ROTC Logo" />
          </div>
          <div className="landing-unit-info">
            <div className="landing-unit-label">HEADQUARTERS</div>
            <h1 className="landing-title">Caraga State University<br />ROTC Unit</h1>
            <p className="landing-subtitle">Supply & Inventory Management System</p>
            <div className="landing-unit-details">
              <span>1501 (ADN) · 15th (CARAGA) RCDG · ARESCOM</span>
              <span>Ampayon, Butuan City</span>
            </div>
          </div>
          <div className="landing-buttons">
            <button className="landing-enter-btn landing-cadet-btn" onClick={() => setViewMode('cadet')}>
              <QrCode size={20} />
              <span>Cadet Portal (Scan ID)</span>
            </button>
            <button className="landing-enter-btn landing-admin-btn" onClick={() => setViewMode('dashboard')}>
              <LayoutDashboard size={18} />
              <span>Admin Dashboard</span>
            </button>
          </div>
          <div className="landing-footer">
            <span>S4 BDE Logistics · CDT LTC CHRISTIAN B ABAMO (ROTC)1CL</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────────
  return (
    <div className="app-layout">
      {/* ── TOAST NOTIFICATION ─────────────────────────────────────────── */}
      {toast && (
        <div className={`admin-toast admin-toast-${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo" onClick={() => setViewMode('landing')} style={{ cursor: 'pointer' }}>
          <img src={CSU_ROTC_LOGO} alt="CSU ROTC" className="sidebar-logo-img" />
          <div className="sidebar-logo-text">
            <span className="sidebar-unit-name">CSU ROTC Unit</span>
            <span className="sidebar-unit-sub">Inventory System</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">MAIN MENU</div>

          <button
            id="nav-overview"
            className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
          >
            <LayoutDashboard size={18} />
            <span>Overview</span>
          </button>

          <button
            id="nav-equipment"
            className={`sidebar-nav-item ${activeTab === 'equipment' ? 'active' : ''}`}
            onClick={() => { setActiveTab('equipment'); setSearchQuery(''); setCategoryFilter(''); }}
          >
            <Package size={18} />
            <span>Equipment Status</span>
            <span className="nav-count">{items.length}</span>
          </button>

          <button
            id="nav-borrowings"
            className={`sidebar-nav-item ${activeTab === 'borrowings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('borrowings'); setSearchQuery(''); setBorrowStatusFilter(''); }}
          >
            <LogOut size={18} />
            <span>Borrow Log</span>
            {activeBorrowCount > 0 && <span className="nav-badge">{activeBorrowCount}</span>}
          </button>

          <button
            id="nav-returns"
            className={`sidebar-nav-item ${activeTab === 'returns' ? 'active' : ''}`}
            onClick={() => { setActiveTab('returns'); setSearchQuery(''); setReturnConditionFilter(''); }}
          >
            <RotateCcw size={18} />
            <span>Return History Log</span>
            {returnedBorrowCount > 0 && <span className="nav-count">{returnedBorrowCount}</span>}
          </button>

          <button
            id="nav-id-generator"
            className={`sidebar-nav-item ${activeTab === 'id-generator' ? 'active' : ''}`}
            onClick={() => { setActiveTab('id-generator'); }}
          >
            <QrCode size={18} />
            <span>Cadet ID Generator</span>
          </button>

          <button
            id="nav-settings"
            className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveTab('settings'); setSearchQuery(''); setCategoryFilter(''); }}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-footer-text">
            <span>S4 BDE Logistics</span>
            <span>CDT LTC CHRISTIAN B ABAMO</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {loading && (
          <div className="loading-overlay">
            <RefreshCw size={28} className="spin" />
            <span>Loading...</span>
          </div>
        )}

        {/* ── OVERVIEW TAB ─────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="page-header">
              <div>
                <h2 className="page-title">Readiness Overview</h2>
                <p className="page-subtitle">HQ CSU ROTC Unit — Supply &amp; Equipment Status</p>
              </div>
              <button className="btn btn-secondary" onClick={fetchData}>
                <RefreshCw size={15} /> Refresh
              </button>
            </div>

            {/* Stat Cards */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><Package size={22} /></div>
                <div className="stat-info">
                  <p>Total Items</p>
                  <h3>{summary?.totalItems ?? 0}</h3>
                  <small>Equipment types</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-green"><CheckCircle2 size={22} /></div>
                <div className="stat-info">
                  <p>Total Serviceable</p>
                  <h3>{summary?.totalServiceable ?? 0}</h3>
                  <small>Ready for use</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-amber"><Wrench size={22} /></div>
                <div className="stat-info">
                  <p>For Repair</p>
                  <h3>{summary?.totalRepairable ?? 0}</h3>
                  <small>Need maintenance</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-red"><XCircle size={22} /></div>
                <div className="stat-info">
                  <p>Condemned</p>
                  <h3>{summary?.totalCondemned ?? 0}</h3>
                  <small>Unserviceable</small>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon stat-icon-blue"><LogOut size={22} /></div>
                <div className="stat-info">
                  <p>Currently Borrowed</p>
                  <h3>{summary?.currentlyBorrowed ?? 0}</h3>
                  <small>Active issues</small>
                </div>
              </div>
              {(summary?.overdueCount ?? 0) > 0 && (
                <div className="stat-card stat-card-alert">
                  <div className="stat-icon stat-icon-red"><Clock size={22} /></div>
                  <div className="stat-info">
                    <p>Overdue Returns</p>
                    <h3>{summary.overdueCount}</h3>
                    <small>Past due date</small>
                  </div>
                </div>
              )}
            </div>

            {/* ── 3 DISTINCT DOMAIN INVENTORY SECTIONS (OFFICE, SUPPLY ROOM, ARMORY) ── */}
            <div className="domains-overview-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px' }}>
              
              {/* 🏢 1. OFFICE INVENTORY SECTION */}
              <div className="section-card domain-section-card">
                <div className="domain-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '2px solid rgba(0,77,37,0.1)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.12)', color: '#1d4ed8', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                      <Building2 size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--csu-green-dark)', margin: 0 }}>OFFICE INVENTORY</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Headquarters Office Equipment, Furniture, Flags &amp; Decorations</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setDomainFilter('Office'); setCategoryFilter(''); setSearchQuery(''); setActiveTab('equipment'); }}>
                    View All Office Items ({officeCategoriesSummary.reduce((s, c) => s + c.item_count, 0)}) <ArrowRight size={13} />
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>Sub-Category</th>
                        <th>Equipment Items</th>
                        <th>Serviceable Qty</th>
                        <th>Repairable Qty</th>
                        <th>Condemned Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officeCategoriesSummary.map(cat => (
                        <tr key={cat.category} style={{ cursor: 'pointer' }} onClick={() => { setDomainFilter('Office'); setCategoryFilter(cat.category); setSearchQuery(''); setActiveTab('equipment'); }}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>{getCleanSubCategoryName(cat.category)}</strong>
                            <div className="item-desc">{cat.category}</div>
                          </td>
                          <td><strong>{cat.item_count}</strong> items</td>
                          <td><span className="qty-badge qty-green">{cat.serviceable}</span></td>
                          <td><span className="qty-badge qty-amber">{cat.repairable}</span></td>
                          <td><span className="qty-badge qty-red">{cat.condemned}</span></td>
                          <td>
                            <button className="btn btn-secondary btn-xs" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                              View Category <ArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 📦 2. SUPPLY ROOM INVENTORY SECTION */}
              <div className="section-card domain-section-card">
                <div className="domain-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '2px solid rgba(0,77,37,0.1)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#047857', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                      <Package size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--csu-green-dark)', margin: 0 }}>SUPPLY ROOM INVENTORY</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Cadet Uniforms, Kitchenware, Tools, Furniture, Ceremonial &amp; Miscellaneous Supplies</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setDomainFilter('Supply'); setCategoryFilter(''); setSearchQuery(''); setActiveTab('equipment'); }}>
                    View All Supply Room Items ({supplyCategoriesSummary.reduce((s, c) => s + c.item_count, 0)}) <ArrowRight size={13} />
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>Sub-Category</th>
                        <th>Equipment Items</th>
                        <th>Serviceable Qty</th>
                        <th>Repairable Qty</th>
                        <th>Condemned Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplyCategoriesSummary.map(cat => (
                        <tr key={cat.category} style={{ cursor: 'pointer' }} onClick={() => { setDomainFilter('Supply'); setCategoryFilter(cat.category); setSearchQuery(''); setActiveTab('equipment'); }}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>{getCleanSubCategoryName(cat.category)}</strong>
                            <div className="item-desc">{cat.category}</div>
                          </td>
                          <td><strong>{cat.item_count}</strong> items</td>
                          <td><span className="qty-badge qty-green">{cat.serviceable}</span></td>
                          <td><span className="qty-badge qty-amber">{cat.repairable}</span></td>
                          <td><span className="qty-badge qty-red">{cat.condemned}</span></td>
                          <td>
                            <button className="btn btn-secondary btn-xs" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                              View Category <ArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ⚔️ 3. ARMORY INVENTORY SECTION */}
              <div className="section-card domain-section-card">
                <div className="domain-section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '2px solid rgba(0,77,37,0.1)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(245, 158, 11, 0.12)', color: '#b45309', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--csu-green-dark)', margin: 0 }}>ARMORY INVENTORY</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Cadet Training Rifles, Guidons, Drums, Field Markers &amp; Tactical Equipment</p>
                    </div>
                  </div>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setDomainFilter('Armory'); setCategoryFilter(''); setSearchQuery(''); setActiveTab('equipment'); }}>
                    View All Armory Items ({armoryCategoriesSummary.reduce((s, c) => s + c.item_count, 0)}) <ArrowRight size={13} />
                  </button>
                </div>

                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>Sub-Category</th>
                        <th>Equipment Items</th>
                        <th>Serviceable Qty</th>
                        <th>Repairable Qty</th>
                        <th>Condemned Qty</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {armoryCategoriesSummary.map(cat => (
                        <tr key={cat.category} style={{ cursor: 'pointer' }} onClick={() => { setDomainFilter('Armory'); setCategoryFilter(cat.category); setSearchQuery(''); setActiveTab('equipment'); }}>
                          <td>
                            <strong style={{ color: 'var(--text-primary)' }}>{getCleanSubCategoryName(cat.category)}</strong>
                            <div className="item-desc">{cat.category}</div>
                          </td>
                          <td><strong>{cat.item_count}</strong> items</td>
                          <td><span className="qty-badge qty-green">{cat.serviceable}</span></td>
                          <td><span className="qty-badge qty-amber">{cat.repairable}</span></td>
                          <td><span className="qty-badge qty-red">{cat.condemned}</span></td>
                          <td>
                            <button className="btn btn-secondary btn-xs" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                              View Category <ArrowRight size={11} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ── 1. EQUIPMENT STATUS TAB (PURE INVENTORY REPORT) ───────── */}
        {activeTab === 'equipment' && (
          <div className="tab-content">
            <div className="page-header">
              <div>
                <h2 className="page-title">Equipment Status</h2>
                <p className="page-subtitle">
                  {domainFilter ? `${domainFilter} Inventory` : 'All Inventories'} · {filteredItems.length} items listed
                </p>
              </div>
              <div className="header-actions">
                <button
                  className="btn"
                  style={{ background: '#107c41', color: '#ffffff', borderColor: '#107c41', fontWeight: 600, gap: '6px' }}
                  onClick={() => exportToExcel('CSU_ROTC_Equipment_Status.xlsx', filteredItems, [
                    { key: 'name', label: 'Equipment Name' },
                    { key: 'category', label: 'Category' },
                    { key: 'unit_of_measure', label: 'Unit' },
                    { key: 'serviceable_qty', label: 'Serviceable' },
                    { key: 'repairable_qty', label: 'Repairable' },
                    { key: 'condemned_qty', label: 'Condemned' },
                    { key: 'description', label: 'Description' },
                  ])}
                >
                  <FileSpreadsheet size={16} /> Export Excel
                </button>
              </div>
            </div>

            {/* Top Domain Inventory Tabs (Row 1) */}
            <div className="domain-tabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${domainFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDomainFilter(''); setCategoryFilter(''); }}
                style={{ fontWeight: 700 }}
              >
                <Layers size={15} /> All Inventories ({items.length})
              </button>

              <button
                className={`btn ${domainFilter === 'Office' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDomainFilter('Office'); setCategoryFilter(''); }}
                style={{ fontWeight: 700 }}
              >
                <Building2 size={15} /> Office Inventory ({items.filter(i => i.category.startsWith('Office')).length})
              </button>

              <button
                className={`btn ${domainFilter === 'Supply' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDomainFilter('Supply'); setCategoryFilter(''); }}
                style={{ fontWeight: 700 }}
              >
                <Package size={15} /> Supply Room Inventory ({items.filter(i => i.category.startsWith('Supply')).length})
              </button>

              <button
                className={`btn ${domainFilter === 'Armory' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => { setDomainFilter('Armory'); setCategoryFilter(''); }}
                style={{ fontWeight: 700 }}
              >
                <Shield size={15} /> Armory Inventory ({items.filter(i => i.category.startsWith('Armory')).length})
              </button>
            </div>

            {/* Sub-Category Tab Bar (Row 2: Directly under Domain Tabs) */}
            <div className="subcategory-tabs-bar">
              <button
                className={`subcategory-tab-btn ${categoryFilter === '' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('')}
              >
                All {domainFilter ? `${domainFilter}` : ''} Sub-Categories ({items.filter(i => !domainFilter || i.category.startsWith(domainFilter)).length})
              </button>

              {categories
                .filter(c => !domainFilter || c.startsWith(domainFilter))
                .map(c => {
                  const count = items.filter(i => i.category === c).length;
                  const cleanName = getCleanSubCategoryName(c);
                  return (
                    <button
                      key={c}
                      className={`subcategory-tab-btn ${categoryFilter === c ? 'active' : ''}`}
                      onClick={() => setCategoryFilter(c)}
                    >
                      {cleanName} ({count})
                    </button>
                  );
                })}
            </div>

            {/* Search Box with Intelligent Assistance */}
            <div className="controls-bar" style={{ marginBottom: '18px' }}>
              <SearchWithAssistance
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={domainFilter ? `Search ${domainFilter} equipment by name, category or description...` : "Search all equipment by name, category or description..."}
                suggestions={items}
                categories={['Armory Equipment', 'Office Furniture', 'Supply Room', 'Musical Instrument', 'Uniforms']}
              />
            </div>

            {/* Pure Equipment Inventory Table */}
            <div className="section-card">
              {filteredItems.length === 0 ? (
                <div className="empty-state">
                  <Package size={40} />
                  <p>No equipment found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Equipment Name</th>
                        <th>Category</th>
                        <th>Unit</th>
                        <th style={{ color: '#10b981' }}>Serviceable</th>
                        <th style={{ color: '#f59e0b' }}>Repairable</th>
                        <th style={{ color: '#ef4444' }}>Condemned</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, idx) => {
                        const total = item.serviceable_qty + item.repairable_qty + item.condemned_qty;
                        return (
                          <tr key={item.id}>
                            <td className="row-num">{idx + 1}</td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {item.image_url ? (
                                  <img src={item.image_url} alt={item.name} className="item-thumb" />
                                ) : (
                                  <div className="item-thumb-placeholder"><ImageIcon size={18} /></div>
                                )}
                                <div>
                                  <strong>{item.name}</strong>
                                  {item.description && <div className="item-desc">{item.description}</div>}
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className="cat-tag" style={{
                                background: item.category.startsWith('Office') ? 'rgba(59, 130, 246, 0.12)' : item.category.startsWith('Supply') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                color: item.category.startsWith('Office') ? '#1d4ed8' : item.category.startsWith('Supply') ? '#047857' : '#b45309',
                                fontWeight: 700
                              }}>
                                {getDomainByCategory(item.category)} · {getCleanSubCategoryName(item.category)}
                              </span>
                            </td>
                            <td className="text-muted">{item.unit_of_measure}</td>
                            <td>
                              <span className={`qty-badge qty-green ${item.serviceable_qty === 0 ? 'qty-zero' : ''}`}>
                                {item.serviceable_qty}
                              </span>
                            </td>
                            <td>
                              <span className={`qty-badge qty-amber ${item.repairable_qty === 0 ? 'qty-zero' : ''}`}>
                                {item.repairable_qty}
                              </span>
                            </td>
                            <td>
                              <span className={`qty-badge qty-red ${item.condemned_qty === 0 ? 'qty-zero' : ''}`}>
                                {item.condemned_qty}
                              </span>
                            </td>
                            <td><strong>{total}</strong></td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="table-total-row">
                        <td colSpan={4}><strong>TOTAL INVENTORY</strong></td>
                        <td><strong className="qty-green">{filteredItems.reduce((s, i) => s + i.serviceable_qty, 0)}</strong></td>
                        <td><strong className="qty-amber">{filteredItems.reduce((s, i) => s + i.repairable_qty, 0)}</strong></td>
                        <td><strong className="qty-red">{filteredItems.reduce((s, i) => s + i.condemned_qty, 0)}</strong></td>
                        <td><strong>{filteredItems.reduce((s, i) => s + i.serviceable_qty + i.repairable_qty + i.condemned_qty, 0)}</strong></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 6. SYSTEM SETTINGS CONTROL HUB ────────────────────────── */}
        {activeTab === 'settings' && (
          <div className="tab-content">
            <div className="page-header">
              <div>
                <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Settings size={26} style={{ color: 'var(--csu-green-dark)' }} /> System Settings &amp; Control Hub
                </h2>
                <p className="page-subtitle">Manage equipment specifications, profile photo uploads, borrowing permissions, and catalog registration</p>
              </div>
              <div className="header-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setSettingsTab('add-equipment');
                    setEditingItem(null);
                    setItemForm({ name: '', category: 'Office Equipment', unit_of_measure: 'pcs', serviceable_qty: 1, repairable_qty: 0, condemned_qty: 0, borrowable: true, image_url: '', description: '' });
                  }}
                >
                  <Plus size={15} /> Add New Equipment
                </button>
              </div>
            </div>

            {/* Settings Sub-Tab Navigation Bar */}
            <div className="log-type-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button
                className={`btn ${settingsTab === 'actions' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSettingsTab('actions')}
                style={{ fontWeight: 700 }}
              >
                <Wrench size={16} /> Action Control ({items.length})
              </button>
              <button
                className={`btn ${settingsTab === 'borrowable' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSettingsTab('borrowable')}
                style={{ fontWeight: 700 }}
              >
                <Shield size={16} /> Borrowable Control ({items.filter(i => Boolean(i.borrowable)).length})
              </button>
              <button
                className={`btn ${settingsTab === 'add-equipment' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setSettingsTab('add-equipment');
                  setEditingItem(null);
                  setItemForm({ name: '', category: 'Office Equipment', unit_of_measure: 'pcs', serviceable_qty: 1, repairable_qty: 0, condemned_qty: 0, borrowable: true, image_url: '', description: '' });
                }}
                style={{ fontWeight: 700 }}
              >
                <Plus size={16} /> Add Equipment
              </button>
            </div>

            {/* ── SUB-TAB 1: ACTION CONTROL ───────────────────────────── */}
            {settingsTab === 'actions' && (
              <div>
                {/* Stat Cards Summary Row for Action Control */}
                <div className="stats-grid" style={{ marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-green"><Camera size={22} /></div>
                    <div className="stat-info">
                      <p>With Profile Photo</p>
                      <h3>{items.filter(i => Boolean(i.image_url)).length}</h3>
                      <small>Images uploaded</small>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-amber"><ImageIcon size={22} /></div>
                    <div className="stat-info">
                      <p>Missing Photo</p>
                      <h3>{items.filter(i => !Boolean(i.image_url)).length}</h3>
                      <small>Needs equipment photo</small>
                    </div>
                  </div>
                </div>

                {/* Top Domain Inventory Tabs */}
                <div className="domain-tabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <button
                    className={`btn ${domainFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter(''); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Layers size={15} /> All Inventories ({items.length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Office' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Office'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Building2 size={15} /> Office Inventory ({items.filter(i => i.category.startsWith('Office')).length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Supply' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Supply'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Package size={15} /> Supply Room Inventory ({items.filter(i => i.category.startsWith('Supply')).length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Armory' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Armory'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Shield size={15} /> Armory Inventory ({items.filter(i => i.category.startsWith('Armory')).length})
                  </button>
                </div>

                {/* Sub-Category Tab Bar */}
                <div className="subcategory-tabs-bar">
                  <button
                    className={`subcategory-tab-btn ${categoryFilter === '' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('')}
                  >
                    All {domainFilter ? `${domainFilter}` : ''} Sub-Categories ({items.filter(i => !domainFilter || i.category.startsWith(domainFilter)).length})
                  </button>

                  {categories
                    .filter(c => !domainFilter || c.startsWith(domainFilter))
                    .map(c => {
                      const count = items.filter(i => i.category === c).length;
                      const cleanName = getCleanSubCategoryName(c);
                      return (
                        <button
                          key={c}
                          className={`subcategory-tab-btn ${categoryFilter === c ? 'active' : ''}`}
                          onClick={() => setCategoryFilter(c)}
                        >
                          {cleanName} ({count})
                        </button>
                      );
                    })}
                </div>

                {/* Search Box with Intelligent Assistance */}
                <div className="controls-bar" style={{ marginBottom: '18px' }}>
                  <SearchWithAssistance
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={domainFilter ? `Search ${domainFilter} equipment by name or category...` : "Search all equipment by name or category..."}
                    suggestions={items}
                    categories={['Armory Equipment', 'Office Furniture', 'Supply Room', 'Musical Instrument', 'Uniforms']}
                  />
                </div>

                {/* Dedicated Action Control Table */}
                <div className="section-card">
                  {filteredItems.length === 0 ? (
                    <div className="empty-state">
                      <Wrench size={40} />
                      <p>No equipment found.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="simple-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Equipment Name</th>
                            <th>Category</th>
                            <th>Photo Status</th>
                            <th style={{ textAlign: 'center' }}>Admin Quick Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, idx) => {
                            const isQuickUploading = quickUploadingId === item.id;
                            return (
                              <tr key={item.id}>
                                <td className="row-num">{idx + 1}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {item.image_url ? (
                                      <img src={item.image_url} alt={item.name} className="item-thumb" />
                                    ) : (
                                      <div className="item-thumb-placeholder"><ImageIcon size={18} /></div>
                                    )}
                                    <div>
                                      <strong>{item.name}</strong>
                                      {item.description && <div className="item-desc">{item.description}</div>}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="cat-tag" style={{
                                    background: item.category.startsWith('Office') ? 'rgba(59, 130, 246, 0.12)' : item.category.startsWith('Supply') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                    color: item.category.startsWith('Office') ? '#1d4ed8' : item.category.startsWith('Supply') ? '#047857' : '#b45309',
                                    fontWeight: 700
                                  }}>
                                    {getDomainByCategory(item.category)} · {getCleanSubCategoryName(item.category)}
                                  </span>
                                </td>
                                <td>
                                  {item.image_url ? (
                                    <span className="badge-status badge-returned" style={{ fontSize: '0.78rem' }}>
                                      <CheckCircle2 size={12} /> Photo Set
                                    </span>
                                  ) : (
                                    <span className="badge-status badge-borrowed" style={{ fontSize: '0.78rem', background: 'rgba(245, 158, 11, 0.12)', color: '#b45309' }}>
                                      <ImageIcon size={12} /> No Photo
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div className="action-btns" style={{ justifyContent: 'center' }}>
                                    <label
                                      className={`btn-icon btn-icon-photo ${isQuickUploading ? 'uploading' : ''}`}
                                      title={isQuickUploading ? 'Uploading image...' : item.image_url ? 'Change Photo' : 'Upload Photo'}
                                      style={{ cursor: isQuickUploading ? 'wait' : 'pointer' }}
                                    >
                                      <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        disabled={isQuickUploading}
                                        onChange={e => handleQuickImageUpload(item.id, e.target.files[0])}
                                      />
                                      {isQuickUploading
                                        ? <RefreshCw size={14} className="spin" />
                                        : <Upload size={14} />}
                                    </label>
                                    <button className="btn-icon" title="Edit Equipment Details" onClick={() => openEditItem(item)}><Pencil size={14} /></button>
                                    <button className="btn-icon btn-icon-red" title="Delete Equipment" onClick={() => deleteItem(item)}><Trash2 size={14} /></button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── SUB-TAB 2: BORROWABLE CONTROL ───────────────────────── */}
            {settingsTab === 'borrowable' && (
              <div>
                {/* Stat Cards Summary Row for Borrowable Permissions */}
                <div className="stats-grid" style={{ marginBottom: '20px' }}>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-green"><Shield size={22} /></div>
                    <div className="stat-info">
                      <p>Enabled for Borrowing</p>
                      <h3>{items.filter(i => Boolean(i.borrowable)).length}</h3>
                      <small>Visible in Cadet Portal</small>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon stat-icon-amber"><XCircle size={22} /></div>
                    <div className="stat-info">
                      <p>Disabled / Restricted</p>
                      <h3>{items.filter(i => !Boolean(i.borrowable)).length}</h3>
                      <small>Hidden from cadets</small>
                    </div>
                  </div>
                </div>

                {/* Top Domain Inventory Tabs */}
                <div className="domain-tabs-bar" style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
                  <button
                    className={`btn ${domainFilter === '' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter(''); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Layers size={15} /> All Inventories ({items.length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Office' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Office'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Building2 size={15} /> Office Inventory ({items.filter(i => i.category.startsWith('Office')).length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Supply' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Supply'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Package size={15} /> Supply Room Inventory ({items.filter(i => i.category.startsWith('Supply')).length})
                  </button>

                  <button
                    className={`btn ${domainFilter === 'Armory' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => { setDomainFilter('Armory'); setCategoryFilter(''); }}
                    style={{ fontWeight: 700 }}
                  >
                    <Shield size={15} /> Armory Inventory ({items.filter(i => i.category.startsWith('Armory')).length})
                  </button>
                </div>

                {/* Sub-Category Tab Bar */}
                <div className="subcategory-tabs-bar">
                  <button
                    className={`subcategory-tab-btn ${categoryFilter === '' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('')}
                  >
                    All {domainFilter ? `${domainFilter}` : ''} Sub-Categories ({items.filter(i => !domainFilter || i.category.startsWith(domainFilter)).length})
                  </button>

                  {categories
                    .filter(c => !domainFilter || c.startsWith(domainFilter))
                    .map(c => {
                      const count = items.filter(i => i.category === c).length;
                      const cleanName = getCleanSubCategoryName(c);
                      return (
                        <button
                          key={c}
                          className={`subcategory-tab-btn ${categoryFilter === c ? 'active' : ''}`}
                          onClick={() => setCategoryFilter(c)}
                        >
                          {cleanName} ({count})
                        </button>
                      );
                    })}
                </div>

                {/* Search Box with Intelligent Assistance */}
                <div className="controls-bar" style={{ marginBottom: '18px' }}>
                  <SearchWithAssistance
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={domainFilter ? `Search ${domainFilter} equipment by name or category...` : "Search all equipment by name or category..."}
                    suggestions={items}
                    categories={['Armory Equipment', 'Office Furniture', 'Supply Room', 'Musical Instrument', 'Uniforms']}
                  />
                </div>

                {/* Dedicated Borrow Permission Control Table */}
                <div className="section-card">
                  {filteredItems.length === 0 ? (
                    <div className="empty-state">
                      <Shield size={40} />
                      <p>No equipment found.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="simple-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Equipment Name</th>
                            <th>Category</th>
                            <th style={{ color: '#10b981' }}>Serviceable Stock</th>
                            <th>Borrow Permission Toggle</th>
                            <th>Cadet Portal Visibility</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredItems.map((item, idx) => {
                            const isToggling = togglingId === item.id;
                            const isBorrowable = Boolean(item.borrowable);
                            return (
                              <tr key={item.id}>
                                <td className="row-num">{idx + 1}</td>
                                <td>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    {item.image_url ? (
                                      <img src={item.image_url} alt={item.name} className="item-thumb" />
                                    ) : (
                                      <div className="item-thumb-placeholder"><ImageIcon size={18} /></div>
                                    )}
                                    <div>
                                      <strong>{item.name}</strong>
                                      {item.description && <div className="item-desc">{item.description}</div>}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <span className="cat-tag" style={{
                                    background: item.category.startsWith('Office') ? 'rgba(59, 130, 246, 0.12)' : item.category.startsWith('Supply') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                                    color: item.category.startsWith('Office') ? '#1d4ed8' : item.category.startsWith('Supply') ? '#047857' : '#b45309',
                                    fontWeight: 700
                                  }}>
                                    {getDomainByCategory(item.category)} · {getCleanSubCategoryName(item.category)}
                                  </span>
                                </td>
                                <td>
                                  <span className="qty-badge qty-green">
                                    {item.serviceable_qty} {item.unit_of_measure}
                                  </span>
                                </td>
                                <td>
                                  <button
                                    className={`borrowable-toggle ${isBorrowable ? 'borrowable-on' : 'borrowable-off'}`}
                                    onClick={() => toggleBorrowable(item)}
                                    disabled={isToggling}
                                    title={isBorrowable ? 'Click to disable borrowing in Cadet Portal' : 'Click to enable borrowing in Cadet Portal'}
                                  >
                                    {isToggling ? (
                                      <RefreshCw size={11} className="spin" />
                                    ) : isBorrowable ? (
                                      <>
                                        <span className="toggle-dot" />
                                        <span>Enabled</span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="toggle-dot" />
                                        <span>Disabled</span>
                                      </>
                                    )}
                                  </button>
                                </td>
                                <td>
                                  {isBorrowable ? (
                                    <span className="badge-status badge-returned" style={{ fontSize: '0.78rem' }}>
                                      <CheckCircle2 size={12} /> Available to Borrow in Portal
                                    </span>
                                  ) : (
                                    <span className="badge-status badge-overdue" style={{ fontSize: '0.78rem', background: 'rgba(100, 116, 139, 0.12)', color: '#475569' }}>
                                      <XCircle size={12} /> Hidden from Cadets
                                    </span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── SUB-TAB 3: ADD NEW EQUIPMENT ───────────────────────── */}
            {settingsTab === 'add-equipment' && (
              <div className="register-form-full-width">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '14px' }}>
                  <div style={{ background: 'rgba(0, 77, 37, 0.12)', color: 'var(--csu-green-dark)', padding: '10px', borderRadius: '12px', display: 'flex' }}>
                    <Plus size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--csu-green-dark)' }}>Register New Equipment Catalog Item</h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>Add new equipment details, starting quantities, and borrowable status to inventory</p>
                  </div>
                </div>

                <form onSubmit={e => { e.preventDefault(); saveItem(); }}>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Equipment Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Base Drum, M16 Rifle, Desk Chair"
                      value={itemForm.name}
                      onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-row" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Inventory Domain &amp; Sub-Category *</label>
                      <select
                        className="form-input"
                        value={itemForm.category}
                        onChange={e => setItemForm({ ...itemForm, category: e.target.value })}
                      >
                        <optgroup label="🏢 Office Inventory">
                          <option value="Office Equipment">Office Equipment</option>
                          <option value="Office Furniture">Office Furniture</option>
                          <option value="Office Flags">Office Flags &amp; Decorations</option>
                        </optgroup>
                        <optgroup label="📦 Supply Room Inventory">
                          <option value="Supply Room Equipment">Supply Room Equipment</option>
                          <option value="Supply Kitchenware">Supply Kitchenware</option>
                          <option value="Supply Tools">Supply Maintenance Tools</option>
                          <option value="Supply Uniforms">Supply Uniforms &amp; Boots</option>
                        </optgroup>
                        <optgroup label="⚔️ Armory Inventory">
                          <option value="Armory Equipment">Armory Equipment</option>
                          <option value="Armory Rifles">Armory Training Rifles</option>
                          <option value="Armory Musical Instruments">Armory Marching Band Instruments</option>
                        </optgroup>
                      </select>
                    </div>

                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Unit of Measure *</label>
                      <select
                        className="form-input"
                        value={itemForm.unit_of_measure}
                        onChange={e => setItemForm({ ...itemForm, unit_of_measure: e.target.value })}
                      >
                        <option value="pcs">Pieces (pcs)</option>
                        <option value="sets">Sets</option>
                        <option value="pairs">Pairs</option>
                        <option value="units">Units</option>
                        <option value="boxes">Boxes</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row" style={{ marginBottom: '16px' }}>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#10b981' }}>Serviceable Qty *</label>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={itemForm.serviceable_qty}
                        onChange={e => setItemForm({ ...itemForm, serviceable_qty: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f59e0b' }}>Repairable Qty</label>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={itemForm.repairable_qty}
                        onChange={e => setItemForm({ ...itemForm, repairable_qty: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                    <div className="form-group">
                      <label style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ef4444' }}>Condemned Qty</label>
                      <input
                        type="number"
                        min="0"
                        className="form-input"
                        value={itemForm.condemned_qty}
                        onChange={e => setItemForm({ ...itemForm, condemned_qty: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Cadet Borrowing Permission</label>
                    <div style={{ display: 'flex', gap: '16px', marginTop: '6px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="borrowable"
                          checked={Boolean(itemForm.borrowable)}
                          onChange={() => setItemForm({ ...itemForm, borrowable: true })}
                        />
                        <span style={{ color: '#10b981' }}>🟢 Enabled (Cadets can borrow in Cadet Portal)</span>
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
                        <input
                          type="radio"
                          name="borrowable"
                          checked={!Boolean(itemForm.borrowable)}
                          onChange={() => setItemForm({ ...itemForm, borrowable: false })}
                        />
                        <span style={{ color: '#64748b' }}>🔴 Restricted (Hidden from cadets)</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label style={{ fontWeight: 700, fontSize: '0.85rem' }}>Description &amp; Specifications</label>
                    <textarea
                      rows={3}
                      className="form-input"
                      placeholder="Enter detailed equipment description, serial number details or condition notes..."
                      value={itemForm.description}
                      onChange={e => setItemForm({ ...itemForm, description: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 24px', fontWeight: 700 }}>
                      <Plus size={16} /> Save Equipment to Inventory
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        {activeTab === 'borrowings' && (
          <div className="tab-content">
            <div className="page-header">
              <div>
                <h2 className="page-title">Active Borrow Log</h2>
                <p className="page-subtitle">{activeBorrowCount} active item(s) currently checked out by cadets</p>
            </div>
            </div>

            {/* Log View Quick Tabs */}
            <div className="log-type-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button className="btn btn-primary" onClick={() => setActiveTab('borrowings')}>
                <LogOut size={15} /> Active Borrow Log ({activeBorrowCount})
              </button>
              <button className="btn btn-secondary" onClick={() => { setActiveTab('returns'); setSearchQuery(''); setReturnConditionFilter(''); }}>
                <RotateCcw size={15} /> Return History Log ({returnedBorrowCount})
              </button>
            </div>

            {/* Sub-Filter Tab Bar for Borrow Status */}
            <div className="subcategory-tabs-bar">
              <button
                className={`subcategory-tab-btn ${borrowStatusFilter === '' ? 'active' : ''}`}
                onClick={() => setBorrowStatusFilter('')}
              >
                All Active Borrows ({activeBorrowings.length})
              </button>
              <button
                className={`subcategory-tab-btn ${borrowStatusFilter === 'Active' ? 'active' : ''}`}
                onClick={() => setBorrowStatusFilter('Active')}
              >
                🟢 Active (On Schedule) ({activeBorrowings.filter(b => !b.is_overdue).length})
              </button>
              <button
                className={`subcategory-tab-btn ${borrowStatusFilter === 'Overdue' ? 'active' : ''}`}
                onClick={() => setBorrowStatusFilter('Overdue')}
              >
                🔴 Overdue Only ({activeBorrowings.filter(b => b.is_overdue).length})
              </button>
            </div>

            {/* Search Box with Intelligent Assistance */}
            <div className="controls-bar" style={{ marginBottom: '18px' }}>
              <SearchWithAssistance
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search active borrowings by cadet name, ID or equipment..."
                suggestions={activeBorrowings.map(b => ({ id: b.id, name: b.borrower_name, category: b.item_name }))}
                categories={['Active Borrows', 'Overdue Borrows', 'Armory Items', 'Office Items']}
              />
            </div>

            <div className="section-card">
              {filteredActiveBorrowings.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={40} />
                  <p>No active borrowings found.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Equipment</th>
                        <th>Qty</th>
                        <th>Cadet / Borrower</th>
                        <th>Checkout Timestamp</th>
                        <th>Expected Return</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredActiveBorrowings.map((b, idx) => {
                        const isOverdue = b.is_overdue;
                        return (
                          <tr key={b.id} className={isOverdue ? 'row-overdue' : ''}>
                            <td className="row-num">{idx + 1}</td>
                            <td>
                              <strong>{b.item_name}</strong>
                              <div className="item-desc">{b.item_category}</div>
                            </td>
                            <td><strong>{b.quantity}</strong> {b.unit_of_measure}</td>
                            <td>
                              <strong>{b.borrower_name}</strong>
                              <div className="item-desc">ID: {b.borrower_id}{b.borrower_contact ? ` · ${b.borrower_contact}` : ''}</div>
                            </td>
                            <td style={{ fontSize: '0.83rem' }}>
                              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                {new Date(b.checkout_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                <Clock size={11} />
                                {new Date(b.checkout_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                              </div>
                            </td>
                            <td className={`text-muted ${isOverdue ? 'text-red' : ''}`} style={{ fontSize: '0.83rem' }}>{new Date(b.expected_return_date).toLocaleDateString()}</td>
                            <td>
                              {isOverdue
                                ? <span className="badge-status badge-overdue"><AlertTriangle size={11} /> Overdue</span>
                                : <span className="badge-status badge-active"><LogOut size={11} /> Active</span>
                              }
                            </td>
                            <td>
                              <button className="btn btn-secondary btn-sm" onClick={() => openReturn(b)}>
                                Process Return
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── RETURN HISTORY LOG TAB ──────────────────────────────────── */}
        {activeTab === 'returns' && (
          <div className="tab-content">
            <div className="page-header">
              <div>
                <h2 className="page-title">Return History Log</h2>
                <p className="page-subtitle">{returnedBorrowCount} completed return record(s) archived</p>
            </div>
            </div>

            {/* Log View Quick Tabs */}
            <div className="log-type-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
              <button className="btn btn-secondary" onClick={() => { setActiveTab('borrowings'); setSearchQuery(''); setBorrowStatusFilter(''); }}>
                <LogOut size={15} /> Active Borrow Log ({activeBorrowCount})
              </button>
              <button className="btn btn-primary" onClick={() => setActiveTab('returns')}>
                <RotateCcw size={15} /> Return History Log ({returnedBorrowCount})
              </button>
            </div>

            {/* Sub-Filter Tab Bar for Return Condition */}
            <div className="subcategory-tabs-bar">
              <button
                className={`subcategory-tab-btn ${returnConditionFilter === '' ? 'active' : ''}`}
                onClick={() => setReturnConditionFilter('')}
              >
                All Return Conditions ({returnedBorrowings.length})
              </button>
              <button
                className={`subcategory-tab-btn ${returnConditionFilter === 'Good' ? 'active' : ''}`}
                onClick={() => setReturnConditionFilter('Good')}
              >
                🟢 Good Condition ({returnedBorrowings.filter(r => r.return_condition === 'Good').length})
              </button>
              <button
                className={`subcategory-tab-btn ${returnConditionFilter === 'Damaged' ? 'active' : ''}`}
                onClick={() => setReturnConditionFilter('Damaged')}
              >
                ⚠️ Damaged ({returnedBorrowings.filter(r => r.return_condition === 'Damaged').length})
              </button>
              <button
                className={`subcategory-tab-btn ${returnConditionFilter === 'Lost' ? 'active' : ''}`}
                onClick={() => setReturnConditionFilter('Lost')}
              >
                ❌ Lost ({returnedBorrowings.filter(r => r.return_condition === 'Lost').length})
              </button>
            </div>

            {/* Search Box with Intelligent Assistance */}
            <div className="controls-bar" style={{ marginBottom: '18px' }}>
              <SearchWithAssistance
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search return history by cadet name, ID or equipment..."
                suggestions={returnedBorrowings.map(r => ({ id: r.id, name: r.borrower_name, category: r.item_name }))}
                categories={['Good Condition', 'Damaged', 'Lost', 'Base Drum', 'Armory Equipment']}
              />
            </div>

            <div className="section-card">
              {filteredReturns.length === 0 ? (
                <div className="empty-state">
                  <RotateCcw size={40} />
                  <p>No return records found.</p>
                  <small>Returned items will appear here automatically with their return condition and exact return timestamp.</small>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="simple-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Equipment</th>
                        <th>Qty</th>
                        <th>Cadet / Borrower</th>
                        <th>Checkout Timestamp</th>
                        <th>Actual Return Timestamp</th>
                        <th>Condition</th>
                        <th>Notes &amp; Handled By</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReturns.map((b, idx) => (
                        <tr key={b.id}>
                          <td className="row-num">{idx + 1}</td>
                          <td>
                            <strong>{b.item_name}</strong>
                            <div className="item-desc">{b.item_category}</div>
                          </td>
                          <td><strong>{b.quantity}</strong> {b.unit_of_measure}</td>
                          <td>
                            <strong>{b.borrower_name}</strong>
                            <div className="item-desc">ID: {b.borrower_id}{b.borrower_contact ? ` · ${b.borrower_contact}` : ''}</div>
                          </td>
                          <td style={{ fontSize: '0.83rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {new Date(b.checkout_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Clock size={11} />
                              {new Date(b.checkout_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </div>
                          </td>
                          <td style={{ fontSize: '0.83rem' }}>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                              {new Date(b.actual_return_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                              <Clock size={11} />
                              {new Date(b.actual_return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                            </div>
                          </td>
                          <td>
                            {b.return_condition === 'Good' && <span className="badge-status badge-returned"><CheckCircle2 size={11} /> Good</span>}
                            {b.return_condition === 'Damaged' && <span className="badge-status" style={{ background: 'rgba(245,158,11,0.15)', color: '#d97706' }}><Wrench size={11} /> Damaged</span>}
                            {b.return_condition === 'Lost' && <span className="badge-status badge-overdue"><XCircle size={11} /> Lost</span>}
                          </td>
                          <td style={{ fontSize: '0.8rem' }}>
                            {b.return_notes ? <div style={{ fontWeight: 500 }}>{b.return_notes}</div> : null}
                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>By: {b.handled_by || 'Supply Officer'}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── CADET ID GENERATOR TAB ─────────────────────────────────── */}
        {activeTab === 'id-generator' && (
          <div className="tab-content">
            <CadetIdGenerator />
          </div>
        )}
      </main>

      {/* ── ITEM MODAL ─────────────────────────────────────────────────── */}
      {showItemModal && (
        <div className="modal-overlay modal-animated-backdrop" onClick={() => setShowItemModal(false)}>
          <div className="modal modal-large modal-animated-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title-text">{editingItem ? 'Edit Equipment' : 'Add Equipment'}</h3>
                <p className="modal-subtitle-text">Manage catalog details, profile photo, stock breakdown &amp; borrowing availability</p>
              </div>
              <button className="modal-close" onClick={() => setShowItemModal(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body custom-scrollbar-body">
              {errorMessage && <div className="error-banner"><AlertTriangle size={14} /> {errorMessage}</div>}

              <div className="modal-grid-2col">
                {/* LEFT COLUMN: Basic Information */}
                <div className="modal-col">
                  <div className="form-group">
                    <label className="form-label">Equipment Name *</label>
                    <input className="form-input" value={itemForm.name} onChange={e => setItemForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Rifle (M16 / Garand Drill)" />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select className="form-input" value={itemForm.category} onChange={e => setItemForm(p => ({ ...p, category: e.target.value }))}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Unit of Measure</label>
                      <select className="form-input" value={itemForm.unit_of_measure} onChange={e => setItemForm(p => ({ ...p, unit_of_measure: e.target.value }))}>
                        {['pcs', 'pairs', 'sets', 'packs', 'boxes', 'sheets', 'copies', 'pads', 'bundles', 'files'].map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Description &amp; Specifications</label>
                    <textarea className="form-input form-textarea" rows={5} value={itemForm.description} onChange={e => setItemForm(p => ({ ...p, description: e.target.value }))} placeholder="Enter equipment specifications, serial details, or condition notes..." />
                  </div>
                </div>

                {/* RIGHT COLUMN: Photo, Borrowable Toggle, Quantities */}
                <div className="modal-col">
                  <div className="form-group">
                    <label className="form-label">Equipment Profile Image</label>
                    <div className="image-upload-card">
                      {itemForm.image_url ? (
                        <div className="image-preview-wrap-lg">
                          <img src={itemForm.image_url} alt="Equipment Profile" className="image-preview-lg" />
                          <div className="image-overlay-actions">
                            <label className="btn btn-secondary btn-xs">
                              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                              <Upload size={12} /> {uploadingImage ? 'Uploading...' : 'Change Photo'}
                            </label>
                            <button
                              type="button"
                              className="btn btn-danger btn-xs"
                              onClick={() => setItemForm(p => ({ ...p, image_url: '' }))}
                            >
                              <Trash2 size={12} /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="upload-dropzone-enhanced">
                          <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                          <div className="dropzone-icon-circle">
                            {uploadingImage ? <RefreshCw size={22} className="spin" /> : <Upload size={22} />}
                          </div>
                          <span className="dropzone-title">{uploadingImage ? 'Uploading Image...' : 'Click to Upload Equipment Photo'}</span>
                          <small className="dropzone-sub">PNG, JPG, WEBP up to 5MB</small>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Interactive Toggle Switch for Borrowable Status */}
                  <div className="form-group availability-toggle-card">
                    <div className="toggle-switch-wrap" onClick={() => setItemForm(p => ({ ...p, borrowable: !p.borrowable }))}>
                      <div className={`custom-toggle-switch ${Boolean(itemForm.borrowable) ? 'active' : ''}`}>
                        <div className="toggle-handle" />
                      </div>
                      <div>
                        <strong className="toggle-label-title">Available for Borrowing</strong>
                        <small className="toggle-label-sub">
                          {Boolean(itemForm.borrowable) ? '🟢 Active in Cadet Portal for request' : '🔴 Hidden from Cadets in Portal'}
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* Stock Quantities Grid */}
                  <div className="quantities-grid-box">
                    <div className="form-group qty-group-green">
                      <label className="qty-label-green">Serviceable Qty</label>
                      <input className="form-input qty-input-green" type="number" min="0" value={itemForm.serviceable_qty} onChange={e => setItemForm(p => ({ ...p, serviceable_qty: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div className="form-group qty-group-amber">
                      <label className="qty-label-amber">Repairable Qty</label>
                      <input className="form-input qty-input-amber" type="number" min="0" value={itemForm.repairable_qty} onChange={e => setItemForm(p => ({ ...p, repairable_qty: parseInt(e.target.value) || 0 }))} />
                    </div>
                    <div className="form-group qty-group-red">
                      <label className="qty-label-red">Condemned Qty</label>
                      <input className="form-input qty-input-red" type="number" min="0" value={itemForm.condemned_qty} onChange={e => setItemForm(p => ({ ...p, condemned_qty: parseInt(e.target.value) || 0 }))} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowItemModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveItem}>
                <CheckCircle2 size={16} /> {editingItem ? 'Save Changes' : 'Add Equipment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── CHECKOUT MODAL ─────────────────────────────────────────────── */}
      {showCheckoutModal && (
        <div className="modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><LogOut size={18} /> Check Out Equipment</h3>
              <button className="modal-close" onClick={() => setShowCheckoutModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {errorMessage && <div className="error-banner"><AlertTriangle size={14} /> {errorMessage}</div>}
              <div className="form-row">
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Equipment *</label>
                  <select className="form-input" value={checkoutForm.item_id} onChange={e => setCheckoutForm(p => ({ ...p, item_id: e.target.value }))}>
                    {items.filter(i => i.serviceable_qty > 0 && Boolean(i.borrowable)).map(i => (
                      <option key={i.id} value={i.id}>{i.name} — {i.serviceable_qty} serviceable {i.unit_of_measure}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity *</label>
                  <input className="form-input" type="number" min="1" value={checkoutForm.quantity} onChange={e => setCheckoutForm(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cadet Full Name *</label>
                  <input className="form-input" value={checkoutForm.borrower_name} onChange={e => setCheckoutForm(p => ({ ...p, borrower_name: e.target.value }))} placeholder="Full name" />
                </div>
                <div className="form-group">
                  <label>Cadet ID *</label>
                  <input className="form-input" value={checkoutForm.borrower_id} onChange={e => setCheckoutForm(p => ({ ...p, borrower_id: e.target.value }))} placeholder="Cadet ID number" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Number</label>
                  <input className="form-input" value={checkoutForm.borrower_contact} onChange={e => setCheckoutForm(p => ({ ...p, borrower_contact: e.target.value }))} placeholder="Phone number" />
                </div>
                <div className="form-group">
                  <label>Expected Return Date *</label>
                  <input className="form-input" type="date" value={checkoutForm.expected_return_date} onChange={e => setCheckoutForm(p => ({ ...p, expected_return_date: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea className="form-input" rows={2} value={checkoutForm.checkout_notes} onChange={e => setCheckoutForm(p => ({ ...p, checkout_notes: e.target.value }))} placeholder="Optional notes..." />
              </div>
              <div className="form-group">
                <label>Handled By</label>
                <input className="form-input" value={checkoutForm.handled_by} onChange={e => setCheckoutForm(p => ({ ...p, handled_by: e.target.value }))} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitCheckout}><LogOut size={14} /> Confirm Check Out</button>
            </div>
          </div>
        </div>
      )}

      {/* ── RETURN MODAL ───────────────────────────────────────────────── */}
      {showReturnModal && returningBorrow && (
        <div className="modal-overlay" onClick={() => setShowReturnModal(false)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3><LogIn size={18} /> Return Equipment</h3>
              <button className="modal-close" onClick={() => setShowReturnModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {errorMessage && <div className="error-banner"><AlertTriangle size={14} /> {errorMessage}</div>}
              <div className="return-info">
                <p><strong>{returningBorrow.item_name}</strong> · {returningBorrow.quantity} {returningBorrow.unit_of_measure}</p>
                <p className="text-muted">Borrowed by: {returningBorrow.borrower_name} ({returningBorrow.borrower_id})</p>
              </div>
              <div className="form-group">
                <label>Return Condition *</label>
                <div className="condition-options">
                  {['Good', 'Damaged', 'Lost'].map(cond => (
                    <label key={cond} className={`condition-opt ${returnForm.return_condition === cond ? 'selected' : ''}`}>
                      <input type="radio" name="return_condition" value={cond} checked={returnForm.return_condition === cond} onChange={() => setReturnForm(p => ({ ...p, return_condition: cond }))} />
                      {cond === 'Good' ? <CheckCircle2 size={14} /> : cond === 'Damaged' ? <Wrench size={14} /> : <XCircle size={14} />}
                      {cond}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Return Notes</label>
                <textarea className="form-input" rows={2} value={returnForm.return_notes} onChange={e => setReturnForm(p => ({ ...p, return_notes: e.target.value }))} placeholder="Optional notes..." />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={submitReturn}><LogIn size={14} /> Confirm Return</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
