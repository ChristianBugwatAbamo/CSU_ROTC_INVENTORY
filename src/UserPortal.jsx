import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  QrCode,
  Camera,
  CameraOff,
  User,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  LogOut,
  LogIn,
  ArrowLeft,
  RefreshCw,
  X,
  Shield,
  Wrench,
  ChevronRight,
  CreditCard,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';

const API_BASE = '/api/inventory';
const CSU_ROTC_LOGO = '/csu-rotc-logo.png';

// ─── Parse QR Code content ────────────────────────────────────────────────────
// Supports: plain ID string, JSON {id, name}, or URL with ?id= param
function parseQRCode(raw) {
  const text = raw.trim();
  // Try JSON
  try {
    const obj = JSON.parse(text);
    return {
      borrower_id: String(obj.id || obj.studentId || obj.cadetId || obj.ID || '').trim(),
      borrower_name: String(obj.name || obj.fullName || obj.cadetName || '').trim(),
    };
  } catch (_) {}
  // Try URL query param
  try {
    const url = new URL(text);
    const id = url.searchParams.get('id') || url.searchParams.get('studentId') || url.searchParams.get('cadetId');
    const name = url.searchParams.get('name') || url.searchParams.get('fullName') || '';
    if (id) return { borrower_id: id.trim(), borrower_name: name.trim() };
  } catch (_) {}
  // Plain text = the ID itself
  return { borrower_id: text, borrower_name: '' };
}

// ─── QR Scanner Component ─────────────────────────────────────────────────────
function QRScanner({ onScan, onClose }) {
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const [error, setError] = useState('');
  const [scanning, setScanning] = useState(false);
  const instanceId = 'qr-reader-portal';

  useEffect(() => {
    let scanner = null;

    const start = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        scanner = new Html5Qrcode(instanceId);
        html5QrRef.current = scanner;

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decodedText) => {
            scanner.stop().catch(() => {});
            onScan(decodedText);
          },
          () => {}
        );
        setScanning(true);
      } catch (err) {
        setError('Camera access denied or unavailable. Please allow camera permission and try again.');
      }
    };

    start();

    return () => {
      if (html5QrRef.current) {
        html5QrRef.current.stop().catch(() => {});
      }
    };
  }, [onScan]);

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={e => e.stopPropagation()}>
        <div className="qr-modal-header">
          <QrCode size={20} />
          <span>Scan Your ID QR Code</span>
          <button className="qr-close-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="qr-viewfinder-wrap">
          <div id={instanceId} ref={scannerRef} className="qr-viewfinder" />
          {!scanning && !error && (
            <div className="qr-loading">
              <RefreshCw size={24} className="spin" />
              <span>Starting camera...</span>
            </div>
          )}
          {error && (
            <div className="qr-error">
              <CameraOff size={28} />
              <p>{error}</p>
            </div>
          )}
          {scanning && (
            <div className="qr-aim-overlay">
              <div className="qr-aim-box" />
            </div>
          )}
        </div>

        <p className="qr-hint">Point your camera at the QR code on your CSU ROTC ID card</p>
        <button className="portal-btn portal-btn-outline" onClick={onClose}>
          <X size={16} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Intelligent Search Assistance Component ─────────────────────────────
