/* Declarando os intervalos */
let geniusSequenceInterval;

/* Declarando*/
let genius = {
	turner: 'off',
	playerClick: 'can-click',
	playerGame: 'cant-play',
	score: null,
	display: null,
	sequence: [],
	indexSequence: 0,
	sequencePlayed: false,
};

const turnOffGenius = () => {
	genius = {
		...genius,
		sequencePlayed: false,
		turner: 'off',
		sequence: [],
		indexSequence: 0,
		score: null,
		display: null,
		playerClick: 'can-click',
		playerGame: 'cant-play',
	}
	// Alterar o led para apagado
	const visualDisplay = document.getElementsByClassName('controlers-options__visual-display')[0];
	visualDisplay.innerText = genius.display;
}

// Adiciona uma nova cor a sequencia depois que clicar no start
const addRandomicColor = () => {
	const numeric = Math.floor(Math.random() * 4);
	switch (numeric) {
	case 0:
		return 'blue';
	case 1:
		return 'red';
	case 2:
		return 'yellow';
	default:
		return 'green';
	}
}

// Criar a sequencia do Genious e ilumina na tela
const geniusSequence = () => {
	const sequence = [...genius.sequence];
	genius.playerClick = 'cant-click';
	genius.playerGame = 'cant-play';
	// Alterar o led para vermelho
	document.getElementsByClassName('controlers-turner__on-led')[0].style.backgroundColor = 'red';

	let index = 0, light = false;
	geniusSequenceInterval = setInterval(() => {
		// Retorna a função quando terminar de percorrer toda a sequencia
		if (index >= sequence.length) {
			clearInterval(geniusSequenceInterval);
			genius = {
				...genius,
				sequencePlayed: true,
				playerClick: 'can-click',
				playerGame: 'can-play',
			}
			// Alterar o led para verde
			document.getElementsByClassName('controlers-turner__on-led')[0].style.backgroundColor = 'green';

			return;
		}

		// escolhe qual a cor deverá ser alterada LIGHT/NORMAL
		const color = document.getElementsByClassName(`genius-page__${sequence[index]}-button`)[0];
		color.classList.toggle(`${color.classList[0]}--act`);

		// Quando a luz estava desligada e ligou, trocamos o valor de light para verdadeiro e o valor de index se mantém
		
		/* Quando a luz estava ligada e apagou, trocamos o valor do light para falso e somamos 1 ao index, informando ao
		código que pode fazer o mesmo com a próxima cor da sequencia ou limpar o intervalo */
		light = !light;
		index = (light === true) ? index : index + 1;
	}, 350);
}


const startRandomicSequence = () => {
	if (genius.turner === 'on' && genius.playerClick === 'can-click') {
		if (genius.sequencePlayed === false) {
			const addColor = addRandomicColor();
			genius.sequence.push(addColor);
		}
		// chama a função para rodar o intervalo que exibe a sequencia e altera a cor de fundo
		geniusSequence();
	}
}

const turnOnGenius = () => {
	// contador de "giros" no intervalo
	let counter = 0;
	genius.score = 0;

	// alterando o valor do display
	const visualDisplay = document.getElementsByClassName('controlers-options__visual-display')[0];
	genius.display = '--';

	visualDisplay.innerText = genius.display;

	var timerinitializing = setInterval(() => {
		if (counter >= 1.5) {
			genius.display = JSON.stringify(genius.score);

			visualDisplay.innerText = genius.display;

			genius.playerClick = 'can-click';
			clearInterval(timerinitializing);
			return;
		}
		genius.display = (genius.display === '--') ? '' : '--';
		visualDisplay.innerText = genius.display;

		counter += 0.5;
	}, 300);
} /* função que altera a informação do display 3 vezes e no final renderiza a pontuação */

const startingGame = () => {
	genius.turner = (genius.turner === 'on') ? 'off' : 'on';
	genius.score = 0;

	const visualDisplay = document.getElementsByClassName('controlers-options__visual-display')[0];
	// agora chamamos a função que altera a informação do display 3 vezes e no final renderiza a pontuação
	(genius.turner === 'on') ? turnOnGenius() : turnOffGenius();
} /* Atribui os valores iniciais do jogo e chama a função que renderiza o display */

const toogleButton = () => {
	if (genius.playerClick === 'can-click') {
		genius.playerClick = 'cant-click';
		const button = document.getElementsByClassName('controler-turner__button-marker')[0];
		button.classList.toggle('controler-turner__button-marker--on');
	
		startingGame();
	
		const ledOn = document.getElementsByClassName('controlers-turner__on-led')[0];
		ledOn.style.backgroundColor = (genius.turner === 'on') ? '#ff4c4c' : '#333333';
	}
} /* Altera a propriedade Turner para ON/OFF e altera a classe para o componente mudar de lado */

const toogleActive = (element) => {
	let counter = 0;
	const toogleInterval = setInterval(() => {
		// toogle
		element.classList.toggle(`${element.classList[0]}--act`);
		//parada
		if (counter === 1) {
			clearInterval(toogleInterval);
			return;
		}
		counter += 1;
	}, 300);
}

/* Fazendo o click da minha aposta */
const cardBet = ({target}) => {
	const { playerGame, turner, sequence, indexSequence } = genius;
	if (playerGame === 'can-play' && turner === 'on') {
		toogleActive(target);
		const expected = document.getElementsByClassName(`genius-page__${sequence[indexSequence]}-button`)[0];
		const acertou = (expected === target) ? 'acertou' : 'errou';
		if (indexSequence >= sequence.length - 1 && acertou === 'acertou') {
			// Mudar Score
			// Trocar o Valor de Sequence Played para false para poder adicionar mais cores a sequencia
			genius = {
				...genius,
				score: genius.score + 1,
				sequencePlayed: false,
				indexSequence: 0,
				playerGame: 'cant-play',
			}
			// Alterar o led para vermelho
			document.getElementsByClassName('controlers-turner__on-led')[0].style.backgroundColor = 'red';
			const display = document.getElementsByClassName('controlers-options__visual-display')[0];
			display.innerText = JSON.stringify(genius.score);
			// QUANDO ACABAR VAI ESPERAR DOIS SEGUNDOS PRA CHAMAR O START DA FUNÇÃO
			setTimeout(() => {
				startRandomicSequence()
			}, 2000);
			return;
		}
		if (acertou === 'errou') {
			genius = {
				turner: 'on',
				playerClick: 'can-click',
				playerGame: 'cant-play',
				score: 0,
				display: '--',
				sequence: [],
				indexSequence: 0,
				sequencePlayed: false,
			};
			// Alterar o led para vermelho
			document.getElementsByClassName('controlers-turner__on-led')[0].style.backgroundColor = 'red';
			turnOnGenius();
			return;
		}
		genius.indexSequence += 1;
	}
} /* Faz o click para tentar acertar ou ver se erramos */

/* AddEventListeners */
document.getElementsByClassName('controler-turner__button')[0]
	.addEventListener('click', toogleButton); /* Altera a propriedade Turner para ON/OFF e altera a classe para o componente mudar de lado */

document.getElementsByClassName('start-container__button')[0]
	.addEventListener('click', startRandomicSequence); /* Caso o Jogo estiver Ligado, aguarda o 
click no start para começar a sequencia ou repetir a sequencia quando o jogador precisar */

document.getElementsByClassName('genius-page__blue-button')[0]
	.addEventListener('click', cardBet); /* Caso o Jogo estiver Ligado e o jogador puder jogar o jogador está clicando para tentar 
completar a sequencia, escolheu a cor azul */

document.getElementsByClassName('genius-page__green-button')[0]
	.addEventListener('click', cardBet); /* Caso o Jogo estiver Ligado e o jogador puder jogar o jogador está clicando para tentar 
completar a sequencia, escolheu a cor verde */

document.getElementsByClassName('genius-page__red-button')[0]
	.addEventListener('click', cardBet); /* Caso o Jogo estiver Ligado e o jogador puder jogar o jogador está clicando para tentar 
completar a sequencia, escolheu a cor vermelho */

document.getElementsByClassName('genius-page__yellow-button')[0]
	.addEventListener('click', cardBet); /* Caso o Jogo estiver Ligado e o jogador puder jogar o jogador está clicando para tentar 
completar a sequencia, escolheu a cor amarelo */