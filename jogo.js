console.log('[FoxyPines] Flappy Bird');

let frames = 0
const hit = new Audio();
hit.src = './efeitos/hit.wav'

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');



// [background]
const background = {
	spriteX: 390,
	spriteY: 0,
	largura: 275,
	altura: 204,
	x: 0,
	y: canvas.height - 204,
	desenha() {
		contexto.fillStyle = '#70c5ce';
		contexto.fillRect(0, 0, canvas.width, canvas.height);

		contexto.drawImage(
			sprites,
			background.spriteX, background.spriteY, 
			background.largura, background.altura,
			background.x, background.y, 
			background.largura, background.altura,
		);
		contexto.drawImage(
			sprites,
			background.spriteX, background.spriteY, 
			background.largura, background.altura,
			(background.x + background.largura), background.y, 
			background.largura, background.altura,
		);
	},
};


// [Chão]
function criaChao() {
	const chao = {
		spriteX: 0,
		spriteY: 610,
		largura: 224,
		altura: 112,
		x: 0,
		y: canvas.height - 112,
		atualiza() {
			const chaoQueMexe = 1;
			const repEm = chao.largura / 2;
			const move = chao.x -chaoQueMexe;

			chao.x = move % repEm;
		},
		desenha() {
			contexto.drawImage(
				sprites, 
				chao.spriteX, chao.spriteY, //Sprite X, Sprite Y
				chao.largura, chao.altura, //Tamanho do recorte no sprite                                    
				chao.x, chao.y, 
				chao.largura, chao.altura,
			);
			contexto.drawImage(
				sprites, 
				chao.spriteX, chao.spriteY, //Sprite X, Sprite Y
				chao.largura, chao.altura, //Tamanho do recorte no sprite                                    
				(chao.x + chao.largura), chao.y, 
				chao.largura, chao.altura,
			);
		}
	}
	return chao;
};


function colide(flappyBird, chao) {
	const flappyBirdY = flappyBird.y + flappyBird.altura;
	const chaoY = chao.y;
	if(flappyBirdY >= chaoY) {
		return true;
	}

	return false;
}

function criaBird() {
	const flappyBird = {
		spriteX: 0,
		spriteY: 0,
		largura: 33,
		altura: 24,
		x: 10,
		y: 50,
		pulo: 4.6,
		pula() {
			flappyBird.velocidade = -flappyBird.pulo;
		},
		gravidade: 0.25,
		velocidade: 0,
		atualiza() {
			if(colide(flappyBird, globais.chao)) {
				console.log('Colidiu');
				hit.play();

				setTimeout(()=> {
				mudaTo(telas.inicio);

				}, 500)
				return;
			}


			flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
			flappyBird.y = flappyBird.y + flappyBird.velocidade;
		},
		movim: [
			{ spriteX: 0, spriteY: 0,},
			{ spriteX: 0, spriteY: 26,},
			{ spriteX: 0, spriteY: 52,},
			{ spriteX: 0, spriteY: 26,},
		],
		frameAtual: 0,
		atualizaFrame() {
			const waitFrames = 10;
			const finixWait = frames % waitFrames === 0;

			if(finixWait) {
				const baseSoma = 1;
				const soma = baseSoma + flappyBird.frameAtual;
				const baseRepet = flappyBird.movim.length;
				flappyBird.frameAtual = soma % baseRepet
			}
		},
		desenha() {
			flappyBird.atualizaFrame
			const { spriteX, spriteY } = flappyBird.movim[flappyBird.frameAtual];

			contexto.drawImage(
				sprites, 
				spriteX, spriteY, //Sprite X, Sprite Y
				flappyBird.largura, flappyBird.altura, //Tamanho do recorte no sprite                                    
				flappyBird.x, flappyBird.y, 
				flappyBird.largura, flappyBird.altura,
			);
		}
	}
	return flappyBird;
};

// [GetReady]
const start = {
	spriteX: 134,
	spriteY: 0,
	largura: 174,
	altura: 152,
	x: (canvas.width / 2) - 174 / 2,
	y: 50,
	desenha() {
		contexto.drawImage(
			sprites, 
			start.spriteX, start.spriteY, //Sprite X, Sprite Y
			start.largura, start.altura, //Tamanho do recorte no sprite                                    
			start.x, start.y, 
			start.largura, start.altura,
		);
	},
};


//
// [Telas]
//
const globais = {};
let telAtiva = {}
function mudaTo(newTela) {
	telAtiva = newTela
	if(telAtiva.inicia) {
		telAtiva.inicia();
	}
}

const telas = {
	inicio: {
		inicia() {
			globais.flappyBird = criaBird();
			globais.chao = criaChao();
		},
		desenha() {
			background.desenha();
			globais.chao.desenha();
			globais.flappyBird.desenha();
			start.desenha();
		}, 
		click() {
			mudaTo(telas.jogo);
		},
		atualiza() {
			globais.chao.atualiza();
		}
	}
};

telas.jogo = {
	desenha() {
		background.desenha();
		globais.chao.desenha();
		globais.flappyBird.desenha();
	},
	click() {
		globais.flappyBird.pula();
	},
	atualiza() {
		globais.flappyBird.atualiza();
	}
};

function loop() {

	telAtiva.desenha();
	telAtiva.atualiza();


	frames = frames + 1;
	requestAnimationFrame(loop);
};

window.addEventListener('click', function() {
	if(telAtiva.click) {
		telAtiva.click();
	}
});

mudaTo(telas.inicio);
loop();