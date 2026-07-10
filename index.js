const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Carrega a sprite sheet
const spriteSheet = new Image();
spriteSheet.src = "spritesheet.PNG-1.png.png";

// -----------------------------
// CONFIGURAÇÕES GERAIS
// -----------------------------

const chaoY = canvas.height - 35;

let jogoAcabou = false;
let pontuacao = 0;

// -----------------------------
// PÁSSARO
// -----------------------------

const passaro = {
    x: 80,
    y: 0,

    largura: 100,
    altura: 52,

    velocidadeY: 0,
    gravidade: 0.6,
    forcaDoPulo: -8,

    frame: 0,
    tempoDoFrame: 0,
    noChao: true
};

passaro.y = chaoY - passaro.altura;

// Coordenadas dos dois pássaros na sprite sheet
const framesPassaro = [
    {
        x: 3,
        y: 84,
        largura: 68,
        altura: 35
    },
    {
        x: 122,
        y: 93,
        largura: 65,
        altura: 35
    }
];

// -----------------------------
// PEDRAS
// -----------------------------

let pedras = [];
let tempoParaPedra = 0;

function criarPedra() {
    const largura = 76;
    const altura = 36;

    pedras.push({
        x: canvas.width,
        y: chaoY - altura,

        largura: largura,
        altura: altura,

        velocidade: 6
    });
}

// -----------------------------
// NUVENS
// -----------------------------

let nuvens = [];
let tempoParaNuvem = 0;

function criarNuvem() {
    const nuvemGrande = Math.random() > 0.5;

    nuvens.push({
        x: canvas.width,
        y: 25 + Math.random() * 90,

        tipo: nuvemGrande ? "grande" : "pequena",

        largura: nuvemGrande ? 72 : 52,
        altura: nuvemGrande ? 36 : 24,

        velocidade: 1 + Math.random()
    });
}

// -----------------------------
// CONTROLE
// -----------------------------

document.addEventListener("keydown", function (evento) {
    if (evento.code !== "Space") {
        return;
    }

    evento.preventDefault();

    if (jogoAcabou) {
        reiniciarJogo();
        return;
    }

    if (passaro.noChao) {
        passaro.velocidadeY = passaro.forcaDoPulo;
        passaro.noChao = false;
    }
});

// -----------------------------
// ATUALIZAÇÃO DO JOGO
// -----------------------------

function atualizarPassaro() {
    passaro.velocidadeY += passaro.gravidade;
    passaro.y += passaro.velocidadeY;

    const posicaoDoChao = chaoY - passaro.altura;

    if (passaro.y >= posicaoDoChao) {
        passaro.y = posicaoDoChao;
        passaro.velocidadeY = 0;
        passaro.noChao = true;
    }

    if (passaro.y < 0) {
        passaro.y = 0;
        passaro.velocidadeY = 0;
    }

    // Troca a imagem das asas
    passaro.tempoDoFrame++;

    if (passaro.tempoDoFrame >= 10) {
        passaro.frame = passaro.frame === 0 ? 1 : 0;
        passaro.tempoDoFrame = 0;
    }
}

function atualizarPedras() {
    tempoParaPedra--;

    if (tempoParaPedra <= 0) {
        criarPedra();

        // Intervalo aleatório entre as pedras
        tempoParaPedra = 90 + Math.random() * 70;
    }

    for (const pedra of pedras) {
        pedra.x -= pedra.velocidade;
    }

    pedras = pedras.filter(function (pedra) {
        return pedra.x + pedra.largura > 0;
    });
}

function atualizarNuvens() {
    tempoParaNuvem--;

    if (tempoParaNuvem <= 0) {
        criarNuvem();

        tempoParaNuvem = 80 + Math.random() * 100;
    }

    for (const nuvem of nuvens) {
        nuvem.x -= nuvem.velocidade;
    }

    nuvens = nuvens.filter(function (nuvem) {
        return nuvem.x + nuvem.largura > 0;
    });
}

