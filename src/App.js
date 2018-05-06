import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      practioners: {}
    };
    this.baseUrl = 'http://hapi.fhir.org/baseDstu3/';
  }

  handleSearch = (lastName) => {

    let nameUrl = this.baseUrl + 'Practitioner?family=' + lastName + '&_format=json';

    fetch(nameUrl).then(response => response.json()).then((data) => {
          
        //console.log(data.entry);

        this.setState({
          practioners: this.buildPractioners(data.entry)
        });

      }).catch(error => console.log(error));
  };

  buildPractioners = (entry) => {

    let practionerNames = [];

    practionerNames = entry.map(p => p.resource.name.map(n => 
      (typeof n.prefix !== "undefined") ? 
      n.prefix+ ' ' + n.given.join(' ') + ' ' + n.family : n.given.join(' ') + ' ' + n.family
      ))  

    let locations = [];  

    entry.map(p => 
      p.resource.extension.map(e => 
        fetch(this.baseUrl + e.valueReference.reference + '?_format=json').then(response => response.json())
          .then((responseData) => 
          {
            //console.log(responseData);
            let fullAddress = [];
            if (typeof responseData.address !== "undefined") {
              fullAddress = responseData.address.map(a => a.line.join(' ') + ' ' + a.city + ' ' +a.postalCode );
            }

            let locationItem = {
              name: responseData.name,
              address: fullAddress[0]
            }

            //console.log(fullAddress);
            locations.push(locationItem);
          }).catch(error => console.log(error))
      )
    )

    //build response model
    console.log(practionerNames);
    console.log(locations);
    
    return this.buildResponse(practionerNames, locations);

  }

  buildResponse = (practionerNames, locations) => {
    
    let response = []; 
    
    //run async
    // setTimeout(function () {
    //   practionerNames.forEach((element,index) => {

    //     let responseItem = {
    //       practionerName: '',
    //       locationName: '',
    //       locationAddress: ''
    //     };
  
    //     responseItem.practionerName = element[0];
    //     responseItem.locationName = locations[0].name;
    //     responseItem.locationAddress = locations[0].address;

    //     response.push(responseItem);
    //   });
    // }, 1);

    //console.log(response);

    return response;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Sample</h1>
        </header>
        <div className="App-container">
          <h3>FHIR Find practioners</h3>
          <SearchBar handleSubmit={this.handleSearch} />
          <PractionerList practioners={this.state.practioners}/>
        </div>
      </div>
    );
  }
}

export default App;


//SearchBar Component

class SearchBar extends React.Component {
    
  handleSubmit = (event) => {
    event.preventDefault();
    const text = event.target.text.value;
    this.props.handleSubmit(text);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="text"
          className="form-control"
          type="text"
          placeholder="Type family name and press ENTER"
        />
      </form>
      
    );
  }
}


//practionerList Component

class PractionerList extends React.Component {

  render(){

    //run async
    setTimeout(function () {
      //console.log(this.props.practioners);
    }, 1);

    var rows = [];

    // this.props.practionerNames.map((name,index) => rows.push(<PractionerItem key={index} practionerName={name} />))

    return (
      <div className="list-group">
        {rows}
      </div>
    )
  }
}

PractionerList.defaultProps = {
  practioners: [],
};


//PractionerItem Component

// class PractionerItem extends React.Component {
//   render(){
//     return (
//         <a className="list-group-item list-group-item-action flex-column align-items-start">
//           <div className="d-flex w-100 justify-content-between">
//             <h5 className="mb-1">{this.props.practionerName}</h5>
//           </div>
//           {/* <p className="mb-1">{this.props.practioner}</p>
//           <small>{this.props.practioner}</small> */}
//         </a>
//     )
//   }
// }
