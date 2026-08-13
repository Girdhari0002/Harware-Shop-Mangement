import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import { attendanceService } from "../../services/attendance.service";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

const actionCopy = {
  checkin: { icon: "✅", title: "Checked In" },
  checkout: { icon: "👋", title: "Checked Out" },
  "already-done": { icon: "ℹ️", title: "Already Completed Today" }
};

const AttendanceScanner = ({ onMarked }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const submittingRef = useRef(false);

  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraOn(false);
  };

  useEffect(() => () => stopCamera(), []);

  const submitCode = async (code) => {
    if (!code || submittingRef.current) return;
    submittingRef.current = true;
    stopCamera();
    setStatus("loading");
    setError("");
    try {
      const res = await attendanceService.scan(code.trim());
      setResult(res.data);
      setStatus("success");
      onMarked?.();
    } catch (err) {
      setError(err?.response?.data?.message || "Could not mark attendance. Please try again.");
      setStatus("error");
    } finally {
      submittingRef.current = false;
    }
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
      submitCode(code.data);
      return;
    }
    rafRef.current = requestAnimationFrame(scanFrame);
  };

  const startCamera = async () => {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access needs HTTPS (or localhost). Use the manual code entry below instead.");
      return;
    }
    try {
      // videoRef is always mounted (visibility is toggled via CSS), so it's
      // already available here — no need to wait for a re-render first.
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
          ? "Camera permission was denied. Allow camera access and try again, or use the manual code entry below."
          : "Could not access a camera on this device. Use the manual code entry below instead."
      );
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    submitCode(manualCode);
  };

  const reset = () => {
    setStatus("idle");
    setResult(null);
    setError("");
    setManualCode("");
  };

  return (
    <Card title="📷 Scan Gate Pass" subtitle="Scan a staff member's QR code, or enter their gate pass code, to mark today's check-in / check-out.">
      <div className="max-w-sm mx-auto">
        {status === "idle" && (
          <div className="space-y-5">
            <div className="rounded-xl overflow-hidden bg-background border border-border relative aspect-square flex items-center justify-center">
              <video ref={videoRef} className={`w-full h-full object-cover ${cameraOn ? "" : "hidden"}`} muted playsInline />
              {!cameraOn && (
                <div className="text-center p-6">
                  <div className="text-5xl mb-3">📷</div>
                  <p className="text-text-secondary text-sm">Camera preview will appear here</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {cameraError && (
              <p className="text-sm text-danger text-center">{cameraError}</p>
            )}

            {!cameraOn ? (
              <Button variant="primary" className="w-full" size="lg" onClick={startCamera}>
                📷 Start Camera Scan
              </Button>
            ) : (
              <Button variant="outline" className="w-full" onClick={stopCamera}>
                Stop Camera
              </Button>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted uppercase tracking-wide">or enter code manually</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <div className="flex-1">
                <Input
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="e.g. 900000000001"
                  autoComplete="off"
                />
              </div>
              <Button type="submit" variant="secondary">Mark</Button>
            </form>
          </div>
        )}

        {status === "loading" && (
          <div className="p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-text-secondary">Marking attendance...</p>
          </div>
        )}

        {status === "success" && result && (
          <div className="p-8 text-center rounded-xl bg-success-light border border-success/30">
            <div className="text-5xl mb-3">{actionCopy[result.action]?.icon || "✅"}</div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">{actionCopy[result.action]?.title || "Marked"}</h3>
            <p className="text-text-secondary mb-1">{result.user?.fullName} &middot; {result.user?.role}</p>
            <p className="text-sm text-text-muted mb-6">
              {new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
            <Button variant="outline" onClick={reset}>Scan Another</Button>
          </div>
        )}

        {status === "error" && (
          <div className="p-8 text-center rounded-xl border border-danger/30">
            <div className="text-5xl mb-3">❌</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">Could Not Mark Attendance</h3>
            <p className="text-text-secondary mb-6">{error}</p>
            <Button variant="outline" onClick={reset}>Try Again</Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AttendanceScanner;
