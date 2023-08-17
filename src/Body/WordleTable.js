import React from 'react';
import * as keyboardKey from 'keyboard-key';
import WordleBlock from './WordleBlock';
import {compareWords, setCorrectWord, updateUser, updateWord} from "../Server/WordleAPI.js";

class WordleTable extends React.Component {
    //constructor
    constructor(props) {
        super(props);
        this.state = {
            blockWidth: 5,
            currentRow: [],
            firstRow: [],
            secondRow: [],
            thirdRow: [],
            fourthRow: [],
            fifthRow: [],
            sixthRow: [],
        }
        //Add a block to each row depending on the desired width of the admin.
        for(let i = 0; i < (this.state.blockWidth); i++){
            this.state.firstRow.push(<WordleBlock key={i}/>)
            this.state.secondRow.push(<WordleBlock key={i}/>)
            this.state.thirdRow.push(<WordleBlock key={i}/>)
            this.state.fourthRow.push(<WordleBlock key={i}/>)
            this.state.fifthRow.push(<WordleBlock key={i}/>)
            this.state.sixthRow.push(<WordleBlock key={i}/>)
        }

        /*
        This is the word that the user enters. Should be updated in real time.
        */
        this.UserWord = "";
        this.counter = 0;
        this.rowCounter = 1;
        //this.image = require('src/loseImage.PNG');
        this.keyDownHandler = this.keyDownHandler.bind(this);
    }
    /**
     This event is fired when the user hits a key.
     The handler will make sure that the user is not entering a username.
     Then the handler will add the letter to the appropriate block.
     */
    keyDownHandler(event) {
        /*
        Compares the inputed word to the list of valid words, and returns true if the word exists,
        and returns false if the word does not exist. Note that the input word must be equal to the amount
        of blocks that the user has access to. For instance, if there are 5 letter blocks, the user must enter a 5 letter word.
         */
        /**
         * Handles if a valid letter is pressed.
         * Adds the letter to the current word block.
         * @param key the key that has been pressed.
         */
        const handleLetter = (key) => {
            if (this.counter < this.state.blockWidth) {
                let newRow = this.state.currentRow; //copy the first row
                let upperKey = key.toUpperCase(); //upper case the key
                let newElement = React.cloneElement(this.state.currentRow[this.counter], {letter: upperKey}); //create a new element with the correct letter inside
                newRow[this.counter++] = newElement; //add the new element to the first row copy.
                this.setState({currentRow: newRow}); //update the first row state
                this.UserWord += key //append the new letter to the user word.
            }
        }
        /**
         * Handles if a backspace is pressed
         * Removes the letter from the current block sets previous block to the current.
         */
        const handleBackspace = () => {
            if (this.counter > 0) { //decrement the counter if not on the first column
                this.counter--;
                this.UserWord = this.UserWord.slice(0, -1); //remove the letter at the end of the users word.
            }
            let newRow = this.state.currentRow; //copy the first row
            let newElement = React.cloneElement(this.state.currentRow[this.counter], {letter: ""}); //create a new element with no letter inside
            newRow[this.counter] = newElement; //add the new element to the first row copy
            this.setState({currentRow: newRow}); //update the first row state
        }

        /**
         * Handles if the enter key is pressed
         * Checks if the word is valid, colors the blocks, then switches the current row.
         */
          const handleEnter = async(word) =>{
            const results = await compareWords(word);
            if(results.win){
                this.props.isGameFinished(true);
                this.props.wonGame(true);
                //alert(`You Win!!`);
                await this.handleChange(results.changeLetters);
                this.props.currentWordGuessCount(this.rowCounter);
                this.props.onValidWord(results.changeLetters);
                if(this.props.currUser !== "") updateUser(this.props.currUser, word, this.rowCounter);
                updateWord(word, this.rowCounter);
                document.removeEventListener("keydown", this.keyDownHandler);
                const winModal = document.getElementById("winModal");
                winModal.hidden = false;
            }else if(results === "Word is invalid"){
                //alert("Word not valid");
                const invalidWord = document.getElementById("invalidWord");
                invalidWord.show();

            }else{
                this.props.onValidWord(results.changeLetters);
                if(this.props.currUser !== "") updateUser(this.props.currUser, word, "");
                updateWord(word, "");
                await this.handleChange(results.changeLetters);
                if (this.rowCounter >= 6) {
                    document.removeEventListener("keydown", this.keyDownHandler);
                    //alert("Out of guesses!");
                    this.props.isGameFinished(true);
                    this.props.wonGame(false);
                    const loseModal = document.getElementById("loseModal");
                    loseModal.hidden = false;
                }
            }
        }


        //make sure the user is not entering a username
        if (this.props.focus === false) {
            //get the letter and ascii value of the key
            const key = keyboardKey.getKey(event);
            const keyCode = keyboardKey.getCode(event);
            //console.log(keyCode);
            if (keyCode >= 65 && keyCode <= 90){ //make sure the key is a letter
                handleLetter(key);
            } else if (keyCode === 8) { //if the key is backspace (8 is the code for backspace)
                handleBackspace();
            } else if (keyCode === 13) {
                handleEnter(this.UserWord);
            }
        }
    }

    exitDialog(){
        const invalidWord = document.getElementById("invalidWord");
        invalidWord.close();
    }

    exitWinModal(){
        const winModal = document.getElementById("winModal");
        winModal.style.display = "none";
    }

    exitLoseModal(){
        const loseModal = document.getElementById("loseModal");
        loseModal.style.display = "none";
    }


    /**
     * Handles changing the block colors and moving to the next row.
     * @param letters the letters to change and the color associated with them
     */
    handleChange(letters) {
        let newArray = [];
        this.state.currentRow.forEach((block,index) =>{
            for(let i = 0; i < letters.length; i++){
                const item = letters[i];
                if(item.checked !== true){
                    if(block.props.letter === item.letter.toUpperCase()){
                        newArray[index] = React.cloneElement(block, {letter: block.props.letter, color: item.color});
                        item.checked = true;
                        break;
                    }
                }
            }
        });
        this.setState({currentRow: newArray}, ()=>{
            if (this.rowCounter === 1) {
                this.setState({firstRow: this.state.currentRow}, () => {
                    this.setState({currentRow: this.state.secondRow});
                });
            } else if (this.rowCounter === 2) {
                this.setState({secondRow: this.state.currentRow}, () => {
                    this.setState({currentRow: this.state.thirdRow});
                });
            } else if (this.rowCounter === 3) {
                this.setState({thirdRow: this.state.currentRow}, () => {
                    this.setState({currentRow: this.state.fourthRow});
                });
            } else if (this.rowCounter === 4) {
                this.setState({fourthRow: this.state.currentRow}, () => {
                    this.setState({currentRow: this.state.fifthRow});
                });
            } else if (this.rowCounter === 5) {
                this.setState({fifthRow: this.state.currentRow}, () => {
                    this.setState({currentRow: this.state.sixthRow});
                });
            }else{
                this.setState({sixthRow: this.state.currentRow});
            }
            this.counter = 0; //resets typing position
            this.UserWord = ""; //resets word that is being checked back to empty
            this.rowCounter++;
        });
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.gameLength !== this.props.gameLength){
            await this.reRenderTable(true);
        }
    }

    async reRenderTable(lengthChange){
        await this.setState({blockWidth: this.props.gameLength});
        await this.setState({firstRow: [], secondRow: [], thirdRow: [], fourthRow: [], fifthRow: [], sixthRow: []});
        for(let i = 0; i < (this.state.blockWidth); i++){
            this.state.firstRow.push(<WordleBlock key={i}/>)
            this.state.secondRow.push(<WordleBlock key={i}/>)
            this.state.thirdRow.push(<WordleBlock key={i}/>)
            this.state.fourthRow.push(<WordleBlock key={i}/>)
            this.state.fifthRow.push(<WordleBlock key={i}/>)
            this.state.sixthRow.push(<WordleBlock key={i}/>)
        }
        this.state.currentRow = this.state.firstRow;
        this.rowCounter = 1;
        this.counter = 0;
        if(lengthChange){
            await this.setState({blockWidth: this.props.gameLength}, () => {
                this.props.lengthChange(this.state.blockWidth)
                setCorrectWord(this.state.blockWidth);
            });
        }
        this.UserWord = "";
        this.forceUpdate();
    }

    componentDidMount() {
        document.addEventListener('keydown', this.keyDownHandler);
        this.state.currentRow = this.state.firstRow;
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.keyDownHandler);
    }

    render() {
        return (
            <div className="wordle-main container-fluid">
                {/*Each row is contained within a overall container div called wordle-main*/}

                {/*The width of a row is determined by how many blocks will be in the row times the width of each block*/}
                {/*The number of columns each row is determined by word length set by the admin (this.state.blockWidth)*/}
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.firstRow}
                </div>
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.secondRow}
                </div>
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.thirdRow}
                </div>
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.fourthRow}
                </div>
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.fifthRow}
                </div>
                <div style={{maxWidth: `${this.state.blockWidth * 73}px`}} className={`row row-cols-${this.state.blockWidth}`}>
                    {this.state.sixthRow}
                </div>
                <dialog id={"invalidWord"}>
                    <span onClick={this.exitDialog} className="close">&times;</span>
                    <p>Invalid Word Entered</p>
                </dialog>
                <div id={"winModal"} hidden={true} className={"modal"}>
                    <div className={"modal-header"}>
                        <h1 style={{color: "black"}}>YOU WON!</h1>
                        <span onClick={this.exitWinModal} className="close">&times;</span>
                    </div>
                    <div className={"modal-content"}>
                        <h4>You were able to beat the game with {this.rowCounter - 1} guesses</h4>
                    </div>
                </div>
                <div id={"loseModal"} hidden={true} className={"modal"}>
                    <div className={"modal-header"}>
                        <h1 style={{color: "black"}}>YOU LOST!</h1>
                        <span onClick={this.exitLoseModal} className="close">&times;</span>
                    </div>
                    <div className={"modal-content"}>
                        <h4>You were not able to guess the correct word</h4>

                    </div>
                </div>
            </div>
        );
    }
}

export default WordleTable;