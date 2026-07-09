// Pega o canvas da página
const canvas = document.getElementById("game");

// Permite desenhar dentro do canvas
const ctx = canvas.getContext("2d");

// Cria a imagem da sprite sheet
const spriteSheet = new Image();

// Nome exato do arquivo enviado ao GitHub
spriteSheet.src = "spritesheet.PNG-1.png.png";

// Espera a imagem carregar
spriteSheet.onload = function () {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a sprite sheet no canvas
    ctx.drawImage(
        spriteSheet,

        0, 0,       // início do recorte na imagem
        250, 250,   // tamanho do recorte

        80, 40,     // posição no canvas
        125, 125    // tamanho desenhado
    );
};

// Mostra um erro no console se a imagem não carregar
spriteSheet.onerror = function () {
    console.error("Não foi possível carregar a sprite sheet.");
};
