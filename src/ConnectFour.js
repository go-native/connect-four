import React, { useState } from 'react';
import { Board } from './Board';
import './ConnectFour.css';
import { players } from './players';

let nextPlayerNumber = 1;
let numberOfCoins = 0;

export const ConnectFour = () => {
    const [currentPlayer, setCurrentPlayer] = useState(players[0]);
    
    const getNextPlayer = () => {
        const nextPlayerIndex = nextPlayerNumber % players.length;
        nextPlayerNumber ++;
        return players[nextPlayerIndex];
    }

    const handleCoinFallen = board => {
        numberOfCoins ++;
        const winner = checkBoard(board)
        if (winner) {
            alert(`${winner.name} won!`);
            window.location.reload();
        } else if (numberOfCoins === board.length * board[0].length) {
            alert(`The board is full, restarting...`);
            window.location.reload();
        } else {
            setCurrentPlayer(getNextPlayer());
        }
    }

    const checkBoard = board => {
        let count = 0;
        for (let i = 0; i < board.length; i ++) {
            count = 0;
            for (let j = 1; j < board[i].length; j ++) {
                if (board[i][j] !== 0) {
                    if (board[i][j] === board[i][j - 1]) {
                        count ++;
                    } else {
                        count = 0;
                    }
                }
                if (count === 3) {
                    return players.find(p => p.type === board[i][j]);
                }
            }
        }

        for (let i = 0; i < board[0].length; i ++) {
            count = 0
            for (let j = 1; j < board.length; j ++ ) {
                if (board[j][i] !== 0) {
                    if (board[j][i] === board[j - 1][i]) {
                        count ++;
                    } else {
                        count = 0;
                    }
                }
                if (count === 3) {
                    return players.find(p => p.type === board[j][i]);
                }
            }
        }

    }

    return (
        <div className="connect-four">
            <Board currentPlayer={currentPlayer} onCoinFallen={handleCoinFallen}/>
        </div>
    );
}
