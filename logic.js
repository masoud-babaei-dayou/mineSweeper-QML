.pragma library

function createBombMap(totalCells, bombCount)
{
    let data = [];
    for(let i = 0; i<totalCells;i++){
        data.push("empty");
    }
    for(let i = 0; i<bombCount;i++){
        let index;
        do{

            index = Math.floor(Math.random()*totalCells);
        } while(data[index]==="mine");
        data[index] = "mine";
    }
    return data;
}


function createSafeBombMap(totalCells, bombCount, safeIndex, rows, columns) {
    let data = [];
    for(let i = 0; i < totalCells; i++) {
        data.push("empty");
    }

    // Get safe zone indices (clicked cell + neighbors)
    let safeCells = new Set();
    let safeRow = Math.floor(safeIndex / columns);
    let safeCol = safeIndex % columns;
    for (let r = safeRow - 1; r <= safeRow + 1; r++) {
        for (let c = safeCol - 1; c <= safeCol + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                safeCells.add(r * columns + c);
            }
        }
    }

    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
        let index = Math.floor(Math.random() * totalCells);
        if (!safeCells.has(index) && data[index] !== "mine") {
            data[index] = "mine";
            bombsPlaced++;
        }
    }
    return data;
}

function countAdjacentMines(index, rows, columns, bombMap) {
    let row = Math.floor(index / columns);
    let col = index % columns;
    let count = 0;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                let neighborIndex = r * columns + c;
                if (neighborIndex !== index && bombMap[neighborIndex] === "mine") {
                    count++;
                }
            }
        }
    }
    return count;
}
function revealRecursive(index, rows, columns, bombMap, revealed) {
    if (index < 0 || index >= rows * columns) return;
    if (revealed[index]) return;

    revealed[index] = true;

    let count = countAdjacentMines(index, rows, columns, bombMap);
    if (count !== 0) return;

    let row = Math.floor(index / columns);
    let col = index % columns;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                let neighborIndex = r * columns + c;
                if (neighborIndex !== index) {
                    revealRecursive(neighborIndex, rows, columns, bombMap, revealed);
                }
            }
        }
    }
}
