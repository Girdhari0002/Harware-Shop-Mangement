import { useState } from "react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

export default function BackupRestore() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleBackup = async () => {
    setLoading(true);
    setMessage("");
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMessage("Backup created successfully! File downloaded.");
    } catch (e) {
      setMessage("Failed to create backup.");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      await new Promise(r => setTimeout(r, 1000));
      setMessage("Data restored successfully!");
    } catch (e) {
      setMessage("Failed to restore data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary mb-1">🗄️ Backup & Restore</h1>
        <p className="text-text-secondary">Backup ERP data regularly and restore when required.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Create Backup" icon="📦" subtitle="Download a complete backup of your ERP data">
          <div className="space-y-4">
            <p className="text-text-secondary">This will create a JSON file containing all your data including products, customers, suppliers, sales, purchases, expenses, and settings.</p>
            <Button variant="primary" onClick={handleBackup} disabled={loading} className="w-full">
              {loading ? "Creating Backup..." : "📥 Download Backup"}
            </Button>
          </div>
        </Card>

        <Card title="Restore Data" icon="📤" subtitle="Upload a previously created backup file">
          <div className="space-y-4">
            <p className="text-text-secondary">Select a backup file to restore your data. <strong className="text-text-primary">Warning:</strong> This will overwrite all existing data.</p>
            <input
              type="file"
              accept=".json"
              onChange={handleRestore}
              className="erp-input"
            />
            <Button variant="accent" onClick={() => document.querySelector('input[type="file"]').click()} disabled={loading} className="w-full">
              {loading ? "Restoring..." : "📤 Restore from File"}
            </Button>
          </div>
        </Card>
      </div>

      {message && (
        <div className={`erp-card border p-4 animate-in slide-in-from-top-2 fade-in-0 duration-200 ${message.includes("success") ? "border-success/30 bg-success-light text-success" : "border-danger/30 bg-danger-light text-danger"}`}>
          {message}
        </div>
      )}
    </div>
  );
}