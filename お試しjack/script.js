let deck = [];
let playerHand = [];
let dealerHand = [];
let chips = 1000;
let isGameOver = true;

function createDeck() {
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    deck = [];
    for (let s of suits) {
        for (let r of ranks) {
            let val = r === "A" ? 11 : (["J", "Q", "K"].includes(r) ? 10 : parseInt(r));
            deck.push({ display: s + r, value: val, rank: r });
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

function startGame() {
    if (deck.length < 10) createDeck();
    playerHand = [deck.pop(), deck.pop()];
    dealerHand = [deck.pop(), deck.pop()];
    isGameOver = false;
    document.getElementById("hit-btn").disabled = false;
    document.getElementById("stand-btn").disabled = false;
    document.getElementById("message").innerText = "アクションを選択してください";
    updateUI(false);
}

function hit() {
    playerHand.push(deck.pop());
    if (calculateScore(playerHand) > 21) {
        endGame("バースト！あなたの負けです");
    }
    updateUI(false);
}

function stand() {
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push(deck.pop());
    }
    
    const pScore = calculateScore(playerHand);
    const dScore = calculateScore(dealerHand);
    
    if (dScore > 21 || pScore > dScore) endGame("あなたの勝ちです！");
    else if (pScore < dScore) endGame("ディーラーの勝ちです");
    else endGame("プッシュ（引き分け）");
}

function endGame(msg) {
    isGameOver = true;
    document.getElementById("message").innerText = msg;
    document.getElementById("hit-btn").disabled = true;
    document.getElementById("stand-btn").disabled = true;
    updateUI(true);
}

function updateUI(reveal) {
    const pHandDiv = document.getElementById("player-hand");
    const dHandDiv = document.getElementById("dealer-hand");
    
    pHandDiv.innerHTML = playerHand.map(c => `<div class="card">${c.display}</div>`).join("");
    
    if (reveal) {
        dHandDiv.innerHTML = dealerHand.map(c => `<div class="card">${c.display}</div>`).join("");
        document.getElementById("dealer-score").innerText = calculateScore(dealerHand);
    } else {
        dHandDiv.innerHTML = `<div class="card">${dealerHand[0].display}</div><div class="card back"></div>`;
        document.getElementById("dealer-score").innerText = "?";
    }
    document.getElementById("player-score").innerText = calculateScore(playerHand);
}