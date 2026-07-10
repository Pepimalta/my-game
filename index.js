const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Carrega a sprite sheet
const spriteSheet = new Image();
spriteSheet.src = "spritesheet.PNG-1.png.png";

// Posição do pássaro
let birdX = 80;
let birdY = 120;

// Movimento vertical
let velocidadeY = 0;

// Física
const gravidade = 0.6;
const forcaDoPulo = -10;

// Tamanho do pássaro no jogo
const birdWidth = 134;
const birdHeight = 70;

// Faz o pássaro pular ao apertar Espaço
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        velocidadeY = forcaDoPulo;
    }
});

function atualizar() {
    // Aplica a gravidade
    velocidadeY += gravidade;
    birdY += velocidadeY;

    // Define a posição do chão
    const chao = canvas.height - birdHeight;

    // Impede o pássaro de atravessar o chão
    if (birdY > chao) {
        birdY = chao;
        velocidadeY = 0;
    }

    // Impede o pássaro de sair pelo topo
    if (birdY < 0) {
        birdY = 0;
        velocidadeY = 0;
    }
}

function desenhar() {
    // Limpa a tela
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha somente o primeiro pássaro
    ctx.drawImage(
        spriteSheet,

        3, 84,          // posição do pássaro na sprite sheet
        67, 35,         // tamanho do recorte

        birdX, birdY,   // posição no canvas
        birdWidth,
        birdHeight
    );
}

function loopDoJogo() {
    atualizar();
    desenhar();

    requestAnimationFrame(loopDoJogo);
}

// Começa o jogo quando a imagem carregar
spriteSheet.onload = function () {
    loopDoJogo();
};

// Mostra erro caso a imagem não carregue
spriteSheet.onerror = function () {
    console.error("Não foi possível carregar a sprite sheet.");
};
