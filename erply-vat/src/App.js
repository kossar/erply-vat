import React, { Component } from 'react';

function SearchForm(props) {
    return (
        <div className="py-3">
            <h1>Erply VAT check</h1>
            <form className="my-3" >
                <label>
                    <p>{ props.title }</p>
                    <input className="form-control" type="text" value={ props.inputValue }  onChange={ props.handleChange }  placeholder="VAT nr" />
                </label>
                <input className="btn btn-primary ml-3" onClick={ props.action } type="submit" value={ props.buttonValue } />
                <p>{ props.emptyEnter }{ props.loading }</p>
            </form>
        </div>
    );
}

function Result(props) {
    if(props.empty.length !== 0) {
        return null;
    }
    return (
    <div className="mt-3">
        <h2 className="text-success mb-3">Success!</h2>
        <h4>{ props.companyName } { props.vatNr }</h4>
        <p>Address: { props.address }</p>
    </div>
    );
}

function NoResult(props) {
  if(props.number === undefined || props.empty.length !== 0){
        return null;
    } 
    return (
        <div> 
            <h3 className="text-warning">Unfortunately we didn't found { props.vatNr } </h3>
            <p>Please check the VAT number that you are looking for</p>
        </div>
    );
}

class App extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            inputValue: '', // Correct VAT nr for testing: EE100247019 
            obj: [],
            message: '',
            fetchInProgress: '',
            reqDate: null,
            error: null
        };
    
        this.handleText = this.handleText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
      }
     
  
    getVat() {
        
        var rootUrl = "https://vat.erply.com/numbers?vatNumber=";
        var vat = this.state.inputValue;
          fetch(rootUrl + vat)
            .then(function(response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then(d => {
                
              this.setState({ obj:d,
                              fetchInProgress: ''});
            }).catch(function(error) {
                 console.log('Error: ' + error.message);
                 this.setState({
                    message: 'There is an error getting data, please check errors in inserted VAT nr or pelase try again..' ,
                    fetchInProgress: '',
                    error
                     });
             }.bind(this)) 
        
    }

      handleText(event) {
        event.preventDefault();
        this.setState({ inputValue: event.target.value });
      } 
    
      handleSubmit(event) {
        
        event.preventDefault();

        if (this.state.inputValue.length > 3) {
            
            this.setState({ fetchInProgress: 'Loading...',
                            obj: [],
                            message: '' });
            this.getVat();
            
        } else if (this.state.inputValue.length <= 3 && this.state.inputValue.length > 0) {

            console.log('Min 4 characterss');
            this.setState({ message: <span className="text-danger">Please enter at least 4 characters</span> })

        } else  {

            console.log('Dont get vat');
            this.setState({ message: <span className="text-danger">Sorry, You submitted empty form, please try again. Enter at least 4 characters</span> });
        }
    }
      
      render() {
          var fullVat = this.state.obj.CountryCode + this.state.obj.VATNumber;
          const validVat = this.state.obj.Valid;
          
        return (
            <div className="container text-center bg-light  my-3 my-container">
                <SearchForm 
                    onSubmit={ this.handleSubmit }
                    value={ this.state.inputValue }
                    handleChange={ this.handleText } 
                    title={ "Please enter VAT number with country code" }
                    action={this.handleSubmit}
                    buttonValue={ "Search" }
                    emptyEnter={ this.state.message }
                    loading={ this.state.fetchInProgress}
                />
                {
                   validVat  ? <Result 
                                    vatNr={ fullVat }
                                    companyName={ this.state.obj.Name }
                                    address={ this.state.obj.Address }
                                    empty={ this.state.message } 
                                /> 
                                
                            : <NoResult vatNr={ fullVat }
                                        number={ this.state.obj.CountryCode } 
                                        value={ this.state.inputValue }
                                        empty={ this.state.message }
                                />
                }
            </div>
        );
      }
    }

   
export default App;