import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Printer, User, Shield, RefreshCw, Sparkles, Download } from 'lucide-react';

const CSU_ROTC_LOGO = '/csu-rotc-logo.png';

export default function CadetIdGenerator() {
  const [cadetType, setCadetType] = useState('Basic'); // 'Basic' | 'Officer'
  const [cadetName, setCadetName] = useState('SANTOS, MARIA L.');
  const [cadetId, setCadetId] = useState('221-01232');
  const [rank, setRank] = useState('Cadet');
  const [designation, setDesignation] = useState('None');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const cardRef = useRef(null);

  // Generate QR Code data URL whenever Cadet ID or Name changes
  useEffect(() => {
    if (!cadetId.trim()) {
      setQrDataUrl('');
      return;
    }
    const payload = JSON.stringify({
      id: cadetId.trim(),
      name: cadetName.trim() || 'Cadet',
    });

    QRCode.toDataURL(payload, {
      width: 300,
      margin: 1,
      color: {
        dark: '#003318',
        light: '#ffffff',
      },
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [cadetId, cadetName]);

  const handleIdChange = (e) => {
    let val = e.target.value;
    // Auto-hyphenate format: XXX-XXXXX (e.g. 221-01231)
    const rawDigits = val.replace(/\D/g, '');
    if (rawDigits.length > 3) {
      val = `${rawDigits.slice(0, 3)}-${rawDigits.slice(3, 8)}`;
    } else {
      val = rawDigits;
    }
    setCadetId(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="id-generator-wrap">
      <div className="id-generator-header">
        <div>
          <h2 className="page-title">Cadet ID QR Code Generator</h2>
          <p className="page-subtitle">Generate official CSU ROTC ID cards with scannable QR codes</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print ID Card
        </button>
      </div>

      <div className="id-generator-grid">
        {/* Form Controls */}
        <div className="id-form-card">
          <h3 className="section-title"><User size={16} /> Cadet Information</h3>

          {/* Cadet Category Toggle */}
          <div className="cadet-type-toggle">
            <button
              type="button"
              className={`cadet-type-btn ${cadetType === 'Basic' ? 'active' : ''}`}
              onClick={() => {
                setCadetType('Basic');
                setRank('Cadet');
                setDesignation('None');
              }}
            >
              <Shield size={14} /> Basic Cadet
            </button>
            <button
              type="button"
              className={`cadet-type-btn ${cadetType === 'Officer' ? 'active' : ''}`}
              onClick={() => {
                setCadetType('Officer');
                if (rank === 'Cadet') {
                  setRank('Cadet 2LT (ROTC) 4CL');
                }
              }}
            >
              <User size={14} /> Cadet Officer
            </button>
          </div>

          <div className="form-group">
            <label>Cadet Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={cadetName}
              onChange={e => setCadetName(e.target.value.toUpperCase())}
              placeholder="LAST NAME, FIRST NAME M.I. (e.g. SANTOS, MARIA L.)"
            />
          </div>

          <div className="form-group">
            <label>Cadet ID / Student Number *</label>
            <input
              type="text"
              className="form-input"
              value={cadetId}
              onChange={handleIdChange}
              placeholder="e.g. 221-01231"
              maxLength={9}
            />
          </div>

          <div className="form-group">
            <label>Rank</label>
            <select
              className="form-input"
              value={rank}
              disabled={cadetType === 'Basic'}
              onChange={e => {
                const selectedRank = e.target.value;
                setRank(selectedRank);
                if (selectedRank === 'Cadet') {
                  setDesignation('None');
                }
              }}
            >
              {cadetType === 'Basic' ? (
                <option value="Cadet">Cadet (Basic Cadet)</option>
              ) : (
                <>
                  <option value="Cadet 2LT (ROTC) 4CL">Cadet 2LT (ROTC) 4CL</option>
                  <option value="Cadet 1LT (ROTC) 4CL">Cadet 1LT (ROTC) 4CL</option>
                  <option value="Cadet 1LT (ROTC) 3CL">Cadet 1LT (ROTC) 3CL</option>
                  <option value="Cadet CPT (ROTC) 3CL">Cadet CPT (ROTC) 3CL</option>
                  <option value="Cadet CPT (ROTC) 2CL">Cadet CPT (ROTC) 2CL</option>
                  <option value="Cadet MAJ (ROTC) 2CL">Cadet MAJ (ROTC) 2CL</option>
                  <option value="Cadet LT COL (ROTC) 1CL">Cadet LT COL (ROTC) 1CL</option>
                  <option value="Cadet COL (ROTC) 1CL">Cadet COL (ROTC) 1CL</option>
                </>
              )}
            </select>
          </div>

          {cadetType === 'Officer' && (
            <div className="form-group">
              <label>Designation</label>
              <select
                className="form-input"
                value={designation}
                onChange={e => setDesignation(e.target.value)}
              >
                <option value="None">None</option>
                <option value="Corps Commander">Corps Commander</option>
                <option value="Adjutant">Adjutant</option>
                <option value="S1 Brigade">S1 Brigade</option>
                <option value="S2 Brigade">S2 Brigade</option>
                <option value="S3 Brigade">S3 Brigade</option>
                <option value="S4 Brigade">S4 Brigade</option>
                <option value="S7 Brigade">S7 Brigade</option>
                <option value="S1 Assistance">S1 Assistance</option>
                <option value="S2 Assistance">S2 Assistance</option>
                <option value="S3 Assistance">S3 Assistance</option>
                <option value="S4 Assistance">S4 Assistance</option>
                <option value="S7 Assistance">S7 Assistance</option>
              </select>
            </div>
          )}


        </div>

        {/* Live ID Card Preview */}
        <div className="id-preview-card">
          <div className="preview-label">
            <Sparkles size={14} /> LIVE ID CARD PREVIEW (CR80 Standard Size)
          </div>

          {/* Actual Printable ID Card */}
          <div className="rotc-id-card printable-id-card" ref={cardRef}>
            {/* Header Banner */}
            <div className="rotc-id-header">
              <img src={CSU_ROTC_LOGO} alt="CSU ROTC" className="rotc-id-logo" />
              <div className="rotc-id-header-text">
                <span className="rotc-id-arm">ARESCOM · 15TH RCDG</span>
                <span className="rotc-id-unit">1501st CDC ROTC UNIT</span>
                <span className="rotc-id-school">CARAGA STATE UNIVERSITY MAIN CAMPUS</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="rotc-id-body">
              <div className="rotc-id-photo-placeholder">
                <User size={38} className="rotc-id-photo-icon" />
                <span className="rotc-id-photo-tag">OFFICIAL ID</span>
              </div>

              <div className="rotc-id-details">
                <div className="rotc-id-name">{cadetName || 'SANTOS, MARIA L.'}</div>
                <div className="rotc-id-rank">
                  <span>{rank}</span>
                  {cadetType === 'Officer' && designation !== 'None' && (
                    <span className="rotc-id-designation"> • {designation}</span>
                  )}
                </div>
                <div className="rotc-id-meta">
                  <div><span className="meta-label">ID NO:</span> <strong className="meta-val">{cadetId || '221-01231'}</strong></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="rotc-id-qr-wrap">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Cadet QR Code" className="rotc-id-qr-img" />
                ) : (
                  <div className="rotc-id-qr-empty"><QrCode size={30} /></div>
                )}
                <span className="rotc-id-qr-sub">QR CODE</span>
              </div>
            </div>

            {/* Card Footer Stripe */}
            <div className="rotc-id-footer">
              <span>HONOR · PATRIOTISM · DUTY</span>
            </div>
          </div>

          <p className="print-hint">
            <Printer size={13} /> Tapping <strong>Print ID Card</strong> will format this exact ID card for printing.
          </p>
        </div>
      </div>
    </div>
  );
}
