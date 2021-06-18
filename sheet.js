let addSheetBtn = document.querySelector('.add-sheet');
let sheetList = document.querySelector('.sheets-list');


addSheetBtn.addEventListener("click",function(e){
    // <div class="sheet">Sheet 2</div>
    document.querySelector('.active-sheet').classList.remove("active-sheet");
    let sheetDiv = document.createElement('div');
    sheetDiv.classList.add('sheet');
    sheetDiv.classList.add('active-sheet');
    let sheetno = document.querySelectorAll('.sheets-list .sheet').length+1;
    sheetDiv.setAttribute("sheetid", sheetno-1);
    sheetDiv.innerHTML =`Sheet ${sheetno}`;
    sheetList.append(sheetDiv);
    
    initUi();
    initDB();
    console.log(sheetdb);
    

});

sheetList.addEventListener("click",function(e){
    let sheet = e.target;

    if(sheet.classList.contains("active-sheet")){
        return;
    }
    document.querySelector('.active-sheet').classList.remove("active-sheet");
    sheet.classList.add('active-sheet');
    initUi();
    let sheetid = sheet.getAttribute("sheetid");
    db = sheetdb[sheetid].db;
    visitedCells = sheetdb[sheetid].visitedCells;
    setUi();
})

function setUi(){
    for(let i =0 ; i < visitedCells.length ; i++){
        let {rowId ,colId} = visitedCells[i];
        let cellObject = db[rowId][colId];
        document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).innerHTML = cellObject.value;
    
    }
}

function initUi(){
    for(let i =0 ; i < visitedCells.length ; i++){
            let {rowId ,colId} = visitedCells[i];
            document.querySelector(`div[rowid="${rowId}"][colid="${colId}"]`).innerHTML = "";
        
    }
}
