const space = document.querySelector('.space');
const cell = document.getElementsByClassName('cell');
const currentPlayer = document.getElementById('curPlyr');
const buttonPlay = document.querySelector('.select-button');
const playTitle = document.querySelector('.play-title');
const winIndex = [
  [1,2,3],
  [4,5,6],
  [7,8,9],
  [1,4,7],
  [2,5,8],
  [3,6,9],
  [1,5,9],
  [3,5,7]
]

let stat = {
  'x': 0,
  'o': 0,
  'd': 0
}
let player = "x";
let gameSelectionAuto;

//Изначальное состояние
if(JSON.parse(localStorage.getItem('stateGame')) === true) {
    gameSelectionAuto =  localStorage.getItem('stateGame')
    playTitle.textContent = 'Игра с компьютером'
} else {
    gameSelectionAuto = false;
    playTitle.textContent = 'Игра вдвоём'
}

//Кнопка Переключения режима игры
buttonPlay.addEventListener('click', togglePlay);

//Функция Переключение режима игры
function togglePlay() {
    localStorage.removeItem('game');
    localStorage.removeItem('stat');
    localStorage.removeItem('stateGame');
    restart("", false);

    updateStat({
        'x': 0,
        'o': 0,
        'd': 0
    });
    stat = {
        'x': 0,
        'o': 0,
        'd': 0
    };
  gameSelectionAuto = !gameSelectionAuto;
  if (!gameSelectionAuto) {
    playTitle.textContent = 'Игра вдвоём'
  } else {
    playTitle.textContent = 'Игра с компьютером'
  }
  localStorage.setItem('stateGame', gameSelectionAuto);
}

for (let i = 1; i <= 9; i++) {
    space.innerHTML += "<div class='cell' pos=" + i + "></div>"
}

for (let i = 0; i < cell.length; i++) {
    cell[i].addEventListener('click', cellClick, false);
}

if(localStorage.getItem('game')) {
    const arrGame = JSON.parse(localStorage.getItem('game'));
    const stat = JSON.parse(localStorage.getItem('stat'));

    for(let i = 0; i < cell.length; i++) {
        arrGame.map(obj => obj.position === cell[i].getAttribute('pos') ? cell[i].innerHTML = obj.html :
            obj)
    }

    updateStat(stat);

}
//Функция клика
function cellClick() {

    if(!this.innerHTML) {
        this.innerHTML = player;
    } else {
        alert("Ячейка занята");
        return;
    }

    const arr = pushArray();

  winText(arr.data);
  if(gameSelectionAuto) {
    player = player === "x" ? "o" : "x";
    autoMove();
  }
  player = player === "x" ? "o" : "x";
  currentPlayer.innerHTML = player.toUpperCase();

    if (!gameSelectionAuto) {
        localStorage.setItem('game', JSON.stringify(arr.arrLocalStorage));
    }
}
//функция компьютерного хода
function autoMove() {
  let t = Math.ceil(Math.random() * 8);

  if(cell[t].innerHTML.length === 0) {
    cell[t].innerHTML = player;
  } else {
    autoMove();
  }
  const arr = pushArray();
  winText(arr.data);
    localStorage.setItem('game', JSON.stringify(arr.arrLocalStorage));
}
//пушим в массивы
function pushArray() {
    const data = [];
    const arrLocalStorage = [];
    for(let i in cell){
        if(cell[i].innerHTML === player){
            data.push(parseInt(cell[i].getAttribute('pos')));
        }
        if (cell[i].innerHTML) {
            const position = {
                position: cell[i].getAttribute('pos'),
                html: cell[i].innerHTML
            }
            arrLocalStorage.push(position);
        }
    }
    return {
        data,
        arrLocalStorage
    };
}
//функция статистики и текста
function winText(data) {
  if(checkWin(data)) {
    stat[player] += 1;
    restart("Выграл: " + player, true);
  }else {
    let draw = true;
    for(let i in cell) {
      if(cell[i].innerHTML === '') draw = false;
    }
    if(draw) {
      stat.d += 1;
      restart("Ничья", true);
    }
  }
}
//проверка на выигрыш
function checkWin(data) {
    for(let i in winIndex) {
        let win = true;
        for(let j in winIndex[i]) {
            let id = winIndex[i][j];
            let ind = data.indexOf(id);

            if(ind === -1) {
                win = false
            }
        }
        if(win) return true;
    }
    return false;
}
//рестарт
function restart(text, show) {
    if(show) {
        alert(text);
    }
    for(let i = 0; i < cell.length; i++) {
        cell[i].innerHTML = '';
    }
    updateStat(stat);
}
//статистика
function updateStat(stat) {
    document.getElementById('sX').innerHTML = stat.x;
    document.getElementById('sO').innerHTML = stat.o;
    document.getElementById('sD').innerHTML = stat.d;

    localStorage.setItem('stat', JSON.stringify(stat));
}