function verificarColisoes() {
    // Caixa de colisão um pouco menor que o desenho
    const passaroEsquerda = passaro.x + 15;
    const passaroDireita = passaro.x + passaro.largura - 15;
    const passaroTopo = passaro.y + 8;
    const passaroBase = passaro.y + passaro.altura - 5;

    for (const pedra of pedras) {
        const pedraEsquerda = pedra.x + 8;
        const pedraDireita = pedra.x + pedra.largura - 8;
        const pedraTopo = pedra.y + 5;
        const pedraBase = pedra.y + pedra.altura;

        const bateu =
            passaroDireita > pedraEsquerda &&
            passaroEsquerda < pedraDireita &&
            passaroBase > pedraTopo &&
            passaroTopo < pedraBase;

        if (bateu) {
            jogoAcabou = true;
        }
    }
}

function atualizar() {
    if (jogoAcabou) {
        return;
    }

    atualizarPassaro();
    atualizarNuvens();
    atualizarPedras();
    verificarColisoes();

    pontuacao++;
}

// -----------------------------
// DESENHO
// -----------------------------

function desenharNuvens() {
    for (const nuvem of nuvens) {
        let recorte;

        if (nuvem.tipo === "grande") {
            recorte = {
                x: 214,
                y: 110,
                largura: 18,
                altura: 9
            };
        } else {
            recorte = {
                x: 202,
                y: 100,
                largura: 13,
                altura: 6
            };
        }

        ctx.drawImage(
            spriteSheet,

            recorte.x,
            recorte.y,
            recorte.largura,
            recorte.altura,

            nuvem.x,
            nuvem.y,
            nuvem.largura,
            nuvem.altura
        );
    }
}

function desenharPedras() {
    for (const pedra of pedras) {
        ctx.drawImage(
            spriteSheet,

            70,
            94,
            38,
            18,

            pedra.x,
            pedra.y,
            pedra.largura,
            pedra.altura
        );
    }
}

function desenharPassaro() {
    const frameAtual = framesPassaro[passaro.frame];

    ctx.drawImage(
        spriteSheet,

        frameAtual.x,
        frameAtual.y,
        frameAtual.largura,
        frameAtual.altura,

        passaro.x,
        passaro.y,
        passaro.largura,
        passaro.altura
    );
}

function desenharChao() {
    ctx.beginPath();
    ctx.moveTo(0, chaoY);
    ctx.lineTo(canvas.width, chaoY);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.stroke();
}

function desenharPontuacao() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("Pontos: " + Math.floor(pontuacao / 10), 20, 30);
}

function desenharGameOver() {
    if (!jogoAcabou) {
        return;
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    ctx.font = "bold 42px Arial";
    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 15
    );

    ctx.font = "20px Arial";
    ctx.fillText(
        "Aperte Espaço para reiniciar",
        canvas.width / 2,
        canvas.height / 2 + 30
    );
}

function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    desenharNuvens();
    desenharChao();
    desenharPedras();
    desenharPassaro();
    desenharPontuacao();
    desenharGameOver();
}

// -----------------------------
// REINÍCIO
// -----------------------------

function reiniciarJogo() {
    jogoAcabou = false;
    pontuacao = 0;

    pedras = [];
    nuvens = [];

    tempoParaPedra = 60;
    tempoParaNuvem = 20;

    passaro.y = chaoY - passaro.altura;
    passaro.velocidadeY = 0;
    passaro.noChao = true;
}

// -----------------------------
// LOOP PRINCIPAL
// -----------------------------

function loopDoJogo() {
    atualizar();
    desenhar();

    requestAnimationFrame(loopDoJogo);
}

spriteSheet.onload = function () {
    reiniciarJogo();
    loopDoJogo();
};

spriteSheet.onerror = function () {
    console.error("Não foi possível carregar a sprite sheet.");
};