function SearchWithAssistance({ value, onChange, placeholder, suggestions = [], categories = [] }) {
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);

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
      <div className="search-box" style={{ width: '100%', background: '#ffffff', border: '1px solid rgba(0,77,37,0.18)', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Search size={16} className="search-icon" style={{ color: 'var(--csu-green)' }} />
        <input
          type="text"
          placeholder={placeholder || "Type to search..."}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          style={{ fontSize: '0.9rem' }}
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

// ─── Main User Portal ─────────────────────────────────────────────────────────
export default function UserPortal({ onBack }) {
  const [step, setStep] = useState('scan'); // 'scan' | 'portal'
  const [showScanner, setShowScanner] = useState(false);
  const [cadet, setCadet] = useState(null); // { borrower_id, borrower_name }
  const [myBorrowings, setMyBorrowings] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [tab, setTab] = useState('borrow'); // 'borrow' | 'myborrow'
  const [portalDomain, setPortalDomain] = useState(''); // '' | 'Office' | 'Supply' | 'Armory'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  // Realtime clock
  const [realtime, setRealtime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setRealtime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Borrow modal
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [borrowQty, setBorrowQty] = useState(1);
  const [expectedDate, setExpectedDate] = useState('');
  const [borrowNotes, setBorrowNotes] = useState('');

  // Return modal
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningBorrow, setReturningBorrow] = useState(null);
  const [returnCondition, setReturnCondition] = useState('Good');
  const [returnNotes, setReturnNotes] = useState('');

  // ─── QR Scan Handler ────────────────────────────────────────────────────────
  const handleQRScan = useCallback((rawText) => {
    setShowScanner(false);
    const parsed = parseQRCode(rawText);
    if (!parsed.borrower_id) {
      setMessage({ type: 'error', text: 'Could not read ID from QR code. Please try again.' });
      return;
    }
    setCadet(parsed);
    setStep('portal');
  }, []);

  // ─── Load Data ──────────────────────────────────────────────────────────────
  const loadPortalData = useCallback(async () => {
    if (!cadet) return;
    setLoading(true);
    try {
      const [itemsRes, myBorrowRes] = await Promise.all([
        fetch(`${API_BASE}/items`),
        fetch(`${API_BASE}/borrowings/by-cadet/${encodeURIComponent(cadet.borrower_id)}`),
      ]);
      const [itemsData, myBorrowData] = await Promise.all([itemsRes.json(), myBorrowRes.json()]);
      setAllItems(Array.isArray(itemsData) ? itemsData.filter(i => i.serviceable_qty > 0 && Boolean(i.borrowable)) : []);
      setMyBorrowings(Array.isArray(myBorrowData) ? myBorrowData : []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load data. Please try again.' });
    } finally {
      setLoading(false);
    }
  }, [cadet]);

  useEffect(() => {
    if (step === 'portal') loadPortalData();
  }, [step, loadPortalData]);

  // ─── Borrow ─────────────────────────────────────────────────────────────────
  const openBorrow = (item) => {
    setSelectedItem(item);
    setBorrowQty(1);
    const next = new Date();
    next.setDate(next.getDate() + 7);
    setExpectedDate(next.toISOString().split('T')[0]);
    setBorrowNotes('');
    setMessage(null);
    setShowBorrowModal(true);
  };

  const submitBorrow = async () => {
    if (!expectedDate) { setMessage({ type: 'error', text: 'Please select a return date.' }); return; }
    if (borrowQty < 1 || borrowQty > selectedItem.serviceable_qty) {
      setMessage({ type: 'error', text: `Quantity must be between 1 and ${selectedItem.serviceable_qty}.` });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/borrowings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: selectedItem.id,
          quantity: borrowQty,
          borrower_name: cadet.borrower_name || cadet.borrower_id,
          borrower_id: cadet.borrower_id,
          expected_return_date: expectedDate,
          checkout_notes: borrowNotes,
          handled_by: cadet.borrower_name || cadet.borrower_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || data.error || 'Checkout failed.' });
      } else {
        setShowBorrowModal(false);
        setMessage({ type: 'success', text: `Successfully borrowed ${borrowQty} ${selectedItem.unit_of_measure} of "${selectedItem.name}".` });
        setTab('myborrow');
        loadPortalData();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // ─── Return ─────────────────────────────────────────────────────────────────
  const openReturn = (borrow) => {
    setReturningBorrow(borrow);
    setReturnCondition('Good');
    setReturnNotes('');
    setMessage(null);
    setShowReturnModal(true);
  };

  const submitReturn = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/borrowings/${returningBorrow.id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          return_condition: returnCondition,
          return_notes: returnNotes,
          handled_by: cadet.borrower_name || cadet.borrower_id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: 'error', text: data.message || data.error || 'Return failed.' });
      } else {
        setShowReturnModal(false);
        setMessage({ type: 'success', text: `"${returningBorrow.item_name}" returned successfully.` });
        loadPortalData();
      }
    } catch {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const activeCount = myBorrowings.filter(b => b.status === 'Active').length;
  const overdueCount = myBorrowings.filter(b => b.is_overdue).length;

  const formattedTime = realtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = realtime.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  // ─── SCAN STEP ───────────────────────────────────────────────────────────────
  if (step === 'scan') {
    return (
      <div className="portal-page">
        {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}
        <div className="portal-scan-wrap">
          <button className="portal-back-btn" onClick={onBack}>
            <ArrowLeft size={16} /> Back to Home
          </button>
          <div className="portal-scan-card">
            <img src={CSU_ROTC_LOGO} alt="CSU ROTC" className="portal-logo" />
            <h1 className="portal-scan-title">Cadet Portal</h1>
            <p className="portal-scan-sub">Scan your CSU ROTC ID card to borrow or return equipment</p>

            {message && (
              <div className={`portal-message ${message.type}`}>
                {message.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                {message.text}
              </div>
            )}

            <button className="portal-scan-btn pulse-anim" onClick={() => { setMessage(null); setShowScanner(true); }}>
              <Camera size={26} />
              <span>Scan ID QR Code</span>
            </button>

            <div className="portal-divider"><span>or enter manually</span></div>

            <ManualEntryForm onSubmit={(id, name) => {
              setCadet({ borrower_id: id, borrower_name: name });
              setStep('portal');
            }} />
          </div>
        </div>
      </div>
    );
  }

  // ─── PORTAL STEP ─────────────────────────────────────────────────────────────
  return (
    <div className="portal-page">
      {showScanner && <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />}

      {/* Header */}
      <header className="portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="portal-back-btn portal-back-sm" onClick={onBack}>
            <ArrowLeft size={16} />
          </button>
          <div className="portal-header-logo">
            <img src={CSU_ROTC_LOGO} alt="CSU ROTC" />
            <span>CSU ROTC Equipment Portal</span>
          </div>
        </div>

        <div className="portal-header-right">
          {/* Realtime Clock */}
          <div className="portal-realtime-clock" title="System Realtime Clock">
            <Clock size={15} className="portal-clock-icon" />
            <div className="portal-clock-text">
              <span className="portal-clock-time">{formattedTime}</span>
              <span className="portal-clock-date">{formattedDate}</span>
            </div>
          </div>

          {/* Cadet Badge */}
          <div className="portal-cadet-badge">
            <div className="portal-cadet-avatar"><User size={18} /></div>
            <div className="portal-cadet-info">
              <span className="portal-cadet-name">{cadet?.borrower_name || 'Cadet'}</span>
              <span className="portal-cadet-id">ID: {cadet?.borrower_id}</span>
            </div>
            <button className="portal-rescan-btn" onClick={() => setShowScanner(true)} title="Re-scan ID">
              <QrCode size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Alerts */}
      {overdueCount > 0 && (
        <div className="portal-alert-bar">
          <AlertTriangle size={16} />
          You have {overdueCount} overdue return{overdueCount > 1 ? 's' : ''}. Please return them immediately.
        </div>
      )}

      {message && (
        <div className={`portal-message-bar ${message.type}`}>
          {message.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle2 size={15} />}
          {message.text}
          <button onClick={() => setMessage(null)}><X size={14} /></button>
        </div>
      )}

      {/* Tabs */}
      <div className="portal-tabs">
        <button
          className={`portal-tab ${tab === 'borrow' ? 'active' : ''}`}
          onClick={() => setTab('borrow')}
        >
          <Package size={17} />
          Borrow Equipment
          <span className="portal-tab-count">{allItems.length}</span>
        </button>
        <button
          className={`portal-tab ${tab === 'myborrow' ? 'active' : ''}`}
          onClick={() => setTab('myborrow')}
        >
          <ClipboardListIcon size={17} />
          My Borrowings
          {activeCount > 0 && <span className="portal-tab-badge">{activeCount}</span>}
        </button>
      </div>

      <div className="portal-body">
        {loading && (
          <div className="portal-loading">
            <RefreshCw size={22} className="spin" />
            <span>Loading...</span>
          </div>
        )}

        {/* ── BORROW EQUIPMENT ─────────────────────────────────────────────── */}
        {tab === 'borrow' && !loading && (
          <div>
            {/* Domain Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
              <button
                className={`portal-filter-pill ${portalDomain === '' ? 'active' : ''}`}
                onClick={() => setPortalDomain('')}
              >
                All Inventories ({allItems.length})
              </button>
              <button
                className={`portal-filter-pill ${portalDomain === 'Office' ? 'active' : ''}`}
                onClick={() => setPortalDomain('Office')}
              >
                🏢 Office Inventory ({allItems.filter(i => i.category.startsWith('Office')).length})
              </button>
              <button
                className={`portal-filter-pill ${portalDomain === 'Supply' ? 'active' : ''}`}
                onClick={() => setPortalDomain('Supply')}
              >
                📦 Supply Room Inventory ({allItems.filter(i => i.category.startsWith('Supply')).length})
              </button>
              <button
                className={`portal-filter-pill ${portalDomain === 'Armory' ? 'active' : ''}`}
                onClick={() => setPortalDomain('Armory')}
              >
                ⚔️ Armory Inventory ({allItems.filter(i => i.category.startsWith('Armory')).length})
              </button>
            </div>

            {/* Search Box with Intelligent Assistance */}
            <div style={{ marginBottom: '20px' }}>
              <SearchWithAssistance
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={portalDomain ? `Search ${portalDomain} equipment by name, category or description...` : "Search all equipment available to borrow..."}
                suggestions={allItems}
                categories={['Armory Equipment', 'Office Furniture', 'Supply Room', 'Musical Instrument', 'Uniforms']}
              />
            </div>

            <div className="portal-items-grid">
              {allItems.filter(i => {
                const matchesDomain = !portalDomain || i.category.startsWith(portalDomain);
                const q = searchQuery.toLowerCase().trim();
                const matchesSearch = !q ||
                  i.name.toLowerCase().includes(q) ||
                  i.category.toLowerCase().includes(q) ||
                  (i.description && i.description.toLowerCase().includes(q));
                return matchesDomain && matchesSearch;
              }).length === 0 ? (
                <div className="portal-empty">
                  <Package size={36} />
                  <p>No equipment matching "{searchQuery}" available{portalDomain ? ` in ${portalDomain} Inventory` : ''}.</p>
                </div>
              ) : (
                allItems.filter(i => {
                  const matchesDomain = !portalDomain || i.category.startsWith(portalDomain);
                  const q = searchQuery.toLowerCase().trim();
                  const matchesSearch = !q ||
                    i.name.toLowerCase().includes(q) ||
                    i.category.toLowerCase().includes(q) ||
                    (i.description && i.description.toLowerCase().includes(q));
                  return matchesDomain && matchesSearch;
                }).map(item => (
                <div key={item.id} className="portal-item-card">
                  {/* Equipment Image — shown prominently as visual description */}
                  <div className="portal-item-img-wrap">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="portal-item-img" />
                    ) : (
                      <div className="portal-item-no-img">
                        <Package size={28} style={{ color: 'rgba(0,77,37,0.25)' }} />
                        <span>No photo</span>
                      </div>
                    )}
                  </div>
                  <div className="portal-item-cat">{item.category}</div>
                  <div className="portal-item-name">{item.name}</div>
                  {/* Equipment description from admin */}
                  {item.description && (
                    <div className="portal-item-description">{item.description}</div>
                  )}
                  <div className="portal-item-stock">
                    <CheckCircle2 size={13} style={{ color: '#10b981' }} />
                    <span style={{ color: '#059669', fontWeight: 600 }}>{item.serviceable_qty} {item.unit_of_measure}</span>
                    <span style={{ color: '#9ca3af' }}>available</span>
                  </div>
                  <button
                    className="portal-borrow-btn"
                    onClick={() => openBorrow(item)}
                  >
                    Borrow <ChevronRight size={15} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
        )}


        {/* ── MY BORROWINGS ─────────────────────────────────────────────────── */}
        {tab === 'myborrow' && !loading && (
          <div className="portal-borrow-list">
            {myBorrowings.length === 0 ? (
              <div className="portal-empty">
                <Shield size={36} />
                <p>You have no borrowing records.</p>
                <small>Borrow equipment and it will appear here.</small>
              </div>
            ) : (
              myBorrowings.map(b => (
                <div key={b.id} className={`portal-borrow-card ${b.is_overdue ? 'overdue' : ''} ${b.status === 'Returned' ? 'returned' : ''}`}>
                  <div className="portal-borrow-main">
                    <div className="portal-borrow-info">
                      <span className="portal-borrow-name">{b.item_name}</span>
                      <span className="portal-borrow-detail">
                        {b.quantity} {b.unit_of_measure} · {b.item_category}
                      </span>
                      <span className="portal-borrow-dates">
                        <Clock size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                        Borrowed: {new Date(b.checkout_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(b.checkout_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        {' · '}
                        {b.status === 'Returned'
                          ? `Returned: ${new Date(b.actual_return_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} at ${new Date(b.actual_return_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}`
                          : `Due: ${new Date(b.expected_return_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`
                        }
                      </span>
                    </div>
                    <div className="portal-borrow-right">
                      {b.is_overdue
                        ? <span className="portal-status-badge overdue"><AlertTriangle size={11} /> Overdue</span>
                        : b.status === 'Active'
                          ? <span className="portal-status-badge active"><Clock size={11} /> Active</span>
                          : <span className="portal-status-badge returned"><CheckCircle2 size={11} /> Returned</span>
                      }
                      {b.status === 'Active' && (
                        <button className="portal-return-btn" onClick={() => openReturn(b)}>
                          <LogIn size={14} /> Return
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ── BORROW MODAL ──────────────────────────────────────────────────────── */}
      {showBorrowModal && selectedItem && (
        <div className="portal-modal-overlay" onClick={() => setShowBorrowModal(false)}>
          <div className="portal-modal" onClick={e => e.stopPropagation()}>
            <div className="portal-modal-header">
              <h3><LogOut size={18} /> Borrow Equipment</h3>
              <button onClick={() => setShowBorrowModal(false)}><X size={20} /></button>
            </div>
            <div className="portal-modal-body">
              {message?.type === 'error' && (
                <div className="portal-message error">
                  <AlertTriangle size={14} /> {message.text}
                </div>
              )}
              <div className="portal-modal-item">
                <Package size={20} style={{ color: '#004d25' }} />
                <div>
                  <strong>{selectedItem.name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{selectedItem.category}</div>
                </div>
              </div>
              <div className="portal-stock-info">
                <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                <span><strong>{selectedItem.serviceable_qty}</strong> {selectedItem.unit_of_measure} available</span>
              </div>
              <div className="portal-form-group">
                <label>Quantity to Borrow</label>
                <input
                  type="number"
                  min="1"
                  max={selectedItem.serviceable_qty}
                  value={borrowQty}
                  onChange={e => setBorrowQty(parseInt(e.target.value) || 1)}
                  className="portal-input"
                />
              </div>
              <div className="portal-form-group">
                <label>Expected Return Date</label>
                <input
                  type="date"
                  value={expectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setExpectedDate(e.target.value)}
                  className="portal-input"
                />
              </div>
              <div className="portal-form-group">
                <label>Notes (optional)</label>
                <textarea
                  rows={2}
                  value={borrowNotes}
                  onChange={e => setBorrowNotes(e.target.value)}
                  placeholder="Purpose or notes..."
                  className="portal-input"
                />
              </div>
            </div>
            <div className="portal-modal-footer">
              <button className="portal-btn portal-btn-outline" onClick={() => setShowBorrowModal(false)}>Cancel</button>
              <button className="portal-btn portal-btn-primary" onClick={submitBorrow} disabled={loading}>
                {loading ? <RefreshCw size={15} className="spin" /> : <LogOut size={15} />}
                Confirm Borrow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── RETURN MODAL ──────────────────────────────────────────────────────── */}
      {showReturnModal && returningBorrow && (
        <div className="portal-modal-overlay" onClick={() => setShowReturnModal(false)}>
          <div className="portal-modal portal-modal-sm" onClick={e => e.stopPropagation()}>
            <div className="portal-modal-header">
              <h3><LogIn size={18} /> Return Equipment</h3>
              <button onClick={() => setShowReturnModal(false)}><X size={20} /></button>
            </div>
            <div className="portal-modal-body">
              <div className="portal-modal-item">
                <Package size={20} style={{ color: '#004d25' }} />
                <div>
                  <strong>{returningBorrow.item_name}</strong>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {returningBorrow.quantity} {returningBorrow.unit_of_measure} borrowed on {new Date(returningBorrow.checkout_date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="portal-form-group">
                <label>Return Condition</label>
                <div className="portal-condition-opts">
                  {[
                    { val: 'Good', icon: <CheckCircle2 size={16} />, color: '#10b981', desc: 'No damage' },
                    { val: 'Damaged', icon: <Wrench size={16} />, color: '#f59e0b', desc: 'Needs repair' },
                    { val: 'Lost', icon: <X size={16} />, color: '#ef4444', desc: 'Cannot return' },
                  ].map(c => (
                    <button
                      key={c.val}
                      className={`portal-cond-btn ${returnCondition === c.val ? 'selected' : ''}`}
                      style={{ '--cond-color': c.color }}
                      onClick={() => setReturnCondition(c.val)}
                    >
                      <span style={{ color: c.color }}>{c.icon}</span>
                      <span>{c.val}</span>
                      <small>{c.desc}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="portal-form-group">
                <label>Notes (optional)</label>
                <textarea
                  rows={2}
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  placeholder="Any remarks about the item's condition..."
                  className="portal-input"
                />
              </div>
            </div>
            <div className="portal-modal-footer">
              <button className="portal-btn portal-btn-outline" onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button className="portal-btn portal-btn-primary" onClick={submitReturn} disabled={loading}>
                {loading ? <RefreshCw size={15} className="spin" /> : <LogIn size={15} />}
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Manual Entry Fallback ─────────────────────────────────────────────────────
function ManualEntryForm({ onSubmit }) {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  return (
    <form className="manual-entry-form" onSubmit={e => { e.preventDefault(); if (id.trim()) onSubmit(id.trim(), name.trim()); }}>
      <div className="input-group-with-icon">
        <CreditCard size={17} className="input-field-icon" />
        <input
          className="portal-input input-has-icon"
          placeholder="Enter Cadet ID (e.g. ROTC-2026-001) *"
          value={id}
          onChange={e => setId(e.target.value)}
          required
        />
      </div>
      <div className="input-group-with-icon">
        <User size={17} className="input-field-icon" />
        <input
          className="portal-input input-has-icon"
          placeholder="Full Name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="portal-btn portal-btn-primary portal-submit-btn"
        disabled={!id.trim()}
      >
        <span>Continue to Portal</span>
        <ChevronRight size={17} />
      </button>
    </form>
  );
}

// Inline icon component for clipboard list (to avoid extra imports issue)
function ClipboardListIcon({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>
    </svg>
  );
}
