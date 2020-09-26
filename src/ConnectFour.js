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
        for (let row = 0; row < board.length; row ++) {
            for (let col = 0; col < board[row].length; col ++) {
                const element = board[row][col]
                if (element !== 0) {
                    // check horizontally
                    if (col <= board[row].length - 4 && element === board[row][col + 1] && element === board[row][col + 2]  && element === board[row][col + 3]) {
                        return players.find(p => p.type === element);
                    }

                    // check vertically
                    if ( row <= board.length - 4 && element === board[row + 1][col] && element === board[row + 2][col] && element === board[row + 3][col]) {
                        return players.find(p => p.type === element);
                    }
                    // check diagonal
                    if (row <= board.length - 4 &&  col <= board[row].length - 4 && element === board[row + 1][col + 1]  && element === board[row + 2][col + 2]  && element === board[row + 3][col + 3]) {
                        return players.find(p => p.type === element);
                    }
                }
            }
        }
        return null;

    }

    return (
        <div className="connect-four">
            <Board currentPlayer={currentPlayer} onCoinFallen={handleCoinFallen}/>
        </div>
    );
}
