// import the tiles
import { getGameState, initializeGameState, updateGameState } from '../utils/api.js';
import { tiles } from '../data/tiles.js';

const maxColumns = 12;
const maxRows = 8;

//if gameState exists in localStorage, set gameState to that function, else initialize and set it to new gameState
let gameState = getGameState() ? getGameState() : initializeGameState();


//do stuff
// makeBlankGameState();

// create grid, 12 by 8
//on load
const grid = document.getElementById('grid');
renderGrid(grid);

let topDeckTile;
renderTopDeckTile();




//on click
grid.addEventListener('click', (e) => {
    //grab click location, div id
    const currentTile = e.target;
    let currentTileId = currentTile.id;
    gameState = getGameState();

    //if clicked element was one of the containers (grid/row), exit
    if (e.target.id.substr(0, 5) !== 'grid-') {console.log('wrong element, exciting!'); return;}

    //change 'grid-#-#' string to '#-#'
    currentTileId = currentTileId.replace('grid-', '');
    //change '#-#' to ["#", "#"]
    currentTileId = currentTileId.split('-');

    //store ["#", "#"][0] to row, ["#", "#"][1] to column
    const row = Number(currentTileId[0]);
    const column = Number(currentTileId[1]);


    gameState[row][column] = topDeckTile.id;
    // console.log(gameState);
    updateGameState(gameState);
    //if tile already has background image, do not run
    if (currentTile.style.backgroundImage) return;

    //render tile in grid, update background image
    currentTile.style.opacity = 1;
    currentTile.style.backgroundImage = `url("../tiles/${topDeckTile.image}")`;
    currentTile.classList.add('placed-tile');


    //draw and display new tile at bottom of page
    renderTopDeckTile();

    // getPlacedTiles();

});

// returns array of placed tile ids
function getPlacedTiles() {
    let placedTilesArray = [];

    gameState = getGameState();
    //loop through all played tile Ids in gameState array, and put them in a single array called placedTilesArray
    gameState.forEach(row => {
        row.forEach(cell => {
            if (cell) placedTilesArray.push(cell);
        });
    });

    console.log('placedTilesArray: ' + placedTilesArray);

    return placedTilesArray;
}

// returns array of unplayed tile ids
function getUnplayedTiles() {
    const placedTiles = getPlacedTiles();

    //Take all the ids of our {tiles} object and put them into an array with Object.keys(tiles)
    const allTileIds = Object.keys(tiles);

    //The filter() method creates a new array with all elements that pass the test implemented by the provided function.
    //.filter() will loop through all tile Ids from our {tiles} object, and test it with an 'if' function, and if truthy, then push that to a new array via 'return' (in this case, unplayedTiles).
    let unplayedTiles = allTileIds.filter(tileId => {
        //.indexOf() will return -1 if an item is not in the array. If the current looped tile Id has not been placed (and is not in the placedTiles array), this function will return true with "-1 is < 0", and add that tile Id to the unplayedTiles array.
        return placedTiles.indexOf(Number(tileId)) < 0;
    });

    console.log('unplayedTiles: ' + unplayedTiles);

    return unplayedTiles;
}


// create deck / get tile function
// returns random unplayed tile object
function getTileFromDeck() {
    //get array of unplayed tile Ids
    const unplayedTiles = getUnplayedTiles();
    //generate a random index between 0 and the length of unplayedTiles array
    const unplayedTilesRandomIndex = Math.floor(Math.random() * unplayedTiles.length);
    //get the tile Id from the randomly picked index of unplayedTiles array
    const unplayedTileId = unplayedTiles[unplayedTilesRandomIndex];

    console.log('unplayedTilesRandomIndex: ' + unplayedTilesRandomIndex);
    console.log('the unplayed tiles index has the id of the actual {tiles} object, which is this: ' + tiles[unplayedTiles[unplayedTilesRandomIndex]].id);

    //return the tile object from the tiles object - if id is 27, tiles[27] = tiles.27
    return tiles[unplayedTileId];
}

function renderTopDeckTile() {
    //random tile deck at bottom of page
    const div = document.getElementById('player-tile');
    //select random tile
    topDeckTile = getTileFromDeck();
    //update and display random tile background 
    div.style.opacity = 1;
    div.style.backgroundImage = `url("../tiles/${topDeckTile.image}")`;
    div.style.backgroundSize = 'cover';
}

export function renderGrid(parent) {

    // Loop through maxRows and create rows
    for (let i = 0; i < maxRows; i++) {
        const row = document.createElement('section');
        row.id = `row-${i}`;
        row.classList.add('row');
        
        // Loop through each row and create columns
        for (let j = 0; j < maxColumns; j++) {
            const cell = document.createElement('div');
            cell.id = `grid-${i}-${j}`;
            cell.classList.add('cell');
            row.appendChild(cell);
        }
        // Add row to parent / passed element
        parent.appendChild(row);
    }
}  