import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode, Printer, User, Shield, RefreshCw, Sparkles, Download } from 'lucide-react';

const CSU_ROTC_LOGO = '/csu-rotc-logo.png';

export default function CadetIdGenerator() {
  const [cadetName, setCadetName] = useState('JUAN DELA CRUZ');
  const [cadetId, setCadetId] = useState('2024-10234');
  const [rank, setRank] = useState('Cadet Private (ROTC)4CL');
  const [company, setCompany] = useState('Alpha Company');
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="id-generator-wrap">
      <div className="id-generator-header">
        <div>
          <h2 className="page-title">Cadet ID QR Code Generator</h2>
          <p className="page-subtitle">Generate official CSU ROTC ID cards with scannable QR codes for fast borrowing</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={16} /> Print ID Card
        </button>
      </div>

      <div className="id-generator-grid">
        {/* Form Controls */}
        <div className="id-form-card">
          <h3 className="section-title"><User size={16} /> Cadet Information</h3>

          <div className="form-group">
            <label>Cadet Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={cadetName}
              onChange={e => setCadetName(e.target.value.toUpperCase())}
              placeholder="e.g. JUAN DELA CRUZ"
            />
          </div>

          <div className="form-group">
            <label>Cadet ID / Student Number *</label>
            <input
              type="text"
              className="form-input"
              value={cadetId}
              onChange={e => setCadetId(e.target.value)}
              placeholder="e.g. 2024-10234"
            />
          </div>

          <div className="form-group">
            <label>Rank / Designation</label>
            <select
              className="form-input"
              value={rank}
              onChange={e => setRank(e.target.value)}
            >
              <option value="Cadet Private (ROTC)4CL">Cadet Private (ROTC)4CL</option>
              <option value="Cadet Corporal (ROTC)3CL">Cadet Corporal (ROTC)3CL</option>
              <option value="Cadet Sergeant (ROTC)2CL">Cadet Sergeant (ROTC)2CL</option>
              <option value="Cadet Lieutenant (ROTC)1CL">Cadet Lieutenant (ROTC)1CL</option>
              <option value="Cadet Officer">Cadet Officer</option>
              <option value="Cadet Battalion Commander">Cadet Battalion Commander</option>
            </select>
          </div>

          <div className="form-group">
            <label>Company / Unit</label>
            <select
              className="form-input"
              value={company}
              onChange={e => setCompany(e.target.value)}
            >
              <option value="Alpha Company">Alpha Company</option>
              <option value="Bravo Company">Bravo Company</option>
              <option value="Charlie Company">Charlie Company</option>
              <option value="Headquarters Company">Headquarters Company</option>
              <option value="Band / Ceremonial Platoon">Band / Ceremonial Platoon</option>
            </select>
          </div>

          <div className="id-preset-buttons">
            <span className="preset-label">Quick Sample Data:</span>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setCadetName('ABAMO, CHRISTIAN B.');
                setCadetId('2024-00101');
                setRank('Cadet Lieutenant (ROTC)1CL');
                setCompany('Headquarters Company');
              }}
            >
              S4 Logistics
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => {
                setCadetName('SANTOS, MARIA L.');
                setCadetId('2024-00205');
                setRank('Cadet Private (ROTC)4CL');
                setCompany('Alpha Company');
              }}
            >
              Sample Cadet
            </button>
          </div>
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
                <span className="rotc-id-arm">ARESCOM · 15TH (CARAGA) RCDG</span>
                <span className="rotc-id-unit">1501ST (ADN) ROTC UNIT</span>
                <span className="rotc-id-school">CARAGA STATE UNIVERSITY</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="rotc-id-body">
              <div className="rotc-id-photo-placeholder">
                <User size={38} className="rotc-id-photo-icon" />
                <span className="rotc-id-photo-tag">OFFICIAL ID</span>
              </div>

              <div className="rotc-id-details">
                <div className="rotc-id-name">{cadetName || 'CADET NAME'}</div>
                <div className="rotc-id-rank">{rank}</div>
                <div className="rotc-id-meta">
                  <div><span className="meta-label">ID NO:</span> <strong className="meta-val">{cadetId || '2024-XXXXX'}</strong></div>
                  <div><span className="meta-label">UNIT:</span> <span className="meta-val">{company}</span></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="rotc-id-qr-wrap">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Cadet QR Code" className="rotc-id-qr-img" />
                ) : (
                  <div className="rotc-id-qr-empty"><QrCode size={30} /></div>
                )}
                <span className="rotc-id-qr-sub">SCAN TO BORROW</span>
              </div>
            </div>

            {/* Card Footer Stripe */}
            <div className="rotc-id-footer">
              <span>DUTY · HONOR · COUNTRY · EXCELLENCE</span>
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
