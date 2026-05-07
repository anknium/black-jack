// ============ 1. DOM要素の取得 ============
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const bettingScreen = document.getElementById('bettingScreen');
const gameScreen = document.getElementById('gameScreen');

const betSlider = document.getElementById('betSlider');
const betSpinner = document.getElementById('betSpinner');
const currentBetAmount = document.getElementById('currentBetAmount');
const confirmButton = document.getElementById('confirmButton');

// 設定画面用
const settingsButton = document.getElementById('settingsButton');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings = document.getElementById('closeSettings');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// 音量設定用
const bgmSlider = document.getElementById('bgmVolume');
const bgmValueDisplay = document.getElementById('bgmVolumeValue');
const seSlider = document.getElementById('seVolume');
const seValueDisplay = document.getElementById('seVolumeValue');

// ゲームアクション用
const hitButton = document.getElementById('hitButton');
const standButton = document.getElementById('standButton');
const dealerScoreDisplay = document.getElementById('dealerScore');
const playerScoreDisplay = document.getElementById('playerScore');
const playerNameDisplay = document.getElementById('playerName');

// カード表示エリア
const dealerCardsArea = document.querySelector('.dealer-cards');
const playerCardsArea = document.querySelector('.player-cards');

// キーバインド表示要素（設定画面の<span>）
const keySpans = document.querySelectorAll('.key-list span');

// ============ 2. データ管理 (状態) ============
let playerHand = [];
let dealerHand = [];
let isGameOver = false;
let isAssigningKey = null; // 現在キー設定中のアクション名

// デフォルトのキーバインド
let keyBinds = {
    hit: 'h',
    stand: 's',
    settings: 'Escape'
};

const cardPool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

// ============ 3. キーバインド設定ロジック ============

// 画面上のキー表示を最新の状態に更新する関数
function updateKeyDisplay() {
    keySpans.forEach(span => {
        const actionText = span.parentElement.textContent;
        if (actionText.includes('ヒット')) span.textContent = keyBinds.hit.toUpperCase();
        if (actionText.includes('スタンド')) span.textContent = keyBinds.stand.toUpperCase();
        if (actionText.includes('設定')) span.textContent = keyBinds.settings === 'Escape' ? 'ESC' : keyBinds.settings.toUpperCase();
        
        span.style.cursor = 'pointer';
    });
}

// 設定画面のキーをクリックした時の処理
keySpans.forEach(span => {
    span.addEventListener('click', function() {
        // すべての選択状態を解除
        keySpans.forEach(s => s.style.background = '#333');
        
        // 選択された項目を強調
        this.style.background = '#ff8b3d';
        this.textContent = '...';
        
        const actionText = this.parentElement.textContent;
        if (actionText.includes('ヒット')) isAssigningKey = 'hit';
        else if (actionText.includes('スタンド')) isAssigningKey = 'stand';
        else if (actionText.includes('設定')) isAssigningKey = 'settings';
    });
});

// キー入力イベント（ゲーム操作 ＆ キー割り当て）
window.addEventListener('keydown', function(e) {
    // A. キー割り当て中の場合
    if (isAssigningKey) {
        e.preventDefault();
        keyBinds[isAssigningKey] = e.key;
        isAssigningKey = null;
        updateKeyDisplay();
        return;
    }

    // B. 通常のゲーム操作
    const isSettingsOpen = settingsOverlay.classList.contains('active');

    // 設定画面を開く/閉じる (設定キー)
    if (e.key === keyBinds.settings) {
        if (isSettingsOpen) {
            settingsOverlay.classList.remove('active');
        } else {
            settingsOverlay.classList.add('active');
        }
        return;
    }

    // ゲーム中の操作（設定画面が閉じている時のみ有効）
    if (!isSettingsOpen && !isGameOver) {
        if (e.key.toLowerCase() === keyBinds.hit.toLowerCase()) {
            hitButton.click();
        } else if (e.key.toLowerCase() === keyBinds.stand.toLowerCase()) {
            standButton.click();
        }
    }
});

// ============ 4. ゲームロジック ============

function randomCard() {
    return cardPool[Math.floor(Math.random() * cardPool.length)];
}

function cardValue(card) {
    if (card === 'J' || card === 'Q' || card === 'K') return 10;
    if (card === 'A') return 11;
    return Number(card);
}

function calculateTotal(hand) {
    const validCards = hand.filter(card => card !== '裏');
    let total = validCards.reduce((sum, card) => sum + cardValue(card), 0);
    let aceCount = validCards.filter(card => card === 'A').length;

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount -= 1;
    }
    return total;
}

function createCardElement(card, isBack = false) {
    const cardDiv = document.createElement('div');
    cardDiv.className = isBack ? 'card card-back' : 'card card-front';
    cardDiv.textContent = isBack ? '裏' : card;
    return cardDiv;
}

function updateHandDisplay() {
    // プレイヤーカード
    playerCardsArea.innerHTML = '';
    playerHand.forEach(card => playerCardsArea.appendChild(createCardElement(card)));

    // ディーラーカード
    dealerCardsArea.innerHTML = '';
    dealerHand.forEach((card, index) => {
        dealerCardsArea.appendChild(createCardElement(card, card === '裏'));
    });

    playerScoreDisplay.textContent = calculateTotal(playerHand);
    dealerScoreDisplay.textContent = calculateTotal(dealerHand);
}

function startGame(betAmount) {
    console.log('ゲーム開始。掛け金: ¥' + betAmount);
    isGameOver = false;
    playerNameDisplay.textContent = 'プレイヤー';
    
    playerHand = [randomCard(), randomCard()];
    dealerHand = [randomCard(), '裏'];
    
    updateHandDisplay();
}

// ============ 5. イベントリスナー ============

// ヒットボタン
hitButton.addEventListener('click', function() {
    if (isGameOver) return;
    if (playerHand.length >= 5) return alert('5枚が上限です');

    playerHand.push(randomCard());
    updateHandDisplay();

    if (calculateTotal(playerHand) > 21) {
        alert('バースト！あなたの負けです。');
        isGameOver = true;
    }
});

// スタンドボタン
standButton.addEventListener('click', function() {
    if (isGameOver) return;
    alert('スタンドしました。ディーラーのターンへ...');
    // ここでディーラーのAIロジックを呼び出す
});

// 賭け金スライダー連動
betSlider.addEventListener('input', function() {
    betSpinner.value = this.value;
    currentBetAmount.textContent = this.value;
});

betSpinner.addEventListener('input', function() {
    betSlider.value = this.value;
    currentBetAmount.textContent = this.value;
});

// 音量スライダー
bgmSlider.addEventListener('input', function() {
    bgmValueDisplay.textContent = this.value;
});
seSlider.addEventListener('input', function() {
    seValueDisplay.textContent = this.value;
});

// 画面遷移
startButton.addEventListener('click', () => {
    startScreen.classList.remove('active');
    bettingScreen.classList.add('active');
});

confirmButton.addEventListener('click', () => {
    bettingScreen.classList.remove('active');
    gameScreen.classList.add('active');
    startGame(betSpinner.value);
});

// 設定画面
settingsButton.addEventListener('click', () => settingsOverlay.classList.add('active'));
closeSettings.addEventListener('click', () => {
    settingsOverlay.classList.remove('active');
    isAssigningKey = null; // 割り当て中断
    updateKeyDisplay();
});

// タブ切り替え
tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const targetTab = this.dataset.tab;
        tabButtons.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// 初期化
window.addEventListener('load', () => {
    updateKeyDisplay();
    currentBetAmount.textContent = betSlider.value;
});