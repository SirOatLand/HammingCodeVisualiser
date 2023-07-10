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

const P1 = [1,3,5,7,9,11,13,15]  //Even Columns
const P2 = [2,3,6,7,10,11,14,15] //Last Two Columns
const P3 = [4,5,6,7,12,13,14,15] //Even Rows
const P4 = [8,9,10,11,12,13,14,15] //Last Two Rows

function RandomDataArray(length) {
    length += 5 //Space for parity bits
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
    console.log(infoArray[ParityCheck[0]])
    if(sum % 2 !== 0) infoArray[ParityCheck[0]] = 1
    else infoArray[ParityCheck[0]] = 0
}

const info_11Bits = RandomDataArray(11)
console.log(info_11Bits)



////////////////////////////////////////////////////
////////////////////HTML part///////////////////////
////////////////////////////////////////////////////

const visualiser = document.querySelector("#visualiser")
const info = document.querySelector("#info")

const grid = Array.from({ length: 16 })

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
    
      //Make each of the cell a separate buttons
      //distinguish by between info bits and parity bits
        const actions = [
          function() {
            // Action for the zeroth button
            console.log("Zeroth button clicked!");
          },
          function(index) {
            // Action for power of 2 buttons
            console.log("Power of 2 button clicked!");
            console.log(index);
            const powerOf2Actions = [
              () => CheckEven(P1, info_11Bits),
              () => CheckEven(P2, info_11Bits),
              () => CheckEven(P3, info_11Bits),
              () => CheckEven(P4, info_11Bits)
            ];
            if (index <= powerOf2Actions.length) {
              powerOf2Actions[index - 1]();
            }
          },
          function() {
            // Action for the rest of the buttons
            console.log("Other button clicked!");
          }
        ];
        
        gridCell.onclick = function() {
          if (index === 0) {
            actions[0]();
          } else if (Math.log2(index) % 1 === 0) {
            actions[1](index);
          } else {
            actions[2]();
          }
        };    
    })
}

createGrid('originalBits', info_11Bits)
createGrid('fixedBits', fixed_16Bits)

// for(i=0;i < 16; i++){
//     let prefix = "originalBits_button_"
//     if (i === 0) return;
//     else if (Math.log2(i) % 1 === 0) return;
// }


