import { useState, useMemo } from 'react';
import { PageHeader, AccessDenied } from '../../components/common';
import { Card, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Badge, Button } from '../../components/ui';
import { useStore } from '../../lib/store';
import { Shield, Search, Download } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
    const { currentUser, auditLogs, addAuditLog } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');

    // Access Control
    if (currentUser?.role !== 'superadmin') {
        addAuditLog('UNAUTHORIZED_ACCESS', 'Attempted to access Audit Logs without Super Admin privileges');
        return <AccessDenied />;
    }

    // Get unique action types for filter
    const actionTypes = useMemo(() => {
        const types = new Set(auditLogs.map(log => log.actionType));
        return ['ALL', ...Array.from(types)];
    }, [auditLogs]);

    // Filter logs
    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesSearch =
                log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                log.userId.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesAction = actionFilter === 'ALL' || log.actionType === actionFilter;

            return matchesSearch && matchesAction;
        }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [auditLogs, searchTerm, actionFilter]);

    const handleExport = () => {
        const headers = ['Timestamp', 'Action', 'User ID', 'Details', 'IP Address'];
        const csvContent = [
            headers.join(','),
            ...filteredLogs.map(log => [
                log.timestamp,
                log.actionType,
                log.userId,
                `"${log.details.replace(/"/g, '""')}"`, // Escape quotes
                log.ipAddress
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Shield}
                title="System Audit Logs"
                subtitle="Track all system activities and security events"
                actions={
                    <Button variant="secondary" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                        Export CSV
                    </Button>
                }
            />

            <Card padding="none">
                {/* Filters */}
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center bg-slate-50/50">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search details or user ID..."
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-64">
                        <select
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            value={actionFilter}
                            onChange={(e) => setActionFilter(e.target.value)}
                        >
                            {actionTypes.map(type => (
                                <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Action Type</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>IP Address</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredLogs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                        No logs found matching your filters.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredLogs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString(undefined, {
                                                month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                log.actionType.includes('DELETED') || log.actionType.includes('FAILURE') || log.actionType.includes('UNAUTHORIZED') ? 'danger' :
                                                    log.actionType.includes('UPDATED') ? 'warning' : 'default'
                                            }>
                                                {log.actionType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs font-medium">
                                            {log.userId}
                                        </TableCell>
                                        <TableCell className="max-w-md truncate text-slate-600" title={log.details}>
                                            {log.details}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs text-slate-400">
                                            {log.ipAddress}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Footer / Pagination hint */}
                <div className="p-4 border-t border-slate-100 text-xs text-slate-400 text-center">
                    Showing {filteredLogs.length} events
                </div>
            </Card>
        </div>
    );
};
