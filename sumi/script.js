// DOM要素を取得
const startButton = document.getElementById('startButton');
const startScreen = document.getElementById('startScreen');
const bettingScreen = document.getElementById('bettingScreen');
const gameScreen = document.getElementById('gameScreen');

const betSlider = document.getElementById('betSlider');
const betSpinner = document.getElementById('betSpinner');
const currentBetAmount = document.getElementById('currentBetAmount');
const confirmButton = document.getElementById('confirmButton');

// ============ スライダーとスピナーの連動 ============
// スライダーの値が変わった時
betSlider.addEventListener('input', function() {
    const value = this.value;
    betSpinner.value = value;
    updateBetDisplay(value);
});

// スピナーの値が変わった時
betSpinner.addEventListener('input', function() {
    const value = this.value;
    betSlider.value = value;
    updateBetDisplay(value);
});

// 掛け金表示を更新
function updateBetDisplay(value) {
    currentBetAmount.textContent = value;
}

// ============ 画面遷移処理 ============
// ゲームスタートボタンをクリック
startButton.addEventListener('click', function() {
    // スタート画面を非表示、掛け金画面を表示
    startScreen.classList.remove('active');
    bettingScreen.classList.add('active');
});

// 確定ボタンをクリック
confirmButton.addEventListener('click', function() {
    const betAmount = betSpinner.value;
    console.log('掛け金が決定されました:', betAmount);
    
    // 掛け金画面を非表示、ゲーム画面を表示
    bettingScreen.classList.remove('active');
    gameScreen.classList.add('active');
    
    // ここからゲーム開始処理をおこなう
    startGame(betAmount);
});

const settingsButton = document.getElementById('settingsButton');
const hitButton = document.getElementById('hitButton');
const standButton = document.getElementById('standButton');
const dealerScore = document.getElementById('dealerScore');
const playerScore = document.getElementById('playerScore');
const playerName = document.getElementById('playerName');
const dealerCardFront = document.getElementById('dealerCardFront');
const dealerCardBack = document.getElementById('dealerCardBack');
const playerCardFront = document.getElementById('playerCardFront');
const playerCardBack = document.getElementById('playerCardBack');

const cardPool = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
let playerHand = [];
let dealerHand = [];

function randomCard() {
    const value = cardPool[Math.floor(Math.random() * cardPool.length)];
    return value;
}

function cardValue(card) {
    if (card === 'J' || card === 'Q' || card === 'K') {
        return 10;
    }
    if (card === 'A') {
        return 11;
    }
    return Number(card);
}

function calculateTotal(hand) {
    let total = hand.reduce((sum, card) => sum + cardValue(card), 0);
    let aceCount = hand.filter(card => card === 'A').length;

    while (total > 21 && aceCount > 0) {
        total -= 10;
        aceCount -= 1;
    }
    return total;
}

function updateHandDisplay() {
    const [playerFirst, playerSecond] = playerHand;
    const [dealerFirst, dealerHidden] = dealerHand;

    playerCardFront.textContent = playerFirst || '自分だけ表';
    playerCardBack.textContent = playerSecond || '自分だけ裏';
    dealerCardFront.textContent = dealerFirst || '表';
    dealerCardBack.textContent = dealerHidden || '裏';

    playerScore.textContent = playerHand.length ? calculateTotal(playerHand) : '--';
    dealerScore.textContent = dealerHand.length ? calculateTotal([dealerFirst]) : '--';
}

function startGame(betAmount) {
    console.log('ゲーム開始。掛け金: ¥' + betAmount);
    playerName.textContent = 'プレイヤー';
    playerHand = [randomCard(), randomCard()];
    dealerHand = [randomCard(), '裏'];
    updateHandDisplay();
}

settingsButton.addEventListener('click', function() {
    alert('設定を開きます。まだ実装されていません。');
});

hitButton.addEventListener('click', function() {
    if (playerHand.length >= 5) {
        alert('これ以上カードは引けません。');
        return;
    }
    playerHand.push(randomCard());
    updateHandDisplay();
});

standButton.addEventListener('click', function() {
    alert('スタンドしました。ディーラのターンへ進みます。');
});

// 初期化
window.addEventListener('load', function() {
    console.log('ブラックジャック - 初期化完了');
    updateBetDisplay(100);
});
