import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../ui';
import { useStore } from '../../lib/store';
import { useNavigate } from 'react-router-dom';

interface OverdueAlertsProps {
    variant?: 'widget' | 'banner';
}

export const OverdueAlerts: React.FC<OverdueAlertsProps> = ({ variant = 'widget' }) => {
    const { getOverdueCheckouts, inventory, members } = useStore();
    const navigate = useNavigate();

    const overdueCheckouts = getOverdueCheckouts();

    if (overdueCheckouts.length === 0) {
        if (variant === 'widget') {
            return (
                <Card className="h-full flex items-center justify-center p-6 bg-slate-50 border-dashed border-slate-200">
                    <div className="text-center text-text-muted">
                        <CheckCircleIcon className="w-8 h-8 mx-auto mb-2 text-emerald-500 opacity-50" />
                        <p className="text-sm">No overdue items</p>
                    </div>
                </Card>
            );
        }
        return null;
    }

    if (variant === 'banner') {
        return (
            <div className="mb-6 bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-danger/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-danger" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-danger-dark">
                            {overdueCheckouts.length} Item{overdueCheckouts.length !== 1 ? 's' : ''} Overdue
                        </h3>
                        <p className="text-sm text-danger-dark/80">
                            Please follow up with members to return these items.
                        </p>
                    </div>
                </div>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => navigate('/reports?tab=overdue')} // Or filter inventory
                    className="bg-white/50 hover:bg-white/80 border-transparent text-danger-dark"
                >
                    View Report
                </Button>
            </div>
        );
    }

    // Widget Variant
    return (
        <Card title="Overdue Returns" className="h-full border-danger/30">
            <div className="space-y-4">
                {overdueCheckouts.slice(0, 3).map((checkout) => {
                    const item = inventory.find(i => i.id === checkout.itemId);
                    const member = members.find(m => m.id === checkout.memberId);

                    return (
                        <div key={checkout.id} className="flex items-start justify-between pb-3 border-b border-grid last:border-0 last:pb-0">
                            <div>
                                <p className="font-medium text-slate-800 line-clamp-1">
                                    {item?.name || 'Unknown Item'}
                                </p>
                                <p className="text-xs text-text-muted mt-0.5">
                                    Checked out by <span className="text-slate-700">{member?.name || 'Unknown'}</span>
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge variant="danger" className="text-[10px]">Overdue</Badge>
                                <p className="text-xs text-danger mt-1 font-medium">
                                    {checkout.dueDate ? new Date(checkout.dueDate).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {overdueCheckouts.length > 3 && (
                    <div className="pt-2 text-center">
                        <button
                            onClick={() => navigate('/reports')}
                            className="text-xs text-text-muted hover:text-primary transition-colors flex items-center justify-center gap-1 mx-auto"
                        >
                            View {overdueCheckouts.length - 3} more <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </Card>
    );
};

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
