// ============================================
// Create Article Modal
// ============================================

import { useState } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useStore } from '../../lib/store';
import type { WikiArticle, ArticleCategory } from '../../lib/types';

interface CreateArticleModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ isOpen, onClose }) => {
    const { addWikiArticle, currentUser, addToast } = useStore();

    const [formData, setFormData] = useState({
        title: '',
        category: '' as ArticleCategory | '',
        content: '',
        tags: '',
    });

    const categoryOptions = [
        { value: '', label: 'Select category...' },
        { value: 'Tutorial', label: 'Tutorial' },
        { value: 'Post-Mortem', label: 'Post-Mortem' },
        { value: 'Resource', label: 'Resource' },
        { value: 'Guide', label: 'Guide' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            addToast({ type: 'error', message: 'Article title is required' });
            return;
        }

        if (!formData.category) {
            addToast({ type: 'error', message: 'Please select a category' });
            return;
        }

        if (!formData.content.trim()) {
            addToast({ type: 'error', message: 'Article content is required' });
            return;
        }

        const today = new Date().toISOString().split('T')[0];

        const newArticle: WikiArticle = {
            id: `article-${Date.now()}`,
            title: formData.title.trim(),
            category: formData.category as ArticleCategory,
            content: formData.content.trim(),
            author: currentUser?.id || 'unknown',
            createdDate: today,
            lastModified: today,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            views: 0,
        };

        addWikiArticle(newArticle);
        addToast({ type: 'success', message: 'Article created successfully' });
        onClose();

        // Reset form
        setFormData({ title: '', category: '', content: '', tags: '' });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Article" size="lg">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Article Title *"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., How to Calibrate the 3D Printer"
                    />

                    <Select
                        label="Category *"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ArticleCategory })}
                    />
                </div>

                <Input
                    label="Tags (comma-separated)"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="3d-printing, maintenance, equipment"
                />

                <Textarea
                    label="Content (Markdown supported) *"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Write your article content here..."
                    rows={10}
                />

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        Publish Article
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
