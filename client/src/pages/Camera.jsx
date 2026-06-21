import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Html5Qrcode } from "html5-qrcode";
import api from "../api/axios";

const VIEWFINDER_ID = "qr-viewfinder";

/**
 * POST /api/registrations/check-in { ticketToken } — host only (JWT)
 */
function Camera() {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/dashboard";
  const returnLabel = returnTo.includes("registrations")
    ? "Back to registrations"
    : "Back to dashboard";

  const [cameraError, setCameraError] = useState("");
  const [scannerReady, setScannerReady] = useState(false);
  const [canUpload, setCanUpload] = useState(false);
  const [checkInResult, setCheckInResult] = useState(null);
  const [fileScanning, setFileScanning] = useState(false);

  const qrRef = useRef(null);
  const lockRef = useRef(false);
  const fileInputRef = useRef(null);

  const handleCheckIn = useCallback(async (ticketToken) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setCheckInResult(null);

    try {
      const res = await api.post("/api/registrations/check-in", {
        ticketToken,
      });
      setCheckInResult({
        type: "success",
        message: res.data.message ?? "Checked in successfully",
      });
    } catch (err) {
      setCheckInResult({
        type: "error",
        message: err.response?.data?.message || "Check-in failed",
      });
    } finally {
      setTimeout(() => {
        lockRef.current = false;
      }, 2500);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const html5Qr = new Html5Qrcode(VIEWFINDER_ID);
    qrRef.current = html5Qr;
    setCanUpload(true);

    async function startCamera() {
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cancelled) return;

        if (!cameras?.length) {
          setCameraError("No camera found on this device.");
          return;
        }

        const backCamera =
          cameras.find((c) => /back|rear|environment/i.test(c.label)) ??
          cameras[cameras.length - 1];

        await html5Qr.start(
          backCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            handleCheckIn(decodedText);
          },
          () => {
            /* scan noise */
          },
        );

        if (!cancelled) setScannerReady(true);
      } catch (err) {
        if (!cancelled) {
          setCameraError(
            err?.message || "Could not start camera. Allow permission and retry.",
          );
        }
      }
    }

    startCamera();

    return () => {
      cancelled = true;
      const instance = qrRef.current;
      qrRef.current = null;
      if (instance?.isScanning) {
        instance.stop().then(() => instance.clear()).catch(() => {});
      } else {
        instance?.clear();
      }
    };
  }, [handleCheckIn]);

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file || !qrRef.current) return;

    setFileScanning(true);
    setCheckInResult(null);
    try {
      const decodedText = await qrRef.current.scanFile(file, false);
      await handleCheckIn(decodedText);
    } catch {
      setCheckInResult({
        type: "error",
        message: "No valid QR code found in that image.",
      });
    } finally {
      setFileScanning(false);
      e.target.value = "";
    }
  }

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-neutral-50 py-12 md:py-16">
      <div className="mx-auto max-w-md px-6">
        <button
          type="button"
          onClick={() => navigate(returnTo)}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← {returnLabel}
        </button>

        <h1 className="mt-4 text-2xl font-bold text-neutral-900">QR check-in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Point the camera at the attendee&apos;s ticket QR code.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 bg-neutral-900 px-4 py-3 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
              Scanner
            </p>
            {!scannerReady && !cameraError && (
              <p className="mt-1 text-sm text-neutral-300">Starting camera…</p>
            )}
            {scannerReady && (
              <p className="mt-1 text-sm text-green-400">Camera ready</p>
            )}
          </div>

          <div className="qr-scanner-wrap p-4">
            {cameraError ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg bg-neutral-100 px-4 text-center">
                <p className="text-sm text-red-700">{cameraError}</p>
                <p className="mt-2 text-xs text-neutral-500">
                  Use upload below if camera access is blocked.
                </p>
              </div>
            ) : (
              <div id={VIEWFINDER_ID} className="qr-viewfinder" />
            )}
          </div>

          <div className="border-t border-neutral-100 px-4 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />
            <button
              type="button"
              disabled={fileScanning || !canUpload}
              onClick={() => fileInputRef.current?.click()}
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-50 disabled:opacity-50"
            >
              {fileScanning ? "Reading image…" : "Upload QR image instead"}
            </button>
          </div>
        </div>

        {checkInResult && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
              checkInResult.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
            role="status"
          >
            {checkInResult.message}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-neutral-500">
          Tip: hold steady inside the square. Each scan pauses briefly before the
          next.
        </p>
      </div>
    </main>
  );
}

export default Camera;
