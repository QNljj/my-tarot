/**
 * 塔罗牌数据管理器
 * 负责数据的注册、加载和查询
 */
const TarotData = {
    // 存储所有数据
    data: {
        majorArcana: [],
        wands: [],
        cups: [],
        swords: [],
        pentacles: []
    },

    // 已加载的数据源
    loadedSources: new Set(),

    // 注册数据
    register(source, data) {
        this.data[source] = data;
        this.loadedSources.add(source);
    },

    // 获取特定牌组的数据
    getSuit(suit) {
        return this.data[suit] || [];
    },

    // 获取所有数据
    getAll() {
        return [
            ...this.data.majorArcana,
            ...this.data.wands,
            ...this.data.cups,
            ...this.data.swords,
            ...this.data.pentacles
        ];
    },

    // 通过ID获取单张牌
    getCardById(id) {
        return this.getAll().find(card => card.id === id);
    },

    // 检查数据源是否已加载
    isLoaded(source) {
        return this.loadedSources.has(source);
    },

    // 获取牌组颜色
    getSuitColor(suit) {
        const colors = {
            majorArcana: '#9b59b6',
            wands: '#e74c3c',
            cups: '#3498db',
            swords: '#95a5a6',
            pentacles: '#27ae60'
        };
        return colors[suit] || '#666';
    },

    // 获取牌组中文名
    getSuitName(suit) {
        const names = {
            majorArcana: '大阿尔卡纳',
            wands: '权杖',
            cups: '圣杯',
            swords: '宝剑',
            pentacles: '星币'
        };
        return names[suit] || suit;
    },

    // 获取牌的图片路径 (韦特塔罗牌 Rider-Waite)
    getCardImagePath(cardId) {
        // 映射表 - 与数据文件中的ID对应
        const imageMap = {
            // ========== 大阿尔卡纳 (22张) ==========
            'fool': 'images/majorArcana/fool.jpg',
            'magician': 'images/majorArcana/magician.jpg',
            'priestess': 'images/majorArcana/priestess.jpg',
            'empress': 'images/majorArcana/empress.jpg',
            'emperor': 'images/majorArcana/emperor.jpg',
            'hierophant': 'images/majorArcana/hierophant.jpg',
            'lovers': 'images/majorArcana/lovers.jpg',
            'chariot': 'images/majorArcana/chariot.jpg',
            'strength': 'images/majorArcana/strength.jpg',
            'hermit': 'images/majorArcana/hermit.jpg',
            'wheel': 'images/majorArcana/wheel.jpg',
            'justice': 'images/majorArcana/justice.jpg',
            'hanged': 'images/majorArcana/hanged.jpg',
            'death': 'images/majorArcana/death.jpg',
            'temperance': 'images/majorArcana/temperance.jpg',
            'devil': 'images/majorArcana/devil.jpg',
            'tower': 'images/majorArcana/tower.jpg',
            'star': 'images/majorArcana/star.jpg',
            'moon': 'images/majorArcana/moon.jpg',
            'sun': 'images/majorArcana/sun.jpg',
            'judgement': 'images/majorArcana/judgement.jpg',
            'world': 'images/majorArcana/world.jpg',

            // ========== 权杖牌组 (14张) ==========
            'wands1': 'images/wands/wands1.jpg',    // 权杖首牌
            'wands2': 'images/wands/wands2.jpg',    // 权杖二
            'wands3': 'images/wands/wands3.jpg',    // 权杖三
            'wands4': 'images/wands/wands4.jpg',    // 权杖四
            'wands5': 'images/wands/wands5.jpg',    // 权杖五
            'wands6': 'images/wands/wands6.jpg',    // 权杖六
            'wands7': 'images/wands/wands7.jpg',    // 权杖七
            'wands8': 'images/wands/wands8.jpg',    // 权杖八
            'wands9': 'images/wands/wands9.jpg',    // 权杖九
            'wands10': 'images/wands/wands10.jpg',  // 权杖十
            'wands11': 'images/wands/wands11.jpg',  // 权杖侍从
            'wands12': 'images/wands/wands12.jpg',  // 权杖骑士
            'wands13': 'images/wands/wands13.jpg',  // 权杖皇后
            'wands14': 'images/wands/wands14.jpg',  // 权杖国王

            // ========== 圣杯牌组 (14张) ==========
            'cups1': 'images/cups/cups1.jpg',       // 圣杯首牌
            'cups2': 'images/cups/cups2.jpg',       // 圣杯二
            'cups3': 'images/cups/cups3.jpg',       // 圣杯三
            'cups4': 'images/cups/cups4.jpg',       // 圣杯四
            'cups5': 'images/cups/cups5.jpg',       // 圣杯五
            'cups6': 'images/cups/cups6.jpg',       // 圣杯六
            'cups7': 'images/cups/cups7.jpg',       // 圣杯七
            'cups8': 'images/cups/cups8.jpg',       // 圣杯八
            'cups9': 'images/cups/cups9.jpg',       // 圣杯九
            'cups10': 'images/cups/cups10.jpg',     // 圣杯十
            'cups11': 'images/cups/cups11.jpg',     // 圣杯侍从
            'cups12': 'images/cups/cups12.jpg',     // 圣杯骑士
            'cups13': 'images/cups/cups13.jpg',     // 圣杯皇后
            'cups14': 'images/cups/cups14.jpg',     // 圣杯国王

            // ========== 宝剑牌组 (14张) ==========
            'swords1': 'images/swords/swords1.jpg',     // 宝剑首牌
            'swords2': 'images/swords/swords2.jpg',     // 宝剑二
            'swords3': 'images/swords/swords3.jpg',     // 宝剑三
            'swords4': 'images/swords/swords4.jpg',     // 宝剑四
            'swords5': 'images/swords/swords5.jpg',     // 宝剑五
            'swords6': 'images/swords/swords6.jpg',     // 宝剑六
            'swords7': 'images/swords/swords7.jpg',     // 宝剑七
            'swords8': 'images/swords/swords8.jpg',     // 宝剑八
            'swords9': 'images/swords/swords9.jpg',     // 宝剑九
            'swords10': 'images/swords/swords10.jpg',   // 宝剑十
            'swords11': 'images/swords/swords11.jpg',   // 宝剑侍从
            'swords12': 'images/swords/swords12.jpg',   // 宝剑骑士
            'swords13': 'images/swords/swords13.jpg',   // 宝剑皇后
            'swords14': 'images/swords/swords14.jpg',   // 宝剑国王

            // ========== 星币牌组 (14张) ==========
            'pentacles1': 'images/pentacles/pentacles1.jpg',     // 星币首牌
            'pentacles2': 'images/pentacles/pentacles2.jpg',     // 星币二
            'pentacles3': 'images/pentacles/pentacles3.jpg',     // 星币三
            'pentacles4': 'images/pentacles/pentacles4.jpg',     // 星币四
            'pentacles5': 'images/pentacles/pentacles5.jpg',     // 星币五
            'pentacles6': 'images/pentacles/pentacles6.jpg',     // 星币六
            'pentacles7': 'images/pentacles/pentacles7.jpg',     // 星币七
            'pentacles8': 'images/pentacles/pentacles8.jpg',     // 星币八
            'pentacles9': 'images/pentacles/pentacles9.jpg',     // 星币九
            'pentacles10': 'images/pentacles/pentacles10.jpg',   // 星币十
            'pentacles11': 'images/pentacles/pentacles11.jpg',   // 星币侍从
            'pentacles12': 'images/pentacles/pentacles12.jpg',   // 星币骑士
            'pentacles13': 'images/pentacles/pentacles13.jpg',   // 星币皇后
            'pentacles14': 'images/pentacles/pentacles14.jpg'    // 星币国王
        };

        return imageMap[cardId] || null;
    }
};
