import { capitalize, createElement } from './peripherals.js';
const pokeURL = 'https://pokeapi.co/api/v2/pokemon';
const numPokemon = 256;

const container = [
    document.querySelector('.games__racer1--1'),
    document.querySelector('.games__racer2--2')
]
const startButton = document.querySelector('.start');
const resetButton = document.querySelector('.reset');
const playerOptions = document.querySelectorAll('.get-pokemon__select');



class AllPokemon {
    constructor(url, numPokemon) {
        this._url = url;
        this._numPokemon = numPokemon;
        this._pokemonList = [];
    }

    get pokemonList() {
        return this._pokemonList.map(pokeObj => pokeObj.name)
    }

    getAllPokemon() {
        const getConfig = {
            method: 'GET',
            url: this._url + '?limit=' + this._numPokemon
        }

        return axios(getConfig)
            .then(response => {
                this._pokemonList = response.data.results;

            })
    }

    getPokemon(pokeIndex) {
        const getConfig = {
            method: 'GET',
            url: pokeURL + '/' + (pokeIndex+1)
        }

        return axios(getConfig)
        .then(response => {
            console.log(response)
            return {
                name: this.pokemonList[pokeIndex],
                img: response.data.sprites.front_default,
                weight: response.data.weight,
                attackSpeed: response.data.stats[5].base_stat
            }

        })
    }
}

function fillIninputForm(playerOptions, gameClass) {
    const pokeList = gameClass.pokemonList;
    playerOptions.forEach((playerOption, index) => {
        createElement(
            'option',
            playerOption,
            {
                value: '',
                innerText: '--Please select Pokemon--'
            }
        )

        pokeList.forEach(pokemon => {
            createElement(
                'option',
                playerOption,
                {
                    value: capitalize(pokemon),
                    innerText: capitalize(pokemon)
                }
            )
        })

        playerOption.addEventListener('change', async (event) => {
            const playerIndex = event.target.selectedIndex;
            if(playerIndex === 0) {
                container[index].removeChild(container[index].firstChild)
                return;
            }

            const playerName = event.target.children[playerIndex].value;
            // console.log(playerName)
            const player = await gameClass.getPokemon(playerIndex);
            console.log(player);

            if (container[index].firstChild) {
                container[index].removeChild(container[index].firstChild)
            }

            createElement(
                'img',
                container[index],
                {
                    src: player.img,
                    classList: ['games__pokemon', `games__pokemon--${index+1}`],
                    style: "width: auto; height: 100%;",
                    alt: capitalize(player.name)
                }
            )

        })
    })
}

async function startPokemonGame() {
    const gamePokemon = new AllPokemon(pokeURL, numPokemon);
    await gamePokemon.getAllPokemon()

    fillIninputForm(playerOptions, gamePokemon)
    
    container.forEach(container => {
        console.log(container);
        container.addEventListener('animationend', handlePokemonContainerEndAnimation);
    })
    
    
    startButton.addEventListener('click', handleStartButton);
    
    resetButton.addEventListener('click', handleResetButton);
}

function isGoodToGo(options) {
    return (options[0].selectedIndex && options[1].selectedIndex)
}


// event listeners and handlers
function handleStartButton(event) {
    event.preventDefault();

    if (!isGoodToGo(playerOptions)){
        return;
    }

    resetButton.disabled = true;

    container.forEach((pokemon, index) => {
        pokemon.classList.add(`games__racer${index+1}--${index+1}-run`);
        pokemon.firstChild.classList.add('games__pokemon--run');
    })

    event.target.disabled = true;
}

function handlePokemonContainerEndAnimation(event){
    console.log('ended')
    const img = event.target.firstChild;
    img.classList.remove('games__pokemon--run');


    resetButton.disabled = false;
}

function handleResetButton(event) {
    container.forEach((pokemon, index) => {
        pokemon.classList.remove(`games__racer${index+1}--${index+1}-run`);
    })

    event.target.disabled = true;
    startButton.disabled = false;
}



startPokemonGame();
//3rem for the div container


