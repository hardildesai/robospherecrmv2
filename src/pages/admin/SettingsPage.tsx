import { useState } from 'react';
import { PageHeader, AccessDenied } from '../../components/common';
import { Card, Button, Input } from '../../components/ui';
import { useStore } from '../../lib/store';
import { Settings, Save, Lock, Power } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { currentUser, settings, updateSettings, addToast, addAuditLog } = useStore();

    // Local state for form
    const [recruitmentOpen, setRecruitmentOpen] = useState(settings.recruitmentOpen);
    const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenanceMode);
    const [defaultPassword, setDefaultPassword] = useState(settings.defaultPassword);
    const [allowSignups, setAllowSignups] = useState(settings.allowMemberSignups);

    // Access Control
    if (currentUser?.role !== 'superadmin') {
        addAuditLog('UNAUTHORIZED_ACCESS', 'Attempted to access Settings page without Super Admin privileges');
        return <AccessDenied />;
    }

    const handleSave = () => {
        updateSettings({
            recruitmentOpen,
            maintenanceMode,
            defaultPassword,
            allowMemberSignups: allowSignups
        });
        addToast({ type: 'success', message: 'Global settings updated successfully' });
    };

    return (
        <div className="space-y-6">
            <PageHeader
                icon={Settings}
                title="Global Settings"
                subtitle="Configure system-wide parameters and access controls"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* System State */}
                <Card title="System State" icon={Power}>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <h3 className="font-medium text-slate-800">Recruitment Portal</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    When closed, the public recruitment page shows a "Check back later" message.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={recruitmentOpen}
                                    onChange={(e) => setRecruitmentOpen(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <h3 className="font-medium text-slate-800">Maintenance Mode</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    If enabled, only Superadmins can log in. All other users are blocked.
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                            </label>
                        </div>
                    </div>
                </Card>

                {/* Security & Access */}
                <Card title="Security & Access" icon={Lock}>
                    <div className="space-y-6">
                        <Input
                            label="Default Member Password"
                            type="text"
                            value={defaultPassword}
                            onChange={(e) => setDefaultPassword(e.target.value)}
                            placeholder="e.g. robosphere"
                            helperText="New members will be initialized with this password"
                        />

                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <div>
                                <h3 className="font-medium text-slate-800">Allow Self-Signup</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Allow users to create their own accounts (e.g. via public link).
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={allowSignups}
                                    onChange={(e) => setAllowSignups(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                            </label>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                variant="primary"
                                leftIcon={<Save className="w-4 h-4" />}
                                onClick={handleSave}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
