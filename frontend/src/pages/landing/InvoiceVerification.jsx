import { useState, useRef, useEffect } from "react";
import jsQR from "jsqr";
import { invoiceService } from "../../services/invoice.service";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

// The printed invoice's QR encodes a full verification URL (…/?invoice=INV-00001#verify-invoice).
// Older/plain codes may just be the bare invoice number — fall back to using the scanned text as-is.
const extractInvoiceNumber = (raw) => {
  const text = String(raw || "").trim();
  try {
    const url = new URL(text);
    const fromParam = url.searchParams.get("invoice");
    if (fromParam) return fromParam;
  } catch {
    // Not a URL — treat the scanned text as the invoice number directly.
  }
  return text;
};

const InvoiceVerification = () => {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error, not-found
  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [showQrScanner, setShowQrScanner] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const invoiceNumberRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const handleVerify = async (numberOverride) => {
    const number = (numberOverride ?? invoiceNumber).trim();
    if (!number) {
      setError("Please enter an invoice number");
      invoiceNumberRef.current?.focus();
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await invoiceService.verify(number);
      if (res.data.success && res.data.data) {
        setInvoiceData(res.data.data);
        setStatus("success");
      } else {
        setStatus("not-found");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setStatus("not-found");
      } else {
        setStatus("error");
        setError(err?.response?.data?.message || "Verification failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    // Scanning the QR code on a printed invoice lands here with ?invoice=INV-00001 — verify it right away.
    const fromQr = new URLSearchParams(window.location.search).get("invoice");
    if (fromQr) {
      setInvoiceNumber(fromQr);
      handleVerify(fromQr);
    } else {
      invoiceNumberRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  const scanFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(scanFrame);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code?.data) {
      const number = extractInvoiceNumber(code.data);
      stopCamera();
      setShowQrScanner(false);
      setInvoiceNumber(number);
      handleVerify(number);
      return;
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access needs HTTPS (or localhost). Use the invoice number field below instead.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      rafRef.current = requestAnimationFrame(scanFrame);
    } catch (err) {
      setCameraError(
        err?.name === "NotAllowedError"
          ? "Camera permission was denied. Allow camera access and try again, or use the invoice number field instead."
          : "Could not access a camera on this device. Use the invoice number field instead."
      );
    }
  };

  useEffect(() => {
    if (showQrScanner) startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showQrScanner]);

  const closeScanner = () => {
    stopCamera();
    setCameraError("");
    setShowQrScanner(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const resetForm = () => {
    setInvoiceNumber("");
    setVerificationCode("");
    setStatus("idle");
    setInvoiceData(null);
    setError("");
    closeScanner();
    setTimeout(() => invoiceNumberRef.current?.focus(), 100);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <section id="verify-invoice" className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 bg-primary-light border border-primary/30">
            <span className="text-primary text-xs font-semibold">🔍 Public Access</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">Verify Your Invoice</h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Customers can quickly verify the authenticity and details of their invoice using the invoice number or verification code.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Verification Form */}
          {status === "idle" && (
            <div className="erp-card p-6 sm:p-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
              <div className="space-y-5">
                <Input
                  label="Invoice Number"
                  id="invoiceNumber"
                  ref={invoiceNumberRef}
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. INV-2024-001234"
                  required
                  autoComplete="off"
                />
                <Input
                  label="Verification Code (Optional)"
                  id="verificationCode"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter verification code if available"
                  autoComplete="off"
                />
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="primary" onClick={handleVerify} className="w-full sm:w-auto flex-1" size="lg" disabled={status === "loading"}>
                    Verify Invoice
                  </Button>
                  <Button variant="outline" onClick={() => setShowQrScanner(true)} className="w-full sm:w-auto flex-1" size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Scan QR Code
                  </Button>
                </div>
                <p className="text-xs text-text-muted text-center">
                  No login required. Only safe, public invoice information will be displayed.
                </p>
              </div>
            </div>
          )}

          {/* QR Code Scanner Modal */}
          {showQrScanner && status === "idle" && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in-0 duration-200" onClick={closeScanner}>
              <div className="erp-card p-6 w-full max-w-md animate-in slide-in-from-bottom-4 duration-300" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">Scan QR Code</h3>
                  <button onClick={closeScanner} className="p-1 text-text-muted hover:text-text-primary transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden bg-background border border-border relative aspect-square flex items-center justify-center">
                  <video ref={videoRef} className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`} muted playsInline />
                  {!cameraOn && !cameraError && (
                    <div className="text-center p-6">
                      <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
                      <p className="text-text-secondary text-sm">Starting camera...</p>
                    </div>
                  )}
                  {cameraError && (
                    <div className="text-center p-6">
                      <svg className="w-12 h-12 mx-auto mb-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m0 0l-4-4m4 4H5m14 0H9m0 0l-4 4m4-4v12" />
                      </svg>
                      <p className="text-danger text-sm">{cameraError}</p>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
                <p className="text-xs text-text-muted text-center mt-3">Point your camera at the QR code on the invoice</p>
                <Button variant="outline" onClick={closeScanner} className="w-full mt-4">
                  Close
                </Button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {status === "loading" && (
            <div className="erp-card p-8 text-center animate-in fade-in-0 duration-300">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-text-secondary">Verifying invoice...</p>
              <p className="text-sm text-text-muted mt-1">Please wait while we check the details</p>
            </div>
          )}

          {/* Success State */}
          {status === "success" && invoiceData && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
              <div className="erp-card p-6 mb-4 bg-success-light border-success/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-success">Invoice Verified Successfully</h3>
                    <p className="text-sm text-text-secondary">This invoice is authentic and verified</p>
                  </div>
                </div>
              </div>

              <div className="erp-card overflow-hidden">
                <div className="px-6 py-4 bg-primary-light border-b border-primary/30">
                  <h4 className="font-semibold text-primary">Invoice Details</h4>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Invoice Number</p>
                      <p className="font-mono font-semibold text-text-primary">{invoiceData.invoiceNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Invoice Date</p>
                      <p className="font-semibold text-text-primary">{formatDate(invoiceData.date)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Business Name</p>
                      <p className="font-semibold text-text-primary">{invoiceData.businessName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Customer</p>
                      <p className="font-semibold text-text-primary">{invoiceData.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Total Amount</p>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(invoiceData.totalAmount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Payment Status</p>
                      <span className={`erp-badge ${invoiceData.paymentStatus === "Paid" ? "erp-badge-success" : invoiceData.paymentStatus === "Partial" ? "erp-badge-warning" : "erp-badge-danger"}`}>
                        {invoiceData.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wide">Verification Status</p>
                      <span className="erp-badge erp-badge-success">{invoiceData.verificationStatus}</span>
                    </div>
                  </div>

                  {invoiceData.items && invoiceData.items.length > 0 && (
                    <div className="border-t border-border pt-4">
                      <h5 className="font-medium text-text-primary mb-3">Invoice Items</h5>
                      <div className="space-y-2">
                        {invoiceData.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-background rounded-lg">
                            <div className="flex-1">
                              <p className="font-medium text-text-primary">{item.name}</p>
                              <p className="text-sm text-text-secondary">Qty: {item.qty} × {formatCurrency(item.rate)}</p>
                            </div>
                            <p className="font-semibold text-text-primary">{formatCurrency(item.amount)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 text-center">
                <Button variant="outline" onClick={resetForm} className="w-full sm:w-auto">
                  Verify Another Invoice
                </Button>
              </div>
            </div>
          )}

          {/* Not Found State */}
          {status === "not-found" && (
            <div className="erp-card p-8 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 border-danger/30">
              <div className="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Invoice Not Found</h3>
              <p className="text-text-secondary mb-4">No invoice found with number <strong className="text-text-primary">{invoiceNumber}</strong></p>
              <p className="text-sm text-text-muted mb-6">Please check the invoice number and try again, or contact the business for verification.</p>
              <Button variant="outline" onClick={resetForm}>
                Try Again
              </Button>
            </div>
          )}

          {/* Error State */}
          {status === "error" && (
            <div className="erp-card p-8 text-center animate-in fade-in-0 slide-in-from-bottom-4 duration-500 border-danger/30">
              <div className="w-16 h-16 rounded-full bg-danger-light flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Verification Error</h3>
              <p className="text-text-secondary mb-4">{error || "Something went wrong. Please try again."}</p>
              <Button variant="outline" onClick={resetForm}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default InvoiceVerification;