// ============================================
// Skill Tags Component
// ============================================

import React from 'react';
import { Tag, X } from 'lucide-react';
import { Badge } from '../ui';

interface SkillTagsProps {
    skills: string[];
    editable?: boolean;
    onAdd?: (skill: string) => void;
    onRemove?: (skill: string) => void;
}

export const SkillTags: React.FC<SkillTagsProps> = ({
    skills,
    editable = false,
    onAdd,
    onRemove,
}) => {
    const [inputValue, setInputValue] = React.useState('');
    const [isAdding, setIsAdding] = React.useState(false);

    const handleAddSkill = () => {
        if (inputValue.trim() && onAdd) {
            onAdd(inputValue.trim());
            setInputValue('');
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-accent-core" />
                <h4 className="text-sm font-medium text-text-primary">Skills</h4>
            </div>

            <div className="flex flex-wrap gap-2">
                {skills.length === 0 && !editable && (
                    <p className="text-sm text-text-dim italic">No skills listed</p>
                )}

                {skills.map((skill) => (
                    <Badge
                        key={skill}
                        variant="default"
                        className="flex items-center gap-1"
                    >
                        {skill}
                        {editable && onRemove && (
                            <button
                                onClick={() => onRemove(skill)}
                                className="ml-1 hover:text-signal-red transition-colors"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </Badge>
                ))}

                {editable && !isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-2 py-1 text-xs border border-dashed border-grid hover:border-accent-core text-text-muted hover:text-accent-core rounded transition-colors"
                    >
                        + Add Skill
                    </button>
                )}

                {editable && isAdding && (
                    <div className="flex items-center gap-1">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddSkill();
                                if (e.key === 'Escape') setIsAdding(false);
                            }}
                            placeholder="Skill name"
                            className="px-2 py-1 text-xs bg-surface border border-grid rounded focus:outline-none focus:border-accent-core text-text-primary"
                            autoFocus
                        />
                        <button
                            onClick={handleAddSkill}
                            className="px-2 py-1 text-xs bg-accent-core text-bg-primary rounded hover:opacity-80 transition-opacity"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-2 py-1 text-xs text-text-dim hover:text-text-primary transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
