import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getAuditLogsFn } from "@/lib/services/adminService";
import { History, ShieldAlert } from "lucide-react";

export const Route = createFileRoute("/admin/audit-logs")({
  component: AdminAuditLogsPage,
});

function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const token = localStorage.getItem("askganis_token");
    if (!token) return;
    try {
      const data = await getAuditLogsFn({ data: { token } });
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black text-charcoal">Audit Trail Activity Log</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Catatan riwayat transaksi dan aktivitas penting sistem untuk akuntabilitas dan auditability.
        </p>
      </div>

      <div className="rounded-xl border border-border/60 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground">Memuat audit log...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/30 bg-forest-50/10 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-6 py-3.5">Waktu</th>
                  <th className="px-4 py-3.5">Pengguna</th>
                  <th className="px-4 py-3.5">Aksi</th>
                  <th className="px-4 py-3.5">Entity</th>
                  <th className="px-6 py-3.5">Metadata Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-xs">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                      Belum ada catatan aktivitas audit.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-forest-50/10 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-charcoal">
                        {log.user_name || "Sistem"}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="rounded bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-900 border border-forest-100 font-mono">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground font-mono">
                        {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ""}
                      </td>
                      <td className="px-6 py-3.5 font-mono text-[11px] text-muted-foreground truncate max-w-xs">
                        {log.metadata ? log.metadata : "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
