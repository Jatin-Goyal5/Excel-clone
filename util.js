function getRowIdColIdFromElement(element){
    let rowId = lastSelectedCell.getAttribute("rowid");
    let colId = lastSelectedCell.getAttribute("colid");
    return {rowId,colId};
}

function solveFormula(formula,selfCellObj){
    "( A1 + A2 )"
    let formulaArray = formula.split(" ");
    // console.log(formulaArray)
    for(let i =0 ; i < formulaArray.length ; i++){
        let formulaComp = formulaArray[i];
        if(formulaComp[0] >= "A" && formulaComp[0] <= "Z"){
            // console.log(formulaComp);
            let {rowId,colId} = getRowIdColIdFromAddress(formulaComp);
            let cellObj =db[rowId][colId]; 
            let value = cellObj.value;
            if(selfCellObj){
                cellObj.childrens.push(selfCellObj.name);
                selfCellObj.parents.push(cellObj.name);
            }
            formula = formula.replace(formulaComp,value);
        }
    }

    let infixEval = eval(formula);
    return infixEval;

}

function getRowIdColIdFromAddress(address){
    let rowId = Number(address.substring(1))-1;
    let colId = address.charCodeAt(0) -65;
    return {rowId,colId};
}
function updateChildren(cellObj){

   
     // get all childrens
     let currentChildrens =cellObj.childrens;
     // traverse children
     for(let i =0 ; i < currentChildrens.length ; i++){
         let children = currentChildrens[i];
         
         // get rowId ,colId
         let {rowId,colId} = getRowIdColIdFromAddress(children);
         
         let childrenobj = db[rowId][colId];
         let newValue = solveFormula(childrenobj.formula);

         //update data base 
         childrenobj.value = newValue;

         // update ui
         let uiValue = document.querySelector(`div[rowid='${rowId}'][colid='${colId}']`); 
         uiValue.textContent = newValue;
        updateChildren(childrenobj);
     }  
     // console.log("after update " , cellObject);

}

function deleteFormula(cellObject){
    
    cellObject.formula ="";
    for(let i=0 ; i<cellObject.parents.length ; i++){
        let parentName = cellObject.parents[i];
        let {rowId , colId} = getRowIdColIdFromAddress(parentName);
        let parentCellObject = db[rowId][colId];
    
        let updatedChildrens = parentCellObject.childrens.filter(function(children){
          return children != cellObject.name;
        })
    
        parentCellObject.childrens = updatedChildrens;
      }
      cellObject.parents = [];
    
}