import React, { useState, useRef, useEffect } from "react";
import "./Board.css";
import { players, playerTypes } from "./players";

export const Board = ({ currentPlayer, onCoinFallen }) => {
    const size = { width: 7, height: 6 };
    const cellSize = 80;
    const initialBoard = new Array(size.height)
        .fill(0)
        .map(() => new Array(size.width).fill(0));
    const [board, setBoard] = useState(initialBoard);
    const boardEl = useRef(null);
    const coinEl = useRef(null);

    const [coinPosition, setCoinPosition] = useState({ isFalling: false, positionX : 0, positionY: 0, coinFalls: 0 })

    useEffect(() => {
        if (currentPlayer.type === playerTypes.computer) {
            playComputer();
        }
    }, [currentPlayer])

    useEffect(() => {
        if (currentPlayer.type === playerTypes.computer && coinPosition.coinFalls > 0) {

            // A small delay for a computer.
            setTimeout(()=> {
                dropCoin();
            }, 100)
        }
    }, [coinPosition.coinFalls])

    const  playComputer = () => {
        let positionX = Math.round(Math.random() * size.width - 1);
        while (calculateNextPosition(positionX) === 0) {
            positionX = Math.round(Math.random() * size.width - 1);
        }
        setCoinPosition({
            ...coinPosition,
            positionX,
            coinFalls: coinPosition.coinFalls + 1,
        })
    }

    const handleMouseMove = (event) => {
        if (!boardEl || coinPosition.isFalling || currentPlayer.type !== playerTypes.human) {
            return;
        }
        const boardPosition = boardEl.current.getBoundingClientRect();
        const mouseX = event.pageX - boardPosition.left;
        let positionX = Math.floor(mouseX / cellSize);
        if (positionX >= size.width ) {
            positionX = size.width - 1;
        }
        if (positionX < 0 ) {
            positionX = 0;
        }
        setCoinPosition({
            ...coinPosition,
            positionX,
        })
    };

    const calculateNextPosition = (positionX) => {
        let nextAvailableRow = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i][positionX] === 0) {
                nextAvailableRow++;
            } else {
                break;
            }
        }
        return nextAvailableRow;
    }

    const handleClick = () => {
        if (currentPlayer.type !== playerTypes.human) {
            return;
        }
        dropCoin();
    };

    const dropCoin = () => {
        let nextAvailableRow = calculateNextPosition(coinPosition.positionX);
        if (nextAvailableRow === 0) {
            return;
        }
        setCoinPosition({
            ...coinPosition,
            isFalling: true,
            positionY: nextAvailableRow
        })
        setTimeout(() => {
            board[nextAvailableRow - 1][coinPosition.positionX] = currentPlayer.type;
            setBoard([...board])
            setCoinPosition({
                ...coinPosition,
                isFalling: false,
                positionY: 0,
            })
            onCoinFallen(board);
        }, 300);
    }

    return (
        <div
            className="board"
            ref={boardEl}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
        <div className="board__header"></div>
        <div
            className="coin"
            ref={coinEl}
            style={{
                left: `${coinPosition.positionX * cellSize}px`,
                top: `${coinPosition.positionY * cellSize}px`,
                transition: coinPosition.isFalling && `top .3s`,
                background: `${currentPlayer.color}`,
            }}
        />
        {board.map(row => {
            return row.map((cell, i) => {
                    return (
                    <div key={i} className="board__cell">
                        {cell !== 0 && (
                        <div
                            className="board__cell__coin"
                            style={{ background:  players.find(p => p.type === cell).color}}
                        />
                        )}
                    </div>
                    );
                });
            })}
        </div>
    );
};
