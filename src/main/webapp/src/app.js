import React from 'react';
import {createRoot} from 'react-dom/client';
import Alert from 'react-bootstrap/Alert';
import Autosuggest from 'react-autosuggest';
import AirportsAPI from './services/airports_api';
import CustomersAPI from './services/customers_api';

async function getAirportSuggestions(value) {
  return await AirportsAPI.getSuggestions(value);
}

async function getCustomerSuggestions(value) {
  return await CustomersAPI.getSuggestions(value);
}

function getAirportSuggestionValue(suggestion) {
  return suggestion.value;
}

function getCustomerSuggestionValue(suggestion) {
  return suggestion.value;
}

function renderAirportSuggestion(suggestion) {
  let payload = suggestion.payload;

  return (
    <div className='suggestion-content '>
      <div className='react-autosuggest__section-title'><strong>{suggestion.value}</strong></div>
      <div>
        <span><strong>{payload.code}</strong> - {payload.state}</span>
      </div>
    </div>
  );
}

function renderCustomerSuggestion(suggestion) {
  let payload = suggestion.payload;

  return (
    <div className='suggestion-content '>
      <div className='react-autosuggest__section-title'><strong>{suggestion.value}</strong></div>
      <div>
        <span><strong>{payload.primaryDocumentNumber}</strong> - {payload.operator}</span>
      </div>
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      airportValue: '',
      airportSelected: '',
      airportSuggestions: [],
      airportShowSelection: false,
      customerValue: '',
      customerSelected: '',
      customerSuggestions: [],
      customerShowSelection: false
    };
  }

  onAirportChange = (event, { newValue, method }) => {
    this.setState({
      airportValue: newValue,
      airportShowSelection: this.state.airportSelected > 0,
    });
  };

  onCustomerChange = (event, { newValue, method }) => {
    this.setState({
      customerValue: newValue,
      customerShowSelection: this.state.customerSelected > 0,
    });
  };

  // Suggestion rerender when user types
  onAirportSuggestionsFetchRequested = ({ value }) => {
    getAirportSuggestions(value)
      .then(data => {
        this.setState({
          airportSuggestions: data
        });
      })
  };

  // Suggestion rerender when user types
  onCustomerSuggestionsFetchRequested = ({ value }) => {
    getCustomerSuggestions(value)
      .then(data => {
        this.setState({
          customerSuggestions: data
        });
      })
  };

  onAirportSuggestionsClearRequested = () => {
    this.setState({
      airportSuggestions: []
    });
  };

  onCustomerSuggestionsClearRequested = () => {
    this.setState({
      customerSuggestions: []
    });
  };

  onAirportSuggestionSelected = (event, { suggestion }) => {
    let payload = suggestion.payload;
    this.setState({
      airportSelected: `${payload.code} (${payload.state})`,
      airportShowSelection: true
    });
  };

  onCustomerSuggestionSelected = (event, { suggestion }) => {
    let payload = suggestion.payload;
    this.setState({
      customerSelected: `${payload.primaryDocumentNumber} (${payload.operator})`,
      customerShowSelection: true
    });
  };

  render() {
    const { airportValue, airportSuggestions, customerValue, customerSuggestions } = this.state;
    const airportInputProps = {
      placeholder: "Search by Airport Name...",
      value: airportValue,
      onChange: this.onAirportChange,
      className: "form-control form-control-lg form-control-borderless"
    };
    const customerInputProps = {
      placeholder: "Search by Customer Name...",
      value: customerValue,
      onChange: this.onCustomerChange,
      className: "form-control form-control-lg form-control-borderless"
    };

    return (
      <div>
      <div>
        <Autosuggest
          suggestions={airportSuggestions}
          onSuggestionsFetchRequested={this.onAirportSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onAirportSuggestionsClearRequested}
          onSuggestionSelected={this.onAirportSuggestionSelected}
          getSuggestionValue={getAirportSuggestionValue}
          renderSuggestion={renderAirportSuggestion}
          inputProps={airportInputProps} />
        <br/>
        {this.state.airportShowSelection && <Alert variant="success">{this.state.airportSelected}</Alert>}
      </div>
      <div>
        <Autosuggest
          suggestions={customerSuggestions}
          onSuggestionsFetchRequested={this.onCustomerSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onCustomerSuggestionsClearRequested}
          onSuggestionSelected={this.onCustomerSuggestionSelected}
          getSuggestionValue={getCustomerSuggestionValue}
          renderSuggestion={renderCustomerSuggestion}
          inputProps={customerInputProps} />
        <br/>
        {this.state.customerShowSelection && <Alert variant="success">{this.state.customerSelected}</Alert>}
      </div>
      </div>
    );
  }
}

const container = document.getElementById('react');
const root = createRoot(container);
root.render(<App />);
