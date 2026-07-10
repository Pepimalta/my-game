const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const spriteSheet = new Image();
spriteSheet.src = "spritesheet.PNG-1.png.png";

// =====================================================
// ESTADOS DO JOGO
// =====================================================

const ESTADO = {
    MENU: "menu",
    JOGANDO: "jogando",
    PAUSADO: "pausado",
    GAME_OVER: "game_over"
};

let estadoAtual = ESTADO.MENU;

let pontuacao = 0;
let recorde = Number(localStorage.getItem("recordePassaro")) || 0;

let pedras = [];
let nuvens = [];

let tempoParaPedra = 80;
let tempoParaNuvem = 20;

// Velocidade geral do jogo
let velocidadeJogo = 6;

const velocidadeInicial = 6;
const velocidadeMaxima = 14;

const chaoY = canvas.height - 28;

// =====================================================
// PÁSSARO
// =====================================================

const passaro = {
    x: 90,
    y: 0,

    largura: 100,
    altura: 52,

    velocidadeY: 3,
    gravidade: 0.5,
    forcaDoPulo: -12,

    noChao: true
};

function colocarPassaroNoChao() {
    passaro.y = chaoY - passaro.altura;
    passaro.velocidadeY = 0;
    passaro.noChao = true;
}

colocarPassaroNoChao();

// =====================================================
// BOTÕES
// =====================================================

const botaoJogar = {
    x: canvas.width / 2 - 100,
    y: 170,
    largura: 200,
    altura: 55
};

const botaoReiniciar = {
    x: canvas.width / 2 - 120,
    y: 190,
    largura: 240,
    altura: 55
};

const botaoPausa = {
    x: canvas.width - 105,
    y: 15,
    largura: 85,
    altura: 35
};

// =====================================================
// CRIAÇÃO DOS OBJETOS
// =====================================================

function criarPedra() {
    const largura = 68;
    const altura = 35;

    pedras.push({
        x: canvas.width + 10,
        y: chaoY - altura,
        largura: largura,
        altura: altura
    });
}

function criarNuvem() {
    const grande = Math.random() > 0.5;

    nuvens.push({
        x: canvas.width + 10,
        y: 35 + Math.random() * 100,

        tipo: grande ? "grande" : "pequena",

        largura: grande ? 70 : 45,
        altura: grande ? 34 : 22,

        // Cada nuvem tem uma pequena variação própria
        multiplicadorVelocidade: 0.08 + Math.random() * 0.08
    });
}

// =====================================================
// CONTROLES
// =====================================================

document.addEventListener("keydown", function (evento) {
    if (evento.code === "Space") {
        evento.preventDefault();

        if (estadoAtual === ESTADO.MENU) {
            iniciarJogo();
            return;
        }

        if (estadoAtual === ESTADO.GAME_OVER) {
            iniciarJogo();
            return;
        }

        if (
            estadoAtual === ESTADO.JOGANDO &&
            passaro.noChao
        ) {
            passaro.velocidadeY = passaro.forcaDoPulo;
            passaro.noChao = false;
        }
    }

    if (evento.code === "KeyP") {
        alternarPausa();
    }
});

canvas.addEventListener("click", function (evento) {
    const retangulo = canvas.getBoundingClientRect();

    const escalaX = canvas.width / retangulo.width;
    const escalaY = canvas.height / retangulo.height;

    const mouseX =
        (evento.clientX - retangulo.left) * escalaX;

    const mouseY =
        (evento.clientY - retangulo.top) * escalaY;

    if (
        estadoAtual === ESTADO.MENU &&
        pontoDentroDoBotao(mouseX, mouseY, botaoJogar)
    ) {
        iniciarJogo();
        return;
    }

    if (
        estadoAtual === ESTADO.GAME_OVER &&
        pontoDentroDoBotao(mouseX, mouseY, botaoReiniciar)
    ) {
        iniciarJogo();
        return;
    }

    if (
        estadoAtual === ESTADO.JOGANDO &&
        pontoDentroDoBotao(mouseX, mouseY, botaoPausa)
    ) {
        estadoAtual = ESTADO.PAUSADO;
        return;
    }

    if (
        estadoAtual === ESTADO.PAUSADO &&
        pontoDentroDoBotao(mouseX, mouseY, botaoPausa)
    ) {
        estadoAtual = ESTADO.JOGANDO;
    }
});

function pontoDentroDoBotao(x, y, botao) {
    return (
        x >= botao.x &&
        x <= botao.x + botao.largura &&
        y >= botao.y &&
        y <= botao.y + botao.altura
    );
}

// =====================================================
// INÍCIO, PAUSA E FIM
// =====================================================

function iniciarJogo() {
    pontuacao = 0;
    velocidadeJogo = velocidadeInicial;

    pedras = [];
    nuvens = [];

    tempoParaPedra = 80;
    tempoParaNuvem = 20;

    colocarPassaroNoChao();

    estadoAtual = ESTADO.JOGANDO;
}

function alternarPausa() {
    if (estadoAtual === ESTADO.JOGANDO) {
        estadoAtual = ESTADO.PAUSADO;
    } else if (estadoAtual === ESTADO.PAUSADO) {
        estadoAtual = ESTADO.JOGANDO;
    }
}

function encerrarJogo() {
    estadoAtual = ESTADO.GAME_OVER;

    const pontosFinais = Math.floor(pontuacao / 10);

    if (pontosFinais > recorde) {
        recorde = pontosFinais;

        localStorage.setItem(
            "recordePassaro",
            recorde
        );
    }
}

// =====================================================
// ATUALIZAÇÃO DA VELOCIDADE
// =====================================================

function atualizarVelocidade() {
    const pontosAtuais = pontuacao / 10;

    /*
        A velocidade aumenta 1 ponto
        a cada 100 pontos do jogador.

        0 pontos    = velocidade 6
        100 pontos  = velocidade 7
        200 pontos  = velocidade 8
        300 pontos  = velocidade 9
        ...
        máximo      = velocidade 14
    */

    velocidadeJogo =
        velocidadeInicial + pontosAtuais / 100;

    if (velocidadeJogo > velocidadeMaxima) {
        velocidadeJogo = velocidadeMaxima;
    }
}

// =====================================================
// ATUALIZAÇÕES
// =====================================================

function atualizarPassaro() {
    passaro.velocidadeY += passaro.gravidade;
    passaro.y += passaro.velocidadeY;

    const posicaoDoChao =
        chaoY - passaro.altura;

    if (passaro.y >= posicaoDoChao) {
        passaro.y = posicaoDoChao;
        passaro.velocidadeY = 0;
        passaro.noChao = true;
    }

    if (passaro.y < 0) {
        passaro.y = 0;
        passaro.velocidadeY = 0;
    }
}

function atualizarPedras() {
    tempoParaPedra--;

    if (tempoParaPedra <= 0) {
        criarPedra();

        /*
            Mantém um espaço razoável entre as pedras,
            mesmo quando o jogo fica mais rápido.
        */
        tempoParaPedra =
            95 + Math.random() * 75;
    }

    for (const pedra of pedras) {
        pedra.x -= velocidadeJogo;
    }

    pedras = pedras.filter(function (pedra) {
        return pedra.x + pedra.largura > 0;
    });
}

function atualizarNuvens() {
    tempoParaNuvem--;

    if (tempoParaNuvem <= 0) {
        criarNuvem();

        tempoParaNuvem =
            100 + Math.random() * 130;
    }

    for (const nuvem of nuvens) {
        nuvem.x -=
            velocidadeJogo *
            nuvem.multiplicadorVelocidade;
    }

    nuvens = nuvens.filter(function (nuvem) {
        return nuvem.x + nuvem.largura > 0;
    });
}

function verificarColisoes() {
    const margemPassaroX = 14;
    const margemPassaroY = 8;

    const passaroEsquerda =
        passaro.x + margemPassaroX;

    const passaroDireita =
        passaro.x +
        passaro.largura -
        margemPassaroX;

    const passaroTopo =
        passaro.y + margemPassaroY;

    const passaroBase =
        passaro.y +
        passaro.altura -
        margemPassaroY;

    for (const pedra of pedras) {
        const pedraEsquerda = pedra.x + 7;

        const pedraDireita =
            pedra.x + pedra.largura - 7;

        const pedraTopo = pedra.y + 4;

        const pedraBase =
            pedra.y + pedra.altura;

        const bateu =
            passaroDireita > pedraEsquerda &&
            passaroEsquerda < pedraDireita &&
            passaroBase > pedraTopo &&
            passaroTopo < pedraBase;

        if (bateu) {
            encerrarJogo();
            return;
        }
    }
}

function atualizar() {
    if (estadoAtual !== ESTADO.JOGANDO) {
        return;
    }

    pontuacao++;

    atualizarVelocidade();
    atualizarPassaro();
    atualizarPedras();
    atualizarNuvens();
    verificarColisoes();
}

// =====================================================
// DESENHOS DO JOGO
// =====================================================

function desenharFundo() {
    const gradiente = ctx.createLinearGradient(
        0,
        0,
        0,
        canvas.height
    );

    gradiente.addColorStop(0, "#bfe8ff");
    gradiente.addColorStop(1, "#ffffff");

    ctx.fillStyle = gradiente;

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );
}

function desenharChao() {
    ctx.fillStyle = "#c8b38a";

    ctx.fillRect(
        0,
        chaoY,
        canvas.width,
        canvas.height - chaoY
    );

    ctx.strokeStyle = "#3c3327";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, chaoY);
    ctx.lineTo(canvas.width, chaoY);
    ctx.stroke();
}

function desenharNuvens() {
    for (const nuvem of nuvens) {
        let recorteX;
        let recorteY;
        let recorteLargura;
        let recorteAltura;

        if (nuvem.tipo === "grande") {
            recorteX = 211;
            recorteY = 109;
            recorteLargura = 22;
            recorteAltura = 12;
        } else {
            recorteX = 201;
            recorteY = 99;
            recorteLargura = 15;
            recorteAltura = 9;
        }

        ctx.drawImage(
            spriteSheet,

            recorteX,
            recorteY,
            recorteLargura,
            recorteAltura,

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

            73,
            94,
            36,
            19,

            pedra.x,
            pedra.y,
            pedra.largura,
            pedra.altura
        );
    }
}

function desenharPassaro() {
    ctx.save();

    const centroX =
        passaro.x + passaro.largura / 2;

    const centroY =
        passaro.y + passaro.altura / 2;

    ctx.translate(centroX, centroY);

    let inclinacao = 0;

    if (!passaro.noChao) {
        inclinacao = Math.max(
            -0.18,
            Math.min(
                0.18,
                passaro.velocidadeY * 0.015
            )
        );
    }

    ctx.rotate(inclinacao);

    ctx.drawImage(
        spriteSheet,

        3,
        84,
        67,
        35,

        -passaro.largura / 2,
        -passaro.altura / 2,

        passaro.largura,
        passaro.altura
    );

    ctx.restore();
}

// =====================================================
// INTERFACE
// =====================================================

function desenharPainelSuperior() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.78)";

    ctx.fillRect(
        12,
        12,
        315,
        46
    );

    ctx.strokeStyle = "#1e3550";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        12,
        12,
        315,
        46
    );

    ctx.fillStyle = "#17283b";
    ctx.textAlign = "left";
    ctx.font = "bold 18px Arial";

    ctx.fillText(
        "Pontos: " + Math.floor(pontuacao / 10),
        25,
        41
    );

    ctx.font = "15px Arial";

    ctx.fillText(
        "Recorde: " + recorde,
        140,
        40
    );

    ctx.fillText(
        "Velocidade: " + velocidadeJogo.toFixed(1),
        225,
        40
    );
}

function desenharBotao(botao, texto) {
    ctx.fillStyle = "#195dba";

    ctx.fillRect(
        botao.x,
        botao.y,
        botao.largura,
        botao.altura
    );

    ctx.strokeStyle = "#092b5c";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        botao.x,
        botao.y,
        botao.largura,
        botao.altura
    );

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 22px Arial";

    ctx.fillText(
        texto,
        botao.x + botao.largura / 2,
        botao.y + botao.altura / 2
    );

    ctx.textBaseline = "alphabetic";
}

function desenharBotaoPausa() {
    ctx.fillStyle = "rgba(255,255,255,0.85)";

    ctx.fillRect(
        botaoPausa.x,
        botaoPausa.y,
        botaoPausa.largura,
        botaoPausa.altura
    );

    ctx.strokeStyle = "#17283b";
    ctx.lineWidth = 2;

    ctx.strokeRect(
        botaoPausa.x,
        botaoPausa.y,
        botaoPausa.largura,
        botaoPausa.altura
    );

    ctx.fillStyle = "#17283b";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";

    const texto =
        estadoAtual === ESTADO.PAUSADO
            ? "CONTINUAR"
            : "PAUSAR";

    ctx.fillText(
        texto,
        botaoPausa.x + botaoPausa.largura / 2,
        botaoPausa.y + 23
    );
}

function desenharMenu() {
    ctx.fillStyle = "rgba(255,255,255,0.82)";

    ctx.fillRect(
        130,
        35,
        canvas.width - 260,
        215
    );

    ctx.strokeStyle = "#17283b";
    ctx.lineWidth = 4;

    ctx.strokeRect(
        130,
        35,
        canvas.width - 260,
        215
    );

    ctx.fillStyle = "#1255ae";
    ctx.textAlign = "center";
    ctx.font = "bold 42px Arial";

    ctx.fillText(
        "PÁSSARO PLANADOR",
        canvas.width / 2,
        90
    );

    ctx.fillStyle = "#17283b";
    ctx.font = "19px Arial";

    ctx.fillText(
        "Pule sobre as pedras e bata seu recorde!",
        canvas.width / 2,
        125
    );

    ctx.font = "16px Arial";

    ctx.fillText(
        "O jogo fica mais rápido gradualmente",
        canvas.width / 2,
        150
    );

    desenharBotao(
        botaoJogar,
        "JOGAR"
    );

    ctx.font = "14px Arial";
    ctx.fillStyle = "#405267";

    ctx.fillText(
        "Recorde atual: " + recorde,
        canvas.width / 2,
        245
    );
}

function desenharPausa() {
    ctx.fillStyle = "rgba(10, 20, 35, 0.62)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 48px Arial";

    ctx.fillText(
        "PAUSADO",
        canvas.width / 2,
        canvas.height / 2
    );

    ctx.font = "20px Arial";

    ctx.fillText(
        "Aperte P ou clique em Continuar",
        canvas.width / 2,
        canvas.height / 2 + 38
    );
}

function desenharGameOver() {
    ctx.fillStyle = "rgba(10, 20, 35, 0.72)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "bold 45px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        85
    );

    ctx.font = "22px Arial";

    ctx.fillText(
        "Pontuação: " + Math.floor(pontuacao / 10),
        canvas.width / 2,
        125
    );

    ctx.fillText(
        "Recorde: " + recorde,
        canvas.width / 2,
        155
    );

    desenharBotao(
        botaoReiniciar,
        "JOGAR NOVAMENTE"
    );

    ctx.font = "15px Arial";

    ctx.fillText(
        "Você também pode apertar Espaço",
        canvas.width / 2,
        270
    );
}

// =====================================================
// DESENHO PRINCIPAL
// =====================================================

function desenhar() {
    desenharFundo();
    desenharNuvens();
    desenharChao();
    desenharPedras();
    desenharPassaro();

    if (
        estadoAtual === ESTADO.JOGANDO ||
        estadoAtual === ESTADO.PAUSADO
    ) {
        desenharPainelSuperior();
        desenharBotaoPausa();
    }

    if (estadoAtual === ESTADO.MENU) {
        desenharMenu();
    }

    if (estadoAtual === ESTADO.PAUSADO) {
        desenharPausa();
        desenharBotaoPausa();
    }

    if (estadoAtual === ESTADO.GAME_OVER) {
        desenharGameOver();
    }
}

// =====================================================
// LOOP
// =====================================================

function loopDoJogo() {
    atualizar();
    desenhar();

    requestAnimationFrame(loopDoJogo);
}

spriteSheet.onload = function () {
    loopDoJogo();
};

spriteSheet.onerror = function () {
    console.error(
        "Não foi possível carregar a sprite sheet."
    );
};
