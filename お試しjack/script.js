let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 1000;
let currentBet = 0;

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    deck = [];
    for (let s of suits) {
        for (let r of ranks) {
            let val = r === "A" ? 11 : (["J", "Q", "K"].includes(r) ? 10 : parseInt(r));
            deck.push({ display: s + r, value: val, rank: r, suit: s });
        }
    }
    deck.sort(() => Math.random() - 0.5);
}

function calculateScore(hand) {
    let score = hand.reduce((sum, card) => sum + card.value, 0);
    let aces = hand.filter(c => c.rank === "A").length;
    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }
    return score;
}

function addCardToUI(containerId, card, isHidden = false) {
    const container = document.getElementById(containerId);
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    if (isHidden) {
        cardDiv.classList.add("back");
        cardDiv.id = "dealer-hidden-card";
    } else {
        if (card.suit === "♥" || card.suit === "♦") cardDiv.classList.add("red");
        cardDiv.innerText = card.display;
    }
    container.appendChild(cardDiv);
}

function startGame() {
    // ゲームリセット
    if (deck.length < 10) createDeck();
    playerHand = [];
    dealerHand = [];
    document.getElementById("player2-hand").innerHTML = "";
    document.getElementById("dealer-hand").innerHTML = "";

    // 配牌
    const p1 = deck.pop();
    playerHand.push(p1);
    addCardToUI("player2-hand", p1);
    
    const d1 = deck.pop();
    dealerHand.push(d1);
    addCardToUI("dealer-hand", d1);
    
    const p2 = deck.pop();
    playerHand.push(p2);
    addCardToUI("player2-hand", p2);
    
    const d2 = deck.pop();
    dealerHand.push(d2);
    addCardToUI("dealer-hand", d2, true);

    document.getElementById("score-p2").innerText = calculateScore(playerHand);
    document.getElementById("dealer-score-val").innerText = "";
    
    document.getElementById("hit-btn").disabled = false;
    document.getElementById("stand-btn").disabled = false;

    if (calculateScore(playerHand) === 21) setTimeout(stand, 1000);
}

function hit() {
    const card = deck.pop();
    playerHand.push(card);
    addCardToUI("player2-hand", card);
    const score = calculateScore(playerHand);
    document.getElementById("score-p2").innerText = score;
    if (score > 21) endGame("BUST", "lose");
}

async function stand() {
    document.getElementById("hit-btn").disabled = true;
    document.getElementById("stand-btn").disabled = true;

    const hiddenCard = document.getElementById("dealer-hidden-card");
    const actualCard = dealerHand[1];
    hiddenCard.classList.remove("back");
    if (actualCard.suit === "♥" || actualCard.suit === "♦") hiddenCard.classList.add("red");
    hiddenCard.innerText = actualCard.display;
    
    document.getElementById("dealer-score-val").innerText = calculateScore(dealerHand);
    await new Promise(r => setTimeout(r, 600));

    while (calculateScore(dealerHand) < 17) {
        const card = deck.pop();
        dealerHand.push(card);
        addCardToUI("dealer-hand", card);
        document.getElementById("dealer-score-val").innerText = calculateScore(dealerHand);
        await new Promise(r => setTimeout(r, 800));
    }
    
    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(dealerHand);
    
    if (dScore > 21 || pScore > dScore) endGame("WIN", "win");
    else if (pScore < dScore) endGame("LOSE", "lose");
    else endGame("PUSH", "push");
}

function endGame(resultText, status) {
    if (status === "win") chips += currentBet * 2;
    if (status === "push") chips += currentBet;
    
    document.getElementById("chips-p2").innerText = chips;

    // 結果を表示（簡易版）
    alert(resultText);
    
    // 次のゲームに備える
    setTimeout(() => {
        document.getElementById("player2-hand").innerHTML = "";
        document.getElementById("dealer-hand").innerHTML = "";
        document.getElementById("score-p2").innerText = "-";
        document.getElementById("dealer-score-val").innerText = "-";
        
        if (chips <= 0) {
            alert("破産！100チップ追加します。");
            chips = 100;
            document.getElementById("chips-p2").innerText = chips;
        }
    }, 1000);
}

// トグルボタン機能
const toggleBtn = document.getElementById('toggle-btn');
const slideMenu = document.getElementById('slide-menu');

toggleBtn.addEventListener('click', function() {
    toggleBtn.classList.toggle('active');
    slideMenu.classList.toggle('open');
});

// 外側をクリックしたときにメニューを閉じる
document.addEventListener('click', function(event) {
    if (!toggleBtn.contains(event.target) && !slideMenu.contains(event.target)) {
        toggleBtn.classList.remove('active');
        slideMenu.classList.remove('open');
    }
});

createDeck();