import React from 'react';

/**
 * Creates the WordleKey component
 * These comprise all the keys within the WordleKeyboard component
 * They hold the state of their color and letter.
 */
class WordleKey extends React.Component {
    render() {
        return (
            <div className="col-md-auto columnKeyWidth">{/*Creates a column with automatic margins and columnKeyWidth styling*/}
                <div style={{backgroundColor: this.props.color}} className="wordleKey"> {/*Creates the key based on the current color*/}
                    <p>{this.props.letter}</p>{/*Sets the letter in the key*/}
                </div>
            </div>
        );
    }
}

export default WordleKey;