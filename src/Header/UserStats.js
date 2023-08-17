import React from 'react';
import {getUserByName} from "../Server/WordleAPI.js";
import Placeholder from 'react-bootstrap/Placeholder';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Spinner} from "react-bootstrap";

class UserStats extends React.Component {
    /**
     * Sets the table values in the user stats table
     * @param user the user to set the stats for
     * @returns {Promise<void>} returns nothing
     */
    constructor(props) {
        super(props);
        this.state = {
            currLetters : ["N/A", "N/A", "N/A"],
            currWords : ["N/A", "N/A", "N/A"],
            isLoading : true
        }
        this.currCount = <p></p>;
        this.counter = 0;

        this.spinner = <Spinner animation="border" variant="secondary" style={{margin: "10% auto"}}/>
    }
    async setTable(user){
        try{
            if(user !== ""){
                const stats = await getUserByName(user); //get the user
                const letterStats= stats[0].letters; //get the user's letters list'
                const wordStats = stats[0].words;//get the users' words list'
                if(wordStats !== undefined){
                    let lettersSorted = Object.keys(letterStats).sort(function(a,b){return letterStats[b] - letterStats[a]}); //sort the letters by count
                    let wordsSorted = Object.keys(wordStats).sort(function(a,b){return wordStats[b] - wordStats[a]});//sort the word by count
                    await this.setState({currLetters: lettersSorted.slice(0,3)});
                    if(wordsSorted.length >= 3){
                        await this.setState({currWords: wordsSorted.slice(0,3)});
                    }else{
                        let temp;
                        temp = wordsSorted.slice(0,wordsSorted.length);
                        for(let i = wordsSorted.length; i < 3; i ++){
                            temp[i] = "N/A";
                        }
                        await this.setState({currWords: temp});
                    }
                }else{
                    await this.setState({currWords: ["N/A", "N/A", "N/A"]});
                    await this.setState({currLetters: ["N/A", "N/A", "N/A"]});
                }
            }else{
                console.log("User not found")
            }
        }catch(e){
            console.log(e.message);
        }
    }

    findAverage(countRay) {
        let totalSum = 0;
        let totalAmount = 0;
        let average = 0;
        for(let i = 0; i < 6; i++){
            totalSum += countRay[i] * (i + 1);
            totalAmount += countRay[i]
        }
        average = totalSum / totalAmount;
        return Math.floor(average);
    }

    async setHistogram(user){
        try{
            if(user !== ""){
                const stats = await getUserByName(user);
                const guessStats = stats[0].guessCount;
                console.log(guessStats);
                let count = Object.values(guessStats);
                const max = Math.max(...count);
                //console.log(count)
                console.log(max);
                for(let i = 0; i < 6; i++){
                    if(count[i] !== 0){
                        const meter = document.getElementById((i + 1) + " count")
                        document.getElementById((i + 1) + " countAmount").innerHTML = "" + count[i];
                        meter.style.display = "block";
                        meter.value = "" + count[i];
                        meter.max = max;
                        meter.style.display = "block";
                    }
                }
                document.getElementById("average").innerText = "" + this.findAverage(count);
            }else {
                console.log("User not found");
            }
        } catch (e){
            console.log(e.message);
        }
    }

    shouldComponentUpdate(nextProps){
        if(nextProps.focus === true){return false;}
        if(nextProps.currUser === this.props.currUser && this.props.focus === nextProps.focus){return true;}
        return nextProps.currUser !== this.props.currUser;
    }


    async componentDidMount() {
        this.setState({isLoading: true});
        await this.setTable(this.props.currUser);
        await this.setHistogram(this.props.currUser);
        this.setState({isLoading: false});
        this.getCurrentGuessCount();
    }

    getCurrentGuessCount(){
        let currentGuessCount = "";
        if(this.props.isGameFinished === true){
            if(this.props.wonGame === true){
                if(this.props.currentWordGuessCount === 1){
                    currentGuessCount = <p style={{color: "green"}}> {this.props.currentWordGuessCount} guess</p> //this.props.currentWordGuessCount + " guess";
                } else {
                    currentGuessCount = <p style={{color: "green"}}> {this.props.currentWordGuessCount} guesses</p> //this.props.currentWordGuessCount + " guesses";
                }
            } else {
                currentGuessCount = <p style={{color: "red"}}>Couldn't figure out word with 6 guesses</p> //"Couldn't figure out word with 6 guesses";
            }
        }
        this.currCount = currentGuessCount;
        return this.counter++;
    }

    exitStats = event =>{
        this.props.onExit(false);
    }

    render() {
        return(
            <div className="userStats">
                <div id="stats" className="modal">
                    <div className="modal-header">
                        <h1 style={{color: "black"}}>User Stats</h1>
                        <span onClick={this.exitStats} className="close">&times;</span>
                    </div>
                    <div style={{margin: "0 auto"}} className="modal-content">
                        <div className="currentWordGuess" style={{margin: "0 auto"}} >
                            <h6>Guess Count for Current Word</h6>
                            {this.currCount}
                        </div>
                        {this.state.isLoading ? this.spinner : <>
                            <div className="AverageGuessCount" style={{margin: "0 auto"}}>
                                <h6>Average Number of Guesses</h6>
                                <p id="average"></p>
                                <h6>Guess Distribution</h6>
                                <div className="histogram">
                                    <div className="rowCount">
                                        <label className="countLabel">1</label>
                                        <meter id="1 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="1 countAmount" className="guessAmount">0</label>
                                    </div>
                                    <div className="rowCount">
                                        <label className="countLabel">2</label>
                                        <meter id="2 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="2 countAmount" className="guessAmount">0</label>
                                    </div>

                                    <div className="rowCount">
                                        <label className="countLabel">3</label>
                                        <meter id="3 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="3 countAmount" className="guessAmount">0</label>
                                    </div>

                                    <div className="rowCount">
                                        <label className="countLabel">4</label>
                                        <meter id="4 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="4 countAmount" className="guessAmount">0</label>
                                    </div>

                                    <div className="rowCount">
                                        <label className="countLabel">5</label>
                                        <meter id="5 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="5 countAmount" className="guessAmount">0</label>
                                    </div>

                                    <div className="rowCount">
                                        <label className="countLabel">6</label>
                                        <meter id="6 count" className="meter" style={{display: "none"}}></meter>
                                        <label id="6 countAmount" className="guessAmount">0</label>
                                    </div>
                                </div>
                            </div>
                            <br/>
                            <div className={"tableDiv"}>
                                <table id="mostUsed" style={{margin: "0 auto", width: "32%"}}>
                                    <thead>
                                    <tr>
                                        <th colSpan={3}>Most Guessed Letters and Words</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Words</th>
                                        <th>Letters</th>
                                    </tr>
                                    <tr>
                                        <td style={{color: "gold"}}>1st</td>
                                        <td id="1 Word">{!this.state.isLoading ? this.state.currWords[0] : this.placeHolder}</td>
                                        <td id="1 Letter">{!this.state.isLoading ? this.state.currLetters[0] : this.placeHolder}</td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "silver"}}>2nd</td>
                                        <td id="2 Word">{!this.state.isLoading ? this.state.currWords[1] : this.placeHolder}</td>
                                        <td id="2 Letter">{!this.state.isLoading ? this.state.currLetters[1] : this.placeHolder}</td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "rosybrown"}}>3rd</td>
                                        <td id="3 Word">{!this.state.isLoading ? this.state.currWords[2] : this.placeHolder}</td>
                                        <td id="3 Letter">{!this.state.isLoading ? this.state.currLetters[2] : this.placeHolder}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </>}
                    </div>
                </div>
            </div>
        );
    }

}

window.onclick = function (event) {
    const stats = document.getElementById("stats");
    if(event.target === stats){
        stats.style.display = "none";
    }
};

export default UserStats;