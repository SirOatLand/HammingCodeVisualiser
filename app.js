const info_16Bits = RandomBinaryArray(16)
const fixed_16Bits = flipError(info_16Bits)
console.log(info_16Bits)
console.log(getHighs(info_16Bits))
console.log(prepBlock(info_16Bits))
console.log(flipError(info_16Bits))


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
    let fixedBitsArray = BitsArray
    let error = prepBlock(BitsArray)
    if(error !== 0)
    fixedBitsArray[error] = 1 - fixedBitsArray[error] //Flip the error bit
    return fixedBitsArray
}


//HTML part

const visualiser = document.querySelector("#visualiser")
const info = document.querySelector("#info")

const grid = Array.from({ length: 16 })

function createGrid(ParentDiv, info) {
    const ParentDivContainer = document.querySelector("#" + ParentDiv);
    grid.forEach((cell, index) => {
        const gridCell = document.createElement('div')
        gridCell.classList.add('square')
        gridCell.textContent = info[index]
        ParentDivContainer.append(gridCell)
    })
}

createGrid('originalBits', info_16Bits)
createGrid('fixedBits', fixed_16Bits)