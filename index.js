// Pega o canvas da página
const canvas = document.getElementById("game");

// Permite desenhar no canvas
const ctx = canvas.getContext("2d");

// Cria uma imagem
const spriteSheet = new Image();

// Diz onde está a imagem
spriteSheet.src = "spritesheet.PNG-1.png.png";

// Quando a imagem terminar de carregar...
spriteSheet.onload = function () {

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a imagem inteira
    ctx.drawImage(spriteSheet, 0, 0);

};
