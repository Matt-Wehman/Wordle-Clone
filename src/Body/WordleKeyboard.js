import React from 'react';

import WordleKey from "./WordleKey";
import WordleBlock from "./WordleBlock";

const firstRowLetters = [{letter: "Q", color:"gray"}, {letter:"W", color:"gray"}, {letter:"E", color: "gray"}, {letter:"R",color: "gray"},
    {letter: "T", color: "gray"},{letter: "Y", color: "gray"}, {letter: "U", color: "gray"}, {letter: "I", color: "gray"}, {letter: "O", color: "gray"}, {letter: "P", color: "gray"}];
const secondRowLetters = [{letter: "A", color:"gray"}, {letter: "S", color:"gray"}, {letter: "D", color:"gray"},
    {letter: "F", color:"gray"}, {letter: "G", color:"gray"}, {letter: "H", color:"gray"}, {letter: "J", color:"gray"}, {letter: "K", color:"gray"}, {letter: "L", color:"gray"}];
const thirdRowLetters = [{letter: "Z", color:"gray"}, {letter: "X", color:"gray"}, {letter: "C", color:"gray"},
    {letter: "V", color:"gray"}, {letter: "B", color:"gray"}, {letter: "N", color:"gray"}, {letter: "M", color:"gray"}];

class WordleKeyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstRow: firstRowLetters,
            secondRow: secondRowLetters,
            thirdRow: thirdRowLetters,
            greenLetters: [],
            yellowLetters:[]
        };
    }

    Colors = {
        "green": 3,
        "rgb(176,169,32)": 2,
        "rgb(35,35,35)": 1,
        "gray": 0
    }

    findLetter(row, item){
        const j = row.findIndex(e => e.letter === item.letter.toUpperCase());//get index of the letter
        let currColor = row.at(j).color;
        let newColor = item.color;
        if(this.Colors[currColor] < this.Colors[newColor]){
            row.at(j).color = item.color;//change color of the letter
        }
        this.setState({[row]: row});
    }

    /**
     * Handles changing the color of the letters on the keyboard
     * @param lettersToChange list of objects containing the letters to change and the color to change it to.
     */
    handleChange(lettersToChange) {
        if(lettersToChange.length > 0){
            for(let i = 0; i < lettersToChange.length; i++){ //for each letter to change check what row it is in
                let item = lettersToChange[i]; //get the current item
                if (firstRowLetters.some(e => e.letter === item.letter.toUpperCase())) { //if the letter is in the first row
                    this.findLetter(firstRowLetters, item);
                } else if (secondRowLetters.some(e => e.letter === item.letter.toUpperCase())) {
                    this.findLetter(secondRowLetters, item);
                } else if (thirdRowLetters.some(e => e.letter === item.letter.toUpperCase())) {
                    this.findLetter(thirdRowLetters, item);
                }
            }
        }
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.lettersToChange !== this.props.lettersToChange) {
            this.handleChange(this.props.lettersToChange);
        }
        if(this.props.gameLength !== prevProps.gameLength) {
            await this.reRenderKeyboard()
        }
    }

    async reRenderKeyboard(){
        secondRowLetters.forEach((item, index) => secondRowLetters[index].color = "gray");
        firstRowLetters.forEach((item,index) => firstRowLetters[index].color = "gray");
        thirdRowLetters.forEach((item,index) => thirdRowLetters[index].color = "gray");
        await this.setState({firstRow: firstRowLetters});
        await this.setState({secondRow: secondRowLetters});
        await this.setState({thirdRow: thirdRowLetters});
        this.forceUpdate();
    }

    render() {
        return (
            <div className="board">
                <div className="row justify-content-md-center g-0">
                    {this.state.firstRow.map((item) => {
                        return <WordleKey key={item.letter} letter={item.letter} color={item.color}/>;
                    })}
                </div>
                <div className="row justify-content-md-center g-0">
                    {this.state.secondRow.map((item) => {
                        return <WordleKey key={item.letter} letter={item.letter} color={item.color} />;
                    })}
                </div>
                <div className="row justify-content-md-center g-0">
                    {this.state.thirdRow.map((item) => {
                        return <WordleKey key={item.letter} letter={item.letter} color={item.color} />;
                    })}
                </div>
            </div>
        );
    }
}

export default WordleKeyboard;
