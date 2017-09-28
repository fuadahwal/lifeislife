import React, { Component } from 'react';
import './App.css'
import Cell from './comp/Cell.js';
import Row from './comp/Row.js'
import { Button, ButtonGroup } from 'react-bootstrap';
import $ from 'jquery'




class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      boardArr: [],
      componentsArr: [],
      height: 10,
      width: 10,
      running: true,
      generation: 0
    }


  }




  componentDidMount() {



      if (this.state.running) {

        if (this.state.boardArr.length === 0) {

          this.setState({
            boardArr: this.createRandomBoard()
          });
        }

        else if (this.state.boardArr.length > 0) {

          const boardObj = this.generate();
          this.setState({
            boardArr: boardObj.newBoard
          }, () => this.setState({
            componentsArr: boardObj.componentsArr,
            generation: this.state.generation + 1
          }));
        }
      }



  }




  toggleCell = (e) => {
    const classArr = e.target.classList;
    if (classArr.contains("dead")) {
      classArr.remove("dead");
      classArr.add("alive");
    }
    else {
      classArr.remove("alive");
      classArr.add("dead");
    }
  }



  toggleStart = () => {
    this.setState({ running: !this.state.running });
  }

  reset = () => {
    const board = this.createRandomBoard();
    this.setState({ generation: 0, boardArr: board })
  }




  createRandomBoard = () => {
    let board = [];
    for (let row = 0; row < this.state.height; row++) {
      let rowArr = [];
      for (let column = 0; column < this.state.width; column++) {
        rowArr.push(Math.floor(Math.random() * 2));
      }
      board.push(rowArr);
    }
    return board;
  }



  getNeighborsArr = (row, cell) => {
    const selfId = `${row}${cell}`;
    const board = this.state.boardArr;
    let neighborsArr = [];


    for (let i = -1; i <= 1; i++) {

      for (let j = -1; j <= 1; j++) {


        let neighbor, cellId;


        if ( (row - 1) >= 0 && (row + 1) <= (this.state.height - 1) ) {
          let neighborRow = board[row + i];
          cellId = `${row + i}${cell + j}`;


          if (  cellId !== selfId && (cell - 1) >= 0 && (cell + 1) <= (this.state.width - 1) ) {
            neighbor = neighborRow[cell + j];
          }
        }

        if (neighbor !== undefined) {
          neighborsArr.push(neighbor);
        }
      }
    }
    return neighborsArr;
  }









  generate = () => {
    const prevGen = this.state.boardArr;

    const newGen =
      prevGen.map((row, rowIdx) => {
        let cellRow = [];

        row.forEach((cell, cellIdx) => {


          let temp = this.getNeighborsArr(rowIdx, cellIdx);
          if (temp.length > 0) {
            console.log(`neighbors at [${rowIdx}, ${cellIdx}] are ${temp}`);

          }



          cellRow.push(<Cell
            key={"cell-" + cellIdx}
            status={cell}
            toggleCell={this.toggleCell} />
          );



        });
        return (
          <Row
            key={"row-" + rowIdx}
            className="Row"
            cellsArr={cellRow}
            toggleCell={this.toggleCell}
            />
        );
      });

      return {
        "componentsArr": newGen,
        "newBoard": []
      };
  }





  render() {
    return (
      <div className="App">

      <h3>Generation: {this.state.generation}</h3>

        <div className="container">
          <table className="Board">
            <tbody>

            { this.state.componentsArr }

            </tbody>
            </table>
        </div>

        <button
          onClick={this.toggleStart}
          className="btn">
          {!this.state.running && "Start" || this.state.running && "Pause"}
        </button>

        <button
        onClick={this.reset}
        className="btn">
        Reset</button>

      </div>
    );
  }
}



export default App
