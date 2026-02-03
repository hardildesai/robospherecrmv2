import { useState } from 'react';
import { useStore } from '../lib/store';
import { Search, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import type { ArticleCategory } from '../lib/types';
import { WikiArticleDetailModal, CreateArticleModal } from '../components/wiki';

export const WikiPage = () => {
    const { wikiArticles, members } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<ArticleCategory | 'All'>('All');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

    const categories: ArticleCategory[] = ['Tutorial', 'Post-Mortem', 'Resource', 'Guide'];

    const getAuthorName = (id: string) => {
        return members.find(m => m.id === id)?.name || 'Unknown Author';
    };

    const filteredArticles = wikiArticles.filter(article =>
        (activeCategory === 'All' || article.category === activeCategory) &&
        (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    );

    return (
        <div className="h-full flex flex-col gap-6">
            {/* Create Article Modal */}
            <CreateArticleModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Article Detail Modal */}
            <WikiArticleDetailModal
                isOpen={!!selectedArticleId}
                onClose={() => setSelectedArticleId(null)}
                articleId={selectedArticleId}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Knowledge Base</h1>
                    <p className="text-text-secondary text-sm">Documentation, guides, and project archives.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search wiki..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 shadow-sm"
                        />
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-primary/25 hover:bg-primary-hover transition-colors"
                    >
                        <BookOpen className="w-4 h-4" /> New Article
                    </button>
                </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('All')}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${activeCategory === 'All'
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                        }`}
                >
                    All
                </button>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${activeCategory === cat
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article) => (
                    <motion.div
                        key={article.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all cursor-pointer group flex flex-col h-full"
                        onClick={() => setSelectedArticleId(article.id)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${article.category === 'Tutorial' ? 'bg-blue-50 text-blue-600' :
                                article.category === 'Post-Mortem' ? 'bg-red-50 text-red-600' :
                                    article.category === 'Guide' ? 'bg-emerald-50 text-emerald-600' :
                                        'bg-purple-50 text-purple-600'
                                }`}>
                                {article.category}
                            </span>
                            <span className="text-xs text-text-muted flex items-center gap-1">
                                {article.views} views
                            </span>
                        </div>

                        <h3 className="font-bold text-lg text-slate-800 mb-2 leading-tight group-hover:text-primary transition-colors">
                            {article.title}
                        </h3>

                        <p className="text-text-secondary text-sm mb-6 line-clamp-3 flex-1">
                            {article.content.replace(/#/g, '').substring(0, 150)}...
                        </p>

                        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-text-muted">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                                    {getAuthorName(article.author).charAt(0)}
                                </div>
                                <span>{getAuthorName(article.author)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(article.lastModified).toLocaleDateString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredArticles.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
                    <BookOpen className="w-12 h-12 mb-4 opacity-20" />
                    <p>No articles found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};
