import React, { useState } from 'react';
import Modal from './Modal';

const KnowledgeBase = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [view, setView] = useState('cards'); // 'cards', 'list', 'tools'
    const [selectedCategory, setSelectedCategory] = useState('');
    const [expandedItem, setExpandedItem] = useState(null);
    const [selectedTool, setSelectedTool] = useState(null);

    const handleSearch = () => {
        if (searchTerm) {
            setSelectedCategory('all');
            setView('list');
        } else {
            setView('cards');
        }
    };

    const handleCategoryClick = (category) => {
        if (category === 'manuals') {
            // Ação para navegar para manuais
            return;
        }
        if (category === 'tools') {
            setView('tools');
        } else {
            setSelectedCategory(category);
            setView('list');
        }
    };
    
    const handlePopularItemClick = (category, itemId) => {
      setSelectedCategory(category);
      setView('list');
      // Adiciona um pequeno atraso para a animação de navegação
      setTimeout(() => {
        setExpandedItem(itemId);
      }, 50);
    };

    const handleItemClick = (itemId) => {
        setExpandedItem(expandedItem === itemId ? null : itemId);
    };

    const handleToolClick = (tool) => {
        setSelectedTool(tool);
    };

    const renderView = () => {
        if (view === 'cards') {
            return (
                <div className="card-grid">
                    <a href="#" className="card-link" data-category="tutorials" onClick={(e) => { e.preventDefault(); handleCategoryClick('tutorials'); }}>
                        <div className="card-icon"><i className="fa-solid fa-book-open-reader"></i></div>
                        <h3 className="card-title">Tutoriais e Guias</h3>
                        <p className="card-description">Aprenda a usar todas as funcionalidades do sistema com guias passo a passo.</p>
                    </a>
                    <a href="#" className="card-link" data-category="manuals" onClick={(e) => { e.preventDefault(); handleCategoryClick('manuals'); }}>
                        <div className="card-icon"><i className="fa-solid fa-file-invoice"></i></div>
                        <h3 className="card-title">Manuais Operacionais</h3>
                        <p className="card-description">Documentos detalhados sobre processos e procedimentos internos da equipe.</p>
                    </a>
                    <a href="#" className="card-link" data-category="solutions" onClick={(e) => { e.preventDefault(); handleCategoryClick('solutions'); }}>
                        <div className="card-icon"><i className="fa-solid fa-lightbulb"></i></div>
                        <h3 className="card-title">Soluções Comuns</h3>
                        <p className="card-description">Respostas rápidas para problemas e dúvidas frequentes do dia a dia.</p>
                    </a>
                    <a href="#" className="card-link" data-category="tools" onClick={(e) => { e.preventDefault(); handleCategoryClick('tools'); }}>
                        <div className="card-icon"><i className="fa-solid fa-tools"></i></div>
                        <h3 className="card-title">Ferramentas & IA</h3>
                        <p className="card-description">Plataformas e sites para otimizar seu trabalho e aumentar a produtividade.</p>
                    </a>
                </div>
            );
        } else if (view === 'list') {
            const items = (selectedCategory === 'all'
                ? [...data.tutorials, ...data.solutions, ...data.faq]
                : data[selectedCategory]) || [];

            const filteredItems = items.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );

            const categoryName = (category) => {
                switch(category) {
                    case 'tutorials': return 'Tutoriais e Guias';
                    case 'solutions': return 'Soluções Comuns';
                    case 'faq': return 'Perguntas Frequentes (FAQ)';
                    case 'all': return 'Resultados da Busca';
                    default: return '';
                }
            };
            
            return (
                <div className="knowledge-list-container visible">
                    <div className="list-header">
                        <button className="btn secondary" onClick={() => setView('cards')}><i className="fa-solid fa-arrow-left"></i> Voltar</button>
                        <h2 id="list-title">{categoryName(selectedCategory)}</h2>
                    </div>
                    <ul className="knowledge-list">
                        {filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <li key={item.id} className={`knowledge-item ${expandedItem === item.id ? 'expanded' : ''}`} onClick={() => handleItemClick(item.id)}>
                                    <h4>
                                        <span>{item.title}</span>
                                        <i className="fa-solid fa-chevron-down"></i>
                                    </h4>
                                    <div className="item-content">
                                        <p dangerouslySetInnerHTML={{ __html: item.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="content-placeholder">Nenhum resultado encontrado.</li>
                        )}
                    </ul>
                </div>
            );
        } else if (view === 'tools') {
            const iaTools = data.tools.filter(t => t.category === 'ia');
            const productivityTools = data.tools.filter(t => t.category === 'productivity');

            return (
                <div className="ai-tools-grid-container visible">
                    <div className="list-header">
                        <button className="btn secondary" onClick={() => setView('cards')}><i className="fa-solid fa-arrow-left"></i> Voltar</button>
                        <h2 id="tools-title">Ferramentas & IA</h2>
                    </div>
                    <div className="ai-tools-grid">
                        <h3 className="tools-category-title">Ferramentas de IA</h3>
                        <div className="ai-tool-subgrid">
                            {iaTools.map(tool => (
                                <a key={tool.id} href="#" className="ai-tool-card" onClick={(e) => { e.preventDefault(); handleToolClick(tool); }}>
                                    <img src={tool.logo} alt={`${tool.title} Logo`} className="ai-logo" />
                                    <h4>{tool.title}</h4>
                                </a>
                            ))}
                        </div>
                        <h3 className="tools-category-title">Ferramentas de Produtividade</h3>
                        <div className="ai-tool-subgrid">
                            {productivityTools.map(tool => (
                                <a key={tool.id} href="#" className="ai-tool-card" onClick={(e) => { e.preventDefault(); handleToolClick(tool); }}>
                                    <img src={tool.logo} alt={`${tool.title} Logo`} className="ai-logo" />
                                    <h4>{tool.title}</h4>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    };
    
    const allItems = [...data.tutorials, ...data.solutions, ...data.faq];
    allItems.sort((a, b) => (b.views || 0) - (a.views || 0));
    const popularItems = allItems.slice(0, 5);

    return (
        <>
            <div className="page-header">
                <h1 className="page-title"><i className="fa-solid fa-book"></i> Base de Conhecimentos</h1>
            </div>
            <div className="knowledge-base-container">
                <div className="search-bar">
                    <input type="text" id="knowledge-search" placeholder="Busque por tutoriais, manuais ou soluções..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }} />
                    <button id="search-btn" onClick={handleSearch}><i className="fa-solid fa-search"></i></button>
                </div>
                <div className="knowledge-content-wrapper">
                    {renderView()}
                </div>
                {view === 'cards' && (
                    <div className="knowledge-popular-section">
                        <h3 className="popular-title">Mais Populares</h3>
                        <ul id="popular-items-list">
                            {popularItems.map(item => {
                                const categoryKey = Object.keys(data).find(key => data[key].some(i => i.id === item.id));
                                return (
                                    <li key={item.id} className="popular-item" onClick={() => handlePopularItemClick(categoryKey, item.id)}>
                                        <i className="fa-solid fa-fire"></i> {item.title}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
            
            <Modal show={selectedTool !== null} onClose={() => setSelectedTool(null)}>
                {selectedTool && (
                    <div id="modal-ai-content">
                        <div className="ai-header">
                            <img id="ai-logo" src={selectedTool.logo} alt="Logo da Ferramenta" className="ai-logo-modal" />
                            <h2 id="ai-name">{selectedTool.title}</h2>
                        </div>
                        <div className="ai-description">
                            <p id="ai-description-text">{selectedTool.description}</p>
                        </div>
                        <div className="modal-buttons">
                            <a id="ai-link" href={selectedTool.url} target="_blank" rel="noopener noreferrer" className="btn primary">
                                <i className="fa-solid fa-arrow-up-right-from-square"></i> Acessar Site
                            </a>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default KnowledgeBase;