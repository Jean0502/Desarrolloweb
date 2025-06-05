const countries = [
    { id: 'mx', flag: '🇲🇽', name: 'México' },
    { id: 'us', flag: '🇺🇸', name: 'Estados Unidos' },
    { id: 'fr', flag: '🇫🇷', name: 'Francia' },
    { id: 'jp', flag: '🇯🇵', name: 'Japón' },
    { id: 'br', flag: '🇧🇷', name: 'Brasil' },
    { id: 'ar', flag: '🇦🇷', name: 'Argentina' },
    { id: 'de', flag: '🇩🇪', name: 'Alemania' },
    { id: 'it', flag: '🇮🇹', name: 'Italia' },
    { id: 'ca', flag: '🇨🇦', name: 'Canadá' },
    { id: 'es', flag: '🇪🇸', name: 'España' },
    { id: 'cn', flag: '🇨🇳', name: 'China' },
    { id: 'kr', flag: '🇰🇷', name: 'Corea del Sur' },
    { id: 'in', flag: '🇮🇳', name: 'India' },
    { id: 'uk', flag: '🇬🇧', name: 'Reino Unido' },
    { id: 'pt', flag: '🇵🇹', name: 'Portugal' },
    { id: 'se', flag: '🇸🇪', name: 'Suecia' },
    { id: 'no', flag: '🇳🇴', name: 'Noruega' },
    { id: 'au', flag: '🇦🇺', name: 'Australia' },
    { id: 'ru', flag: '🇷🇺', name: 'Rusia' },
    { id: 'za', flag: '🇿🇦', name: 'Sudáfrica' },
  ];
  
  const gameBoard = document.getElementById("gameBoard");
  
  let cards = [];
  
  countries.forEach((country) => {
    cards.push({ id: country.id, content: country.flag });
    cards.push({ id: country.id, content: country.name });
  });
  
  cards = shuffle(cards);
  
  let firstCard = null;
  let secondCard = null;
  let lockBoard = false;
  
  cards.forEach((cardData) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.id = cardData.id;
  
    const cardInner = document.createElement("div");
    cardInner.classList.add("card-inner");
  
    const front = document.createElement("div");
    front.classList.add("card-front");
    front.textContent = "?";
  
    const back = document.createElement("div");
    back.classList.add("card-back");
    back.textContent = cardData.content;
  
    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
    gameBoard.appendChild(card);
  
    card.addEventListener("click", () => {
      if (lockBoard || card.classList.contains("flipped")) return;
  
      card.classList.add("flipped");
  
      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;
  
        const id1 = firstCard.dataset.id;
        const id2 = secondCard.dataset.id;
  
        if (id1 === id2) {
          firstCard = null;
          secondCard = null;
          lockBoard = false;
        } else {
          setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard = null;
            secondCard = null;
            lockBoard = false;
          }, 1000);
        }
      }
    });
  });
  
  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }
  