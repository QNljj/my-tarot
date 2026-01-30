/**
 * 塔罗牌 SPA 应用程序
 * 模块化架构，数据与逻辑分离
 */
class TarotApp {
    constructor() {
        this.currentView = 'all';
        this.currentCard = null;
        this.previousView = 'all';
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleRoute();
    }

    // 绑定事件
    bindEvents() {
        // 浏览器前进后退
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }

    // 切换视图
    switchView(view, cardId = null) {
        this.previousView = this.currentView;
        this.currentView = view;
        this.currentCard = cardId;

        // 更新URL
        let url = window.location.pathname;
        const params = new URLSearchParams();
        if (cardId) {
            params.set('card', cardId);
        }
        const queryString = params.toString();
        if (queryString) {
            url += '?' + queryString;
        }
        window.history.pushState({ view, cardId }, '', url);

        this.render();
        window.scrollTo(0, 0);
    }

    // 处理路由
    handleRoute() {
        const params = new URLSearchParams(window.location.search);
        const view = params.get('view') || 'all';
        const cardId = params.get('card');

        this.currentView = view;
        this.currentCard = cardId;

        this.render();
    }

    // 渲染主内容
    render() {
        const container = document.getElementById('main-content');

        if (this.currentCard) {
            container.innerHTML = this.renderCardDetail(this.currentCard);
            return;
        }

        container.innerHTML = this.renderAllCards();
    }

    // 渲染介绍页
    renderIntro() {
        const majorCards = TarotData.getSuit('majorArcana') || [];
        const wandsCards = TarotData.getSuit('wands') || [];
        const cupsCards = TarotData.getSuit('cups') || [];
        const swordsCards = TarotData.getSuit('swords') || [];
        const pentaclesCards = TarotData.getSuit('pentacles') || [];

        const renderMiniCards = () => {
            const allCards = [
                ...majorCards.map(c => ({...c, suit: 'majorArcana'})),
                ...wandsCards.map(c => ({...c, suit: 'wands'})),
                ...cupsCards.map(c => ({...c, suit: 'cups'})),
                ...swordsCards.map(c => ({...c, suit: 'swords'})),
                ...pentaclesCards.map(c => ({...c, suit: 'pentacles'}))
            ];
            return allCards.map(card => {
                const displayName = card.suit === 'majorArcana' ? `${card.num} ${card.name}` : card.name;
                return `<span class="mini-card ${card.suit}" onclick="app.showCardDetail('${card.id}')">${displayName}</span>`;
            }).join('');
        };

        return `
            <div class="intro-page">
                <div class="quick-cards-section">
                    <h3 class="quick-cards-title">🔮 快速导航</h3>
                    <div class="quick-cards-container">
                        ${renderMiniCards()}
                    </div>
                </div>

                <div class="intro-section">
                    <h2>关于塔罗牌</h2>
                <p>塔罗牌是一套起源于欧洲的占卜工具，包含78张牌，分为大阿尔卡纳（Major Arcana）22张和小阿尔卡纳（Minor Arcana）56张。小阿尔卡纳又分为四个牌组：权杖（Wands）、圣杯（Cups）、宝剑（Swords）和星币（Pentacles），每组14张牌。</p>
                <p>每张塔罗牌都蕴含着丰富的象征意义，可以帮助我们洞察内心、理解现状、预测未来。</p>

                <h2>四元素与牌组</h2>
                <div class="elements-grid">
                    <div class="element-card wands">
                        <div class="icon">🔥</div>
                        <h4>权杖 - 火元素</h4>
                        <p>行动、创造力、热情、事业</p>
                    </div>
                    <div class="element-card cups">
                        <div class="icon">💧</div>
                        <h4>圣杯 - 水元素</h4>
                        <p>情感、直觉、关系、内心</p>
                    </div>
                    <div class="element-card swords">
                        <div class="icon">💨</div>
                        <h4>宝剑 - 风元素</h4>
                        <p>思想、理智、冲突、挑战</p>
                    </div>
                    <div class="element-card pentacles">
                        <div class="icon">🌍</div>
                        <h4>星币 - 土元素</h4>
                        <p>物质、金钱、工作、实际</p>
                    </div>
                </div>

                <h2>如何使用</h2>
                <p>点击上方导航标签浏览不同牌组，点击任意塔罗牌查看详细解读。每张牌的详细解析包括牌面描述、正位与逆位含义、不同情境的解读。</p>

                <h2>大阿尔卡纳的旅程</h2>
                <p>大阿尔卡纳的22张牌描绘了"愚人之旅"——一个灵魂从出生到圆满的完整成长历程：</p>
                <p><strong>0 愚人</strong>：旅程的开始，纯真的出发<br>
                <strong>1-7 意识层面</strong>：魔术师到战车，建立外在能力<br>
                <strong>8-14 潜意识层面</strong>：力量到节制，内在转化<br>
                <strong>15-21 超意识层面</strong>：恶魔到世界，灵性觉醒与圆满</p>
            </div>
        `;
    }

    // 渲染卡片网格
    renderCardGrid(cards, suit) {
        if (!cards || cards.length === 0) {
            return '<div class="empty-state"><p>暂无数据</p></div>';
        }

        const cardsHtml = cards.map(card => `
            <div class="card-item ${suit}" onclick="app.showCardDetail('${card.id}')">
                <div class="num">${card.num}</div>
                <div class="name">${card.name}</div>
            </div>
        `).join('');

        return `
            <div class="card-grid">
                ${cardsHtml}
            </div>
        `;
    }

    // 渲染所有牌（78张）
    renderAllCards() {
        const majorCards = TarotData.getSuit('majorArcana') || [];
        const wandsCards = TarotData.getSuit('wands') || [];
        const cupsCards = TarotData.getSuit('cups') || [];
        const swordsCards = TarotData.getSuit('swords') || [];
        const pentaclesCards = TarotData.getSuit('pentacles') || [];

        const renderSection = (title, cards, suit) => {
            if (!cards || cards.length === 0) return '';
            const cardsHtml = cards.map(card => {
                const imgPath = TarotData.getCardImagePath(card.id);
                return `
                    <div class="card-item ${suit}" onclick="app.showCardDetail('${card.id}')">
                        <div class="card-thumbnail">
                            <img src="${imgPath || `https://via.placeholder.com/150x240/f5f5f5/666?text=${encodeURIComponent(card.name)}`}" alt="${card.name}" loading="lazy">
                        </div>
                        <div class="card-label">${card.name}</div>
                    </div>
                `;
            }).join('');
            return `
                <div class="suit-section">
                    <h3 class="suit-title ${suit}">${title}</h3>
                    <div class="card-grid">${cardsHtml}</div>
                </div>
            `;
        };

        return `
            <div class="all-cards-container">
                ${renderSection('大阿尔卡纳 (22张)', majorCards, 'majorArcana')}
                ${renderSection('权杖牌组 (14张)', wandsCards, 'wands')}
                ${renderSection('圣杯牌组 (14张)', cupsCards, 'cups')}
                ${renderSection('宝剑牌组 (14张)', swordsCards, 'swords')}
                ${renderSection('星币牌组 (14张)', pentaclesCards, 'pentacles')}
            </div>
        `;
    }

    // 显示卡片详情
    showCardDetail(cardId) {
        this.switchView(this.currentView, cardId);
    }

    // 渲染卡片详情
    renderCardDetail(cardId) {
        const card = TarotData.getCardById(cardId);
        if (!card) return '<p>卡片未找到</p>';

        const suit = this.getSuitFromCardId(cardId);
        const color = TarotData.getSuitColor(suit);

        // 判断是大阿卡纳还是小阿卡纳
        const isMajor = suit === 'majorArcana';

        if (isMajor) {
            return this.renderMajorArcanaDetail(card, suit);
        } else {
            return this.renderMinorArcanaDetail(card, suit);
        }
    }

    // 获取牌图路径 (韦特塔罗牌 Rider-Waite)
    generateCardImage(card, suit) {
        // 优先使用 dataManager 中的图片路径
        const imagePath = TarotData.getCardImagePath(card.id);
        if (imagePath) {
            return imagePath;
        }

        // 如果没有找到图片路径，使用占位图
        return `https://via.placeholder.com/200x320/f5f5f5/666?text=${encodeURIComponent(card.name)}`;
    }

    // 渲染大阿卡纳详情
    renderMajorArcanaDetail(card, suit) {
        return `
            <div class="detail-view">
                <button class="back-btn" onclick="app.goBack()">
                    ← 返回列表
                </button>

                <div class="detail-header">
                    <div class="detail-layout">
                        <div class="card-image">
                            <img src="${this.generateCardImage(card, suit)}" alt="${card.name}" />
                        </div>
                        <div class="card-info">
                            <h2>${card.name}</h2>
                            <div class="english">${card.english}</div>

                            <div class="detail-meta">
                                <div class="meta-item">
                                    <div class="label">编号</div>
                                    <div class="value">${card.num}</div>
                                </div>
                                <div class="meta-item">
                                    <div class="label">元素</div>
                                    <div class="value">${card.element}</div>
                                </div>
                                <div class="meta-item">
                                    <div class="label">占星对应</div>
                                    <div class="value">${card.planet}</div>
                                </div>
                            </div>

                            <div class="keywords">
                                ${card.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3 class="${suit}">📖 牌面描述</h3>
                    <p>${card.description}</p>
                </div>

                <div class="section">
                    <h3 class="${suit}">✅ 正位含义</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card upright">
                            <h4>总体解释</h4>
                            <p>${card.upright.general}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>爱情与感情</h4>
                            <p>${card.upright.love}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>事业与工作</h4>
                            <p>${card.upright.career}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>财富与金钱</h4>
                            <p>${card.upright.wealth}</p>
                        </div>
                        ${card.upright.health ? `
                        <div class="meaning-card upright">
                            <h4>健康</h4>
                            <p>${card.upright.health}</p>
                        </div>
                        ` : ''}
                        ${card.upright.spiritual ? `
                        <div class="meaning-card upright">
                            <h4>心灵成长</h4>
                            <p>${card.upright.spiritual}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="section">
                    <h3 class="${suit}">🔄 逆位含义</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card reversed">
                            <h4>总体解释</h4>
                            <p>${card.reversed.general}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>爱情与感情</h4>
                            <p>${card.reversed.love}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>事业与工作</h4>
                            <p>${card.reversed.career}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>财富与金钱</h4>
                            <p>${card.reversed.wealth}</p>
                        </div>
                        ${card.reversed.health ? `
                        <div class="meaning-card reversed">
                            <h4>健康</h4>
                            <p>${card.reversed.health}</p>
                        </div>
                        ` : ''}
                        ${card.reversed.spiritual ? `
                        <div class="meaning-card reversed">
                            <h4>心灵成长</h4>
                            <p>${card.reversed.spiritual}</p>
                        </div>
                        ` : ''}
                    </div>
                </div>

                ${card.positions ? `
                <div class="section">
                    <h3 class="${suit}">📍 不同位置解读</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card">
                            <h4>过去</h4>
                            <p>${card.positions.past}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>现在</h4>
                            <p>${card.positions.present}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>未来</h4>
                            <p>${card.positions.future}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>建议</h4>
                            <p>${card.positions.advice}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // 渲染小阿卡纳详情
    renderMinorArcanaDetail(card, suit) {
        return `
            <div class="detail-view">
                <button class="back-btn" onclick="app.goBack()">
                    ← 返回列表
                </button>

                <div class="detail-header">
                    <div class="detail-layout">
                        <div class="card-image">
                            <img src="${this.generateCardImage(card, suit)}" alt="${card.name}" />
                        </div>

                        <div class="card-info">
                            <h2>${card.name}</h2>
                            <div class="english">${card.english}</div>

                            <div class="detail-meta">
                                <div class="meta-item">
                                    <div class="label">编号</div>
                                    <div class="value">${card.num}</div>
                                </div>
                                <div class="meta-item">
                                    <div class="label">元素</div>
                                    <div class="value">${card.element}</div>
                                </div>
                            </div>

                            <div class="keywords">
                                ${card.keywords.map(k => `<span class="keyword">${k}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3 class="${suit}">📖 牌面描述</h3>
                    <p>${card.description}</p>
                </div>

                <div class="section">
                    <h3 class="${suit}">✅ 正位含义</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card upright">
                            <h4>总体解释</h4>
                            <p>${card.upright.general}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>爱情与感情</h4>
                            <p>${card.upright.love}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>事业与工作</h4>
                            <p>${card.upright.career}</p>
                        </div>
                        <div class="meaning-card upright">
                            <h4>财富与金钱</h4>
                            <p>${card.upright.wealth}</p>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h3 class="${suit}">🔄 逆位含义</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card reversed">
                            <h4>总体解释</h4>
                            <p>${card.reversed.general}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>爱情与感情</h4>
                            <p>${card.reversed.love}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>事业与工作</h4>
                            <p>${card.reversed.career}</p>
                        </div>
                        <div class="meaning-card reversed">
                            <h4>财富与金钱</h4>
                            <p>${card.reversed.wealth}</p>
                        </div>
                    </div>
                </div>

                ${card.positions ? `
                <div class="section">
                    <h3 class="${suit}">📍 不同位置解读</h3>
                    <div class="meaning-grid">
                        <div class="meaning-card">
                            <h4>过去</h4>
                            <p>${card.positions.past}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>现在</h4>
                            <p>${card.positions.present}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>未来</h4>
                            <p>${card.positions.future}</p>
                        </div>
                        <div class="meaning-card">
                            <h4>建议</h4>
                            <p>${card.positions.advice}</p>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        `;
    }

    // 从卡片ID获取牌组
    getSuitFromCardId(cardId) {
        if (cardId.startsWith('wands')) return 'wands';
        if (cardId.startsWith('cups')) return 'cups';
        if (cardId.startsWith('swords')) return 'swords';
        if (cardId.startsWith('pentacles')) return 'pentacles';
        return 'majorArcana';
    }

    // 返回上一页
    goBack() {
        this.currentCard = null;
        this.switchView('all');
    }
}

// 初始化应用
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new TarotApp();
});
