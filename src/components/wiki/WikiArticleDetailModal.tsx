// ============================================
// Wiki Article Detail Modal
// ============================================

import { useState, useEffect } from 'react';
import { Modal, Button, Input, Textarea, Select } from '../ui';
import { useStore } from '../../lib/store';
import { Edit2, Trash2, Calendar, User, Clock, Eye } from 'lucide-react';
import type { ArticleCategory } from '../../lib/types';
import { formatDate } from '../../lib/utils';
import ReactMarkdown from 'react-markdown';

interface WikiArticleDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    articleId: string | null;
}

export const WikiArticleDetailModal: React.FC<WikiArticleDetailModalProps> = ({
    isOpen,
    onClose,
    articleId
}) => {
    const { wikiArticles, members, updateWikiArticle, deleteWikiArticle, addToast } = useStore();
    const [isEditing, setIsEditing] = useState(false);

    // Find article
    const article = wikiArticles.find(a => a.id === articleId);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        category: '' as ArticleCategory,
        content: '',
        tags: '',
    });

    // Reset state when modal opens/closes or article changes
    useEffect(() => {
        if (isOpen && article) {
            setFormData({
                title: article.title,
                category: article.category,
                content: article.content,
                tags: article.tags.join(', '),
            });
            setIsEditing(false);

            // Increment view count on open
            updateWikiArticle(article.id, { views: article.views + 1 });
        }
    }, [isOpen, articleId]);

    if (!article) return null;

    const author = members.find(m => m.id === article.author);
    const categoryOptions = [
        { value: 'Tutorial', label: 'Tutorial' },
        { value: 'Post-Mortem', label: 'Post-Mortem' },
        { value: 'Resource', label: 'Resource' },
        { value: 'Guide', label: 'Guide' },
    ];

    const handleSave = () => {
        if (!formData.title.trim()) {
            addToast({ type: 'error', message: 'Title is required' });
            return;
        }

        updateWikiArticle(article.id, {
            title: formData.title,
            category: formData.category,
            content: formData.content,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            lastModified: new Date().toISOString().split('T')[0],
        });

        addToast({ type: 'success', message: 'Article updated successfully' });
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            deleteWikiArticle(article.id);
            addToast({ type: 'success', message: 'Article deleted' });
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? 'Edit Article' : article.title}
            size="lg"
        >
            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <Select
                            label="Category"
                            options={categoryOptions}
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as ArticleCategory })}
                        />
                    </div>
                    <Input
                        label="Tags (comma separated)"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                    <Textarea
                        label="Content (Markdown)"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={12}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Meta Bar */}
                    <div className="flex items-center gap-4 text-xs text-text-muted border-b border-slate-100 pb-4">
                        <span className={`px-2 py-0.5 rounded-full font-medium ${article.category === 'Tutorial' ? 'bg-blue-100 text-blue-700' :
                            article.category === 'Post-Mortem' ? 'bg-red-100 text-red-700' :
                                'bg-slate-100 text-slate-700'
                            }`}>
                            {article.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" /> {author?.name || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {formatDate(article.createdDate)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Modified: {formatDate(article.lastModified)}
                        </span>
                        <span className="flex items-center gap-1 ml-auto">
                            <Eye className="w-3 h-3" /> {article.views} views
                        </span>
                    </div>

                    {/* Content */}
                    <div className="prose prose-sm max-w-none text-text-secondary">
                        <ReactMarkdown>{article.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {article.tags.length > 0 && (
                        <div className="flex gap-2 pt-4">
                            {article.tags.map(tag => (
                                <span key={tag} className="text-xs bg-slate-50 text-text-dim px-2 py-1 rounded">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <Button
                            variant="outline"
                            leftIcon={<Edit2 className="w-4 h-4" />}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit
                        </Button>
                        <Button
                            variant="danger"
                            leftIcon={<Trash2 className="w-4 h-4" />}
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};
