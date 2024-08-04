import React, { Component } from 'react';
import SimpleStorageContract from '../build/contracts/SimpleStorage.json';
import FieldContract from '../build/contracts/Field.json';
import Web3 from 'web3';

import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

import { getNormalizedField } from './utils/fieldUtils';

const COLOR = {
  ...[
    "#000000",
    "#808080",
    "#C0C0C0",
    "#FFFFFF",
    "#800000",
    "#FF0000",
    "#808000",
    "#FFFF00",
    "#008000",
    "#00FF00",
    "#008080",
    "#00FFFF",
    "#000080",
    "#0000FF",
    "#800080",
    "#FF00FF",
  ]
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      account: '0x2191ef87e392377ec08e7c08eb105ef5448eced5',
      balance: 0,
      eth: null,
      web3: null,
      simpleStorage: null,

      // gen empty 100 x 100 field
      field: new Array(10).fill().map(() => new Array(10).fill().map(() => 0))
    };
  }

  componentDidMount() {
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
    const eth = web3.eth;

    const deployedSimpleStorageContract = new web3.eth.Contract(SimpleStorageContract.abi, SimpleStorageContract.networks['4447'].address, {
      gasPrice: '1',
      gas: 100000
    });

    const deployedFieldContract = new web3.eth.Contract(FieldContract.abi, FieldContract.networks['4447'].address, {
      gasPrice: '1',
      gas: 100000,
      gasLimit: 20000000
    });

    this.setState({
      web3,
      eth,
      simpleStorageContract: deployedSimpleStorageContract,
      fieldContract: deployedFieldContract,
    }, () => {
      this.getStorageValue();
      this.updateField();
      this.getAccountBalance()
    });
  }

  updateField = () => {
    this.getField().then(() => {
      const { field, filledCells } = this.state;

      filledCells.forEach((filledCell) => {
        const { x, y, color } = filledCell;

        field[y][x] = color;
      });

      return new Promise((resolve) => this.setState({ field }, () => resolve()));
    });
  };

  getField = () => {
    const { account } = this.state;

    return this.state.fieldContract.methods.getFilledCells().call({
        from: account,
        gas: 5000000
      })
      .then((filledCells) => {
        const normalizedField = getNormalizedField(filledCells);

        return new Promise((resolve) => {
          this.setState({ filledCells: normalizedField }, () => resolve(normalizedField));
        });
      })
  };

  getStorageValue = () => {
    this.state.simpleStorageContract.methods.get().call()
      .then((storageValue) => {
        this.setState({ storageValue });
      });
  };

  getAccountBalance = () => {
    const { eth, account } = this.state;

    eth.getBalance(account).then((balance) => {
      this.setState({ balance });
    });
  };

  onGenerate = () => {
    const { simpleStorageContract, account } = this.state;
    const n = ~~(Math.random() * 1000);

    simpleStorageContract.methods.set(n)
      .send({ from: account }, (error, transactionAddress) => {
        console.log(error, transactionAddress);

        this.updateActualState();
      })
  };

  updateActualState = () => {
    this.getAccountBalance();
    this.getStorageValue();
  };

  addToField = (x, y) => {
    const { fieldContract, account } = this.state;
    const color = this.getRandomNumber(16 - 1) + 1;

    fieldContract.methods.fillCell(x, y, color).send({
      from: account,
      gas: 3000000,
    }).then(() => {
      this.updateField();
      this.getAccountBalance();
    })
  };

  getRandomNumber = (max) => {
    return ~~(Math.random() * max);
  };

  onCellClick = (y, x) => {
    const { field } = this.state;
    const fieldHeight = field.length;
    const fieldWidth = field[0].length;

    if ( y >= 0 && y < fieldHeight
      && x >= 0 && x < fieldWidth
      && !field[y][x]
    ) {
      console.log(y, x);
      this.addToField(x, y);
    } else {
      alert('Oops!')
    }
  };

  render() {
    const { field } = this.state;

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">Truffle Box</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>If your contracts compiled and migrated successfully, below will show a stored value of 5 (by
                default).</p>
              <p>Try changing the value stored on <strong>line 59</strong> of App.js.</p>
              <p>The current account is: { this.state.account }</p>
              <p>The stored value is: { this.state.storageValue }</p>
              <p>Balance: { this.state.balance }</p>
              <button className="generateNew" onClick={ this.onGenerate }>Generate</button>
            </div>
          </div>
          <div className="field">
            {
              field.map((row, rowIndex) => {

                return (
                  <div key={rowIndex} className="row">{
                    row.map((cell, cellIndex) => {
                      return (
                        <div key={cellIndex} className="cell" style={{ backgroundColor: COLOR[cell] }} onClick={() => this.onCellClick(rowIndex, cellIndex)} />
                      )
                    })
                  }</div>
                );

              })
            }
          </div>
        </main>
      </div>
    );
  }
}

export default App;
