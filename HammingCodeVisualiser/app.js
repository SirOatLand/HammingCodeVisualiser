const info_16Bits = RandomBinaryArray(16)
const fixed_16Bits = flipError(info_16Bits)

function RandomBinaryArray(length) {
    return Array.from({ length }, () => Math.floor(Math.random() * 2));
}
  
function getHighs(BitsArray){
    let Highs = []
    for(i = 0; i < BitsArray.length; i++){
        if (BitsArray[i] == 1){
            Highs.push(i)
        }
    }
    return Highs
}

// XOR all the high position together to pinpoint the error(s)
function prepBlock(BitsArray){
    let Highs = getHighs(BitsArray)
    let error = Highs[0]
    for(i = 1; i < Highs.length; i++){
        error = error ^ Highs[i]
    }
    return error
}


function flipError(BitsArray){
    let fixedBitsArray = BitsArray.slice()
    let error = prepBlock(BitsArray)
    if(error !== 0) fixedBitsArray[error] = 1 - fixedBitsArray[error] //Flip the error bit
    return fixedBitsArray
}

// |---|---|---|---|
// | 1 | 1 | 1 | 0 |   0 - Data Bits
// |---|---|---|---|  
// | 1 | 0 | 0 | 0 |   1 - Parity Bits (0,1,2,4,8,..., 2^n)
// |---|---|---|---|
// | 1 | 0 | 0 | 0 |
// |---|---|---|---|
// | 0 | 0 | 0 | 0 |
// |---|---|---|---|

const PChecks = {
  P0: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], //All Cells
  P1: [1,3,5,7,9,11,13,15], //Even Columns
  P2: [2,3,6,7,10,11,14,15], //Last Two Columns
  P3: [4,5,6,7,12,13,14,15], //Even Rows
  P4: [8,9,10,11,12,13,14,15], //Last Two Rows
};


function randomUnprepArray() {
    length = 16 //Space for parity bits
    return Array.from({ length }, (value, index) => {
        //Parity Bits exist at 0 and power of 2s
        if (index === 0) return 'Z'
        else if (Math.log2(index) % 1 === 0) return 'P';
        else return Math.floor(Math.random() * 2);
        });
      }

function CheckEven(ParityCheck, infoArray){
    let sum = 0
    for(i = 1; i < 8; i++){
        sum += ParityCheck[i]
    }
    if(sum % 2 !== 0) infoArray[ParityCheck[0]] = 1
    else infoArray[ParityCheck[0]] = 0
}

const unprepArray = randomUnprepArray()
console.log(unprepArray)



////////////////////////////////////////////////////
////////////////////HTML part///////////////////////
////////////////////////////////////////////////////


const grid = Array.from({ length: 16 })

//This function create cells in a 4x4 grid
//each will be assigned as buttons.
//This function also responsible for making
//the on-cell hovering effects 
function createGrid(ParentDiv, info) {
    const ParentDivContainer = document.querySelector("#" + ParentDiv);
    grid.forEach((cell, index) => {
      //Create cells with 'square' class and 
      //'ParentDiv + "_button_" + index' id
      //with innerHTML according to the random bit array
        const gridCell = document.createElement('button')
        gridCell.classList.add('square')
        gridCell.id = ParentDiv + "_button_" + index;
        gridCell.innerHTML = info[index];
        ParentDivContainer.append(gridCell)
        
        //Add hover text on each buttons
        if (index === 0) {
          gridCell.title = "Zeroth Parity Bit"

          //Add hovering effects to the Zeroth Parity Cell
          gridCell.addEventListener("mouseenter", () => {
            changeCellColor(PChecks['P0'])
          });
          gridCell.addEventListener("mouseleave", () => {
            resetCellColor(PChecks['P0']);
          });
        } else if (Math.log2(index) % 1 === 0) {
          gridCell.title = "Parity Bit"

          //Add hovering effects to the Parity Cells
          let ParityIndex = Math.log2(index);
          gridCell.addEventListener("mouseenter", () => {
            changeCellColor(PChecks['P' + (ParityIndex + 1)])
          });
          gridCell.addEventListener("mouseleave", () => {
            resetCellColor(PChecks['P' + (ParityIndex + 1)]);
          });

        } else {
          gridCell.title = "Information Bit"
        }
        
        function changeCellColor(cells) {
          const color = "lightblue"; // Change to desired color
          cells.slice(1).forEach((cell) => { // Slice to skip the first element (ParityBit itself)
            const cellId =  ParentDiv + "_button_" + cell;
            const cellElement = document.getElementById(cellId);
            if (cellElement) {
              cellElement.style.backgroundColor = color;
            }
          });
        }

        function resetCellColor(cells) {
          cells.slice(1).forEach((cell) => {
            const cellId =  ParentDiv + "_button_" + cell;
            const cellElement = document.getElementById(cellId);
            if (cellElement) {
              cellElement.style.backgroundColor = "";
            }
          });
        }
    })
}


//This function gives each buttons in the grid 
//their own designated function when clicked
function buttonFunctions(ParentDiv){
  grid.forEach((cell, index) => {
    const gridCell = document.getElementById(ParentDiv + '_button_' + index)
      //Make each of the cell a separate buttons
      //distinguish by between info bits and parity bits
      const actions = [
        function() {
          // Action for the zeroth button
          console.log("Zeroth button clicked!");
        },
        function(index) {
          // Action for power of 2 buttons
          console.log("Power of 2 button clicked! " + "(" + index + ")");
          const powerOf2Actions = [
            () => CheckEven(PChecks['P1'], info_11Bits),
            () => CheckEven(PChecks['P2'], info_11Bits),
            () => CheckEven(PChecks['P3'], info_11Bits),
            () => CheckEven(PChecks['P4'], info_11Bits)
          ];
          let ParityIndex = Math.log2(index);
          if (ParityIndex % 1 === 0) {
            powerOf2Actions[ParityIndex]();
          }
        },
        function() {
          // Action for the rest of the buttons
          console.log("Other button clicked!");
        }
      ];
      
      //Add 'onclick' function to each buttons
      gridCell.onclick = function() {
        if (index === 0) {
          actions[0]();
        } else if (Math.log2(index) % 1 === 0) {
          actions[1](index);
        } else {
          actions[2]();
        }
      };
  });
}


createGrid('unprepBits', unprepArray)
buttonFunctions('unprepBits')
createGrid('originalBits', unprepArray)
buttonFunctions('originalBits')

