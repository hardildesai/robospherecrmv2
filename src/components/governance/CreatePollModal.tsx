import { useState } from 'react';
import { Modal, Input, Button } from '../ui';
import { Plus, Trash } from 'lucide-react';
import { useStore } from '../../lib/store';

interface CreatePollModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreatePollModal: React.FC<CreatePollModalProps> = ({ isOpen, onClose }) => {
    const { createPoll, currentUser, addToast } = useStore();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(['', '']);

    const handleAddOption = () => {
        if (options.length < 5) {
            setOptions([...options, '']);
        }
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            const newOptions = [...options];
            newOptions.splice(index, 1);
            setOptions(newOptions);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentUser) return;
        if (!question.trim()) return;
        if (options.some(o => !o.trim())) {
            addToast({ type: 'warning', message: 'All options must be filled out.' });
            return;
        }

        createPoll({
            id: `poll-${Date.now()}`,
            question,
            options: options.map((label, idx) => ({
                id: `opt-${Date.now()}-${idx}`,
                label,
                votes: 0
            })),
            status: 'Open',
            createdBy: currentUser.id,
            createdDate: new Date().toISOString(),
            votedMemberIds: [],
        });

        addToast({ type: 'success', message: 'Poll created successfully!' });
        onClose();
        setQuestion('');
        setOptions(['', '']);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Poll">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Question"
                    placeholder="e.g. What should we order for lunch?"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    required
                />

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Options</label>
                    {options.map((option, index) => (
                        <div key={index} className="flex gap-2">
                            <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1"
                                required
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {options.length < 5 && (
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                        <Plus className="w-4 h-4" /> Add Option
                    </button>
                )}

                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" onClick={onClose} type="button">Cancel</Button>
                    <Button type="submit">Create Poll</Button>
                </div>
            </form>
        </Modal>
    );
};
