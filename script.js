const countries = [
  { id: 'mx', name: 'México' },
  { id: 'us', name: 'Estados Unidos' },
  { id: 'fr', name: 'Francia' },
  { id: 'jp', name: 'Japón' },
  { id: 'br', name: 'Brasil' },
  { id: 'ar', name: 'Argentina' },
  { id: 'de', name: 'Alemania' },
  { id: 'it', name: 'Italia' },
  { id: 'ca', name: 'Canadá' },
  { id: 'es', name: 'España' },
  { id: 'cn', name: 'China' },
  { id: 'kr', name: 'Corea del Sur' },
  { id: 'in', name: 'India' },
  { id: 'uk', name: 'Reino Unido' },
  { id: 'pt', name: 'Portugal' },
  { id: 'se', name: 'Suecia' },
  { id: 'no', name: 'Noruega' },
  { id: 'au', name: 'Australia' },
  { id: 'ru', name: 'Rusia' },
  { id: 'za', name: 'Sudáfrica' },
];

const gameBoard = document.getElementById("gameBoard");
const contadorElement = document.getElementById("contador");
const tiempoElement = document.getElementById("tiempo");
const mensajeFinal = document.getElementById("mensajeFinal");
const sonidoClick = document.getElementById("sonidoClick");
const sonidoAcierto = document.getElementById("sonidoAcierto");
const sonidoError = document.getElementById("sonidoError");
const dificultadSelect = document.getElementById("dificultad");
const iniciarBtn = document.getElementById("iniciarJuego");
const recordElement = document.getElementById("record");

let cards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let movimientos = 0;
let paresEncontrados = 0;
let tiempoRestante = 60;
let temporizador;

iniciarBtn.addEventListener("click", () => {
  reiniciarJuego();
});

function reiniciarJuego() {
  gameBoard.innerHTML = "";
  mensajeFinal.style.display = "none";
  mensajeFinal.textContent = "¡Has encontrado todos los pares! 🎉";
  movimientos = 0;
  paresEncontrados = 0;
  contadorElement.textContent = `Movimientos: ${movimientos}`;
  clearInterval(temporizador);

  let cantidadPares;
  switch (dificultadSelect.value) {
    case "facil":
      cantidadPares = 4;
      tiempoRestante = 90; // ⏱️ Fácil
      break;
    case "media":
      cantidadPares = 8;
      tiempoRestante = 60; // ⏱️ Media
      break;
    case "dificil":
    default:
      cantidadPares = 12;
      tiempoRestante = 45; // ⏱️ Difícil
      break;
  }

  tiempoElement.textContent = `Tiempo restante: ${tiempoRestante}s`;

  const seleccion = countries.slice(0, cantidadPares);
  cards = [];
  seleccion.forEach((country) => {
    cards.push({
      id: country.id,
      content: `<img src='https://flagcdn.com/w40/${country.id}.png' alt='${country.name}' width='30'>`
    });
    cards.push({
      id: country.id,
      content: country.name
    });
  });
  cards = shuffle(cards);

  crearTablero();
  iniciarTemporizador();
  mostrarRecord();
}

function crearTablero() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;

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
    back.innerHTML = cardData.content;

    cardInner.appendChild(front);
    cardInner.appendChild(back);
    card.appendChild(cardInner);
    gameBoard.appendChild(card);

    card.addEventListener("click", () => {
      sonidoClick.play();
      if (lockBoard || card.classList.contains("flipped")) return;

      card.classList.add("flipped");

      if (!firstCard) {
        firstCard = card;
      } else {
        secondCard = card;
        lockBoard = true;

        movimientos++;
        contadorElement.textContent = `Movimientos: ${movimientos}`;

        const id1 = firstCard.dataset.id;
        const id2 = secondCard.dataset.id;

        if (id1 === id2) {
          sonidoAcierto.play();
          paresEncontrados++;
          firstCard = null;
          secondCard = null;
          lockBoard = false;

          if (paresEncontrados === cards.length / 2) {
            clearInterval(temporizador);
            guardarRecord(dificultadSelect.value, movimientos, tiempoRestante);
            mostrarRecord();
            mensajeFinal.textContent = "🎉 ¡Ganaste!";
            mensajeFinal.style.display = "block";
          }
        } else {
          sonidoError.play();
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
}

function iniciarTemporizador() {
  temporizador = setInterval(() => {
    tiempoRestante--;
    tiempoElement.textContent = `Tiempo restante: ${tiempoRestante}s`;

    if (tiempoRestante <= 0) {
      clearInterval(temporizador);
      bloquearTablero();
      mensajeFinal.textContent = "⏰ ¡Tiempo agotado!";
      mensajeFinal.style.display = "block";
    }
  }, 1000);
}

function bloquearTablero() {
  const todasLasCartas = document.querySelectorAll(".card");
  todasLasCartas.forEach(card => card.style.pointerEvents = "none");
}

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function guardarRecord(dificultad, movimientos, tiempoRestante) {
  let records = JSON.parse(localStorage.getItem("records")) || {};

  if (!records[dificultad]) {
    records[dificultad] = { movimientos, tiempo: tiempoRestante };
  } else {
    const record = records[dificultad];
    if (movimientos < record.movimientos ||
        (movimientos === record.movimientos && tiempoRestante > record.tiempo)) {
      records[dificultad] = { movimientos, tiempo: tiempoRestante };
    }
  }

  localStorage.setItem("records", JSON.stringify(records));
}

function mostrarRecord() {
  let records = JSON.parse(localStorage.getItem("records")) || {};
  const dificultad = dificultadSelect.value;
  const record = records[dificultad];

  if (!recordElement) return;
  if (record) {
    recordElement.textContent = `🏅 Récord ${dificultad} → Movimientos: ${record.movimientos}, Tiempo: ${record.tiempo}s`;
  } else {
    recordElement.textContent = "🏅 Sin récord guardado aún";
  }
}
