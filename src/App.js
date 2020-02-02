

import React, { Component } from 'react';
import './App.css';


const PATH_BASE     = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH   = '/search';
const PARAM_SEARCH  = 'query=';
const DEFAULT_QUERY = 'redux';

//const url = "${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${DEFAULT_QUERY}";
//console.log(url);

/*const list =[
  {
    title: 'React',
    url: 'https://facebook.github.io/react/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://github.com/reactjs/redux',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'Java',
    url: 'https://facebook.github.io/java/',
    author: 'Jerry Stroutstp',
    num_comments: 7,
    points: 6,
    objectID: 2,
  },
];*/

/*function isSearched(searchTerm) {
  return function(item) {
    item.title.toLowerCase().includes(searchTerm.toLowerCase());
  }
}*/


const isSearched = (searchTerm) => (item) =>
    !searchTerm ||
    item.title.toUpperCase().includes(searchTerm.toUpperCase());

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /*list: list,*/
      result:"",
      searchTerm: DEFAULT_QUERY,
    };

   
    this.setSearchTopstories = this.setSearchTopstories.bind(this);
    this.fetchSearchTopstories = this.fetchSearchTopstories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopstories(result) {
    this.setState({ result });
  }

  fetchSearchTopstories(searchTerm) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopstories(result));
  }
  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchSearchTopstories(searchTerm);
  }

onSearchSubmit(event) {
  const { searchTerm }= this.state;
  this.fetchSearchTopstories(searchTerm);
  event.preventDefault();
}
  onSearchChange(event) {
    this.setState({
      searchTerm: event.target.value
    });
  };

  onDismiss(id) {
    /*function isNotId(item) {
      return item.objectID !== id;
    }*/
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.result.hits.filter(isNotId);
    this.setState({
     // list:updatedList
     result: Object.assign({},this.state.result, {hits:updatedList})
    });
  };

  

  render () {
    
    
    const { searchTerm, result } = this.state;
    if (!result) { return null; }

    return (
      <div className="page">
      <div className="interactions">
       <Search 
        value= {searchTerm } 
        onChange={ this.onSearchChange }
        onSearchSubmit={ this.onSearchSubmit }
        > Search</Search>
       </div>
   {/*     {result
       ?
       <Table 
        list={ result.hits }
        pattern={ searchTerm }
        onDismiss={ this.onDismiss }
       />
       : null
       } */}
        { result &&
       <Table 
        list={ result.hits }
        // pattern={ searchTerm }
        onDismiss={ this.onDismiss }
       />
       }
     </div>
    );
  }
}

class Search extends Component {
  render() {
    const { value, onChange, onSubmit, children } = this.props;
    return (
      <form onSubmit={ onSubmit }>
        { children } <input 
            type ="text" 
            value={ value } 
            oncChange={ onChange} 
            />
            <button type="submit">
            { children }
            </button>
      </form>
    );
  }
}


class Button extends Component {
  render () {
    const {
      onClick,
      className='',
      children,
    } = this.props;
  
  return(
    <button onClick={ onClick } className={ className } type ="button" > { children } </button>
  );
 } 
}
class Table extends Component {
  render() {
    const Table =( { list, onDismiss} ) =>
    
      <div className="table">
          { list.map(item => 
             <div key={item.objectID} className="table-row">
              <span>
              <a href={item.url}>{item.title}</a>
              </span>
              <span>{item.author}</span>
              <span>{item.num_comments}</span>
              <span>{item.points}</span>
              <span>
                <Button type="button" onClick={() => onDismiss(item.objectID)} className="button-inline">DISMISS</Button>
              </span>
            </div>
          )} 
      </div>
    
    }
}
export default App;