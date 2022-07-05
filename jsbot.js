function isWinMove(Line, Token) {
    //функция определяет, есть ли выигрывающий ход за Token
    let WinArr = [[0,1,2], [3,4,5], [6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let ans = [false, -1];
    for (let a of WinArr) {
        let tmpArr = [Line[a[0]], Line[a[1]], Line[a[2]]].sort();
        let tmpArr2 = [Line[a[0]], Line[a[1]], Line[a[2]]];
        if (tmpArr.join('') == Token + Token + '_') {
            ans = [true, a[tmpArr2.indexOf('_')]]
            return (ans);
        }
    }
    return (ans);
}

function isOnlyOneNoLoseMove (Line, Token) {
    let WinArr = [[0,1,2], [3,4,5], [6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    let ans = [false, -1];
    for (let a of WinArr) {
        let tmpArr = [Line[a[0]], Line[a[1]], Line[a[2]]].sort();
        let tmpArr2 = [Line[a[0]], Line[a[1]], Line[a[2]]];
        let antiToken = Token == 'X' ? 'O' : 'X';
        if (tmpArr.join('') == antiToken + antiToken + '_') {
            ans = [true, a[tmpArr2.indexOf('_')]]
            return (ans);
        }
    }
    return (ans);    
}

//alert(isOnlyOneNoLoseMove('XOXXOOOX_', 'X'));

function getResult (Line) {
    let WinArr = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    for (let a of WinArr) {
        if (Line[a[0]] + Line[a[1]] + Line[a[2]] == 'OOO' || Line[a[0]] + Line[a[1]] + Line[a[2]] == 'XXX') return [Line[a[0]]]
    }
    return ['even'];
}

function getEnds (Line, Token) {
    let antiToken = Token == 'X' ? 'O' : 'X';
    if (Line.indexOf('_') == -1) { return getResult(Line);}
    if (Line.split('_').length == 2){
        newLine = Line.replace('_', Token);
        //alert ('lastmove ' + newLine);
        return getResult(newLine);
    }
    if (isWinMove(Line,Token)[0]) { return [Token];}
    let ans = isOnlyOneNoLoseMove(Line, Token);
    if (ans[0]) {
        let newLine = Line.substring(0,ans[1]) + Token + Line.substring(ans[1]+1);
        //alert('isOnlyOneNoLoseMove    ' + newLine);
        return getEnds(newLine, antiToken);
    }
    
    //смотрим есть ли форсированный выигрышь
    antiToken = Token == 'X' ? 'O' : 'X';
    for (let i = 0; i < 9; i++) {
        if (Line[i] == "_") {
            let newLine = Line.substring(0,i) + Token + Line.substring(i+1);
            //alert (newLine);
            //let tmparr  = getEnds(newLine, antiToken);
            
            if (getEnds(newLine, antiToken).join('') == Token) { return [Token]}
        }
    }
    
    //смотрим остальные ходы
    let Answer = [];
    for (let i = 0; i < 9; i++) {
        if (Line[i] == '_') {
            let newLine = Line.substring(0,i) + Token + Line.substring(i+1);
            if (isOnlyOneNoLoseMove(newLine, antiToken)[0] || getEnds(newLine, antiToken).join('') != Token) {
                Answer = Answer.concat(getEnds(newLine,antiToken));        
            }
        }
    }
    return Answer;
}

function WinFriauenci(ans, Token){
    let S = 0;
    for (let i = 0; i < ans.length; i++) {
        if (ans[i] == Token) S++;
    }
    return Math.floor(S*100/ans.length);
}

function getToken   ()  {
    let cells = document.getElementsByClassName("username");
    for (let i = 0; i < cells.length; i++) {
        var status = cells[i].innerText;
        if ( status == "jsbot" ) {
            if (i == 0) return "X"
            return "O"
            }
        }
}
function getMove(){
    let cells = document.getElementsByTagName("td");
    let Token = getToken();
    let Line = "";
    let ClickNumber = -1;
    for (var i = 0; i < cells.length; i++) {
        var status = cells[i].getAttribute("ng-repeat");
        if ( status == "cell in row" ){
            let fullCells = cells[i].getElementsByTagName("svg");
            if (fullCells.length > 0) {
                let htmlToken = fullCells[0].getAttribute("aria-label");
                Line += htmlToken;
            } else Line += "_";
        } 
    }
    //Token = "X";
    //Line = "__XOO_X__";
    let antiToken = Token == 'X' ? 'O' : 'X';
    //ищем выигрывающий ход
    let tmparr = isWinMove(Line, Token);
    if (tmparr[0]) {ClickNumber = tmparr[1]}
    else if (isOnlyOneNoLoseMove(Line, Token)[0]) {ClickNumber =isOnlyOneNoLoseMove(Line, Token)[1]}
    else if (Line.split('_').length == 10) {ClickNumber = Math.floor(Math.random()*8);}
    else {
        //смотрим другие ходы
        let Answer = [];
        for (i = 0; i< 9; i++) {
            if (Line[i] == '_') {
                let newLine = Line.substring(0,i) + Token + Line.substring(i+1);
                let tmpArr2 = getEnds(newLine, antiToken); 
                if (tmpArr2.join('') == antiToken) {
                    Answer.push (-100);
                } else Answer.push (WinFriauenci(tmpArr2, Token));
                
            } else Answer.push(-1);
        }
    
        AnswerOld = [...Answer];
        Answer.sort((a,b) => b-a);
        ClickNumber = AnswerOld.indexOf(Answer[0]);
    }
    //alert (AnswerOld);
    //alert (ClickNumber);
    let b = ClickNumber % 3;
    let a = (ClickNumber / 3) >> 0;
    cells = document.getElementsByClassName("cell-" + a + "-" + b);
    if (cells.length >= 0) cells[0].click()

}

let moveDone = false;
let intervalTask = '';
let tryCount = 0;

function RepeatMovies() {
    intervalTask = setInterval(RepeatandStop, 1200);
    
    function RepeatandStop() {
        let tmptkn = getToken() == "X" ? 0 : 1;
        //moveDone = false;
        let Triangles = document.getElementsByClassName("triangle");        
        //alert (Triangles.length);
        if (Triangles.length == 2) {
                //alert (Triangles.length);
                let ColorStr = window.getComputedStyle(Triangles[tmptkn]).backgroundColor;
                //alert (ColorStr);
                let ColorStrEn = window.getComputedStyle(Triangles[1-tmptkn]).backgroundColor;
                if (ColorStrEn.includes('8')) {
                    moveDone = false;
                }
                if (ColorStr.includes('8')) tryCount++;
                if (ColorStr.includes('8') && (!moveDone || tryCount >=5)) {
                    setTimeout (getMove, 700);
                    moveDone = true;
                    tryCount = 0;
                }

        }
        //if (Triangles.length == 0 || ColorStr == undefined) clearInterval(intervalTask);
    }
    
}



function ClickPlayAgain(){
    let buttons = document.getElementsByTagName("button");
    for (let i = 0; i<buttons.length; i++){
        if (buttons[i].innerText.includes("Играть снова")) {
            buttons[i].click();
            //clearInterval(intervalTask);
            moveDone = false;
            tryCount = 0;
        }
    }
   
}

function RepeatPlayAgain(){
    const playAgain = setInterval(ClickPlayAgain, 6300);
    
    
    
}
RepeatPlayAgain();
RepeatMovies(); 
