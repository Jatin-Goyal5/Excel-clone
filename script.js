let topRow = document.querySelector(".top-row");
let leftCol = document.querySelector(".left-col");
let topLeftCell = document.querySelector(".top-left-cell");
let allCells = document.querySelectorAll(".cell");
let addressInput = document.querySelector("#address");
let formulaInput = document.querySelector('#formula');

let lastSelectedCell;

cellsContentDiv.addEventListener("scroll" , function(e){
    let top = e.target.scrollTop;
    let left = e.target.scrollLeft;

    topRow.style.top = top + "px";
    topLeftCell.style.top = top + "px";
    topLeftCell.style.left = left + "px";
    leftCol.style.left = left + "px";  
})

for(let i=0 ; i<allCells.length ; i++){
    allCells[i].addEventListener("click" , function(e){
        let rowId = Number(e.target.getAttribute("rowid"));
        let colId = Number(e.target.getAttribute("colid"));
        let address = String.fromCharCode(65+colId)+(rowId+1)+"";
        let cellObj = db[rowId][colId];
        addressInput.value = address;
        formulaInput.value = cellObj.formula;

        cellObject.fontStyle.bold
        ? document.querySelector(".bold").classList.add("active-font-style")
        : document.querySelector(".bold").classList.remove("active-font-style");
  
        cellObject.fontStyle.italic
        ? document.querySelector(".italic").classList.add("active-font-style")
        : document.querySelector(".italic").classList.remove("active-font-style");
  
        cellObject.fontStyle.underline
        ? document.querySelector(".underline").classList.add("active-font-style")
        : document.querySelector(".underline").classList.remove("active-font-style");
    })

    allCells[i].addEventListener("blur" , function(e){
        lastSelectedCell = e.target;
        let cellValue = e.target.textContent;
        let rowId = e.target.getAttribute("rowid");
        let colId = e.target.getAttribute("colid");
        let cellObject = db[rowId][colId];
        // console.log("before update " , cellObject);

        if(cellObject.value == cellValue && !cellObject.formula){
            return;
        }

        if(cellObject.formula){
            deleteFormula(cellObject);
            formulaInput.value ="";
        }

        // update the cellobject value if not same
        cellObject.value = cellValue;
        // update children 
        updateChildren(cellObject);

        if(cellObject.visited){
            return;
        }
        cellObject.visited = true;
        visitedCells.push({rowId,colId})
    })


    allCells[i].addEventListener("keydown" , function(e){
        if(e.key == "Backspace"){
            let cell = e.target;
            let {rowId , colId} = getRowIdColIdFromElement(cell);
            let cellObject = db[rowId][colId];
            if(cellObject.formula){
                cellObject.formula = "";
                formulaInput.value = "";
                removeFormula(cellObject);
                cell.textContent = "";
            }
        }
    })
}

formulaInput.addEventListener('blur',function(e){
    let {rowId,colId} = getRowIdColIdFromElement(lastSelectedCell);

    let formula = e.target.value;
    let cellObj = db[rowId][colId];
    if(formula){
        if(cellObj.formula){
            deleteFormula(cellObj.formula);
        }
        let value = solveFormula(formula,cellObj);
        cellObj.value = value;
        cellObj.formula = formula;
        lastSelectedCell.textContent = value;
       
        // update children
        updateChildren(cellObj);

        if(cellObject.visited){
            return;
        }
        cellObject.visited = true;
        visitedCells.push({rowId , colId})
    }
});

