import React from 'react';

/**
 * This is the WordleBlock.
 * It is what the WordleTable component consists of.
 * These blocks will contain the letters the user enters.
 */
class WordleBlock extends React.Component{
    //constructor
    constructor(props) {
        super(props);
        //set the color of the block
        this.state = {
            color: "transparent",
            letter: ""
        };
    }
    render(){
        return(
            <div className="col columnWidth">
                <div style={{backgroundColor: this.props.color}} className="block">
                    <p>{this.props.letter}</p>
                </div>
            </div>
        );
    }
}

export default WordleBlock;