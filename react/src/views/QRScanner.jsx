// QRScanner.jsx
import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode(scannerRef.current.id);

    html5QrCode
      .start(
        { facingMode: "environment" }, // use back camera
        { fps: 10, qrbox: 250 },
        (decodedText, decodedResult) => {
          setScannedData(decodedText);
          onScan && onScan(decodedText);
          html5QrCode.stop(); // stop scanning after first QR
        },
        (errorMessage) => {
          // optionally handle scan errors
        }
      )
      .catch((err) => console.error(err));

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, [scannerRef]);

  return (
    <div>
      <h3>Scan QR Code</h3>
      <div
        id="qr-scanner"
        ref={scannerRef}
        style={{ width: "300px", height: "300px", margin: "auto" }}
      ></div>
      {scannedData && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          Scanned: {scannedData}
        </p>
      )}
    </div>
  );
}
