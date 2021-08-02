const cards = document.getElementsByClassName("cards")[0];
console.log(cards);

function createCards(number){
    const card = document.createElement("div");
    card.className = "card";

    const topNumber = document.createElement("p");
    topNumber.innerText = number;

    const bottomNumber = document.createElement("p");
    bottomNumber.className = "right";
    bottomNumber.innerText = number;

    card.appendChild(topNumber);
    card.appendChild(bottomNumber);

    return card;
}

cards.appendChild(createCards(1));
cards.appendChild(createCards(2));
cards.appendChild(createCards(3));