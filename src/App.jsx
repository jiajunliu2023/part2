import axios from 'axios'
import { useState, useEffect } from 'react'
import './index.css'


const Header = (props)=>{
    return (
      <div>
        <h2>{props.name}</h2>
      </div>
    )
}

const Content = (props)=>{
  return(
  props.parts.map(course =>
    <p key={course.id}>
      {course.name} {course.exercises}
    </p>
  )
    
    
)
}

const Filter = (props)=>{
return(
  <form onSubmit={props.addFilter}>
      <div>
        filter shown with
        <input value={props.wordType}
        onChange={props.handleFilter}/>
      </div>
  </form>
)
}
const Total = (props)=>{
  const total = props.parts.reduce((sum, course)=>
  sum + course.exercises, 0)
  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

const PersonForm= (props)=>{
  return(
    <form onSubmit={props.addNumber}>
        <div>
          name: <input value={props.newName}
          onChange={props.handleNameChange}/>
        </div>

        <div>
          number: <input value={props.newNumber}
          onChange={props.handleNumberChange}/>
        </div>
        <div>
            <button type="submit">add</button>
        </div>
      </form>
  )
}


    






function App(props) {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [wordType, setwordType] = useState('')
  const {courses} = props
  const [successMessage, setsuccessMessage]= useState(null)
  const [errorMessage, seterrorMessage]= useState(null)





  const addFilter = (event)=>{
    event.preventDefault()
    const filterResult = persons.filter((person)=> person.name.toLowerCase().includes(wordType.toLowerCase()))
    setPersons(filterResult)
    
  }
  const addNumber = (event) =>{
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name:newName,
      // important: Math.random() < 0.5,
      number:newNumber,
      id: String(persons.length + 1),
      
    }
    
    // check whether the name is already existed
    if (persons.some(person => person.name === newName)){
      if (confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const id = parseInt(person.id)
        console.log(id);
          axios
              .put(`http://localhost:3001/persons/${id}`, personObject)
              .then(response=>{
                console.log(response);
              })
              .catch(error =>{
                console.log(error.message)
                seterrorMessage(
                  `Information of ${personObject.name} has already been removed from server`
                )
                setTimeout(() => {
                  seterrorMessage(null)
                }, 5000);
              }
        
              )
      }
    }else{
      axios
          .post('http://localhost:3001/persons',personObject)
          .then(response =>{
            setPersons(persons.concat(response.data))
            setsuccessMessage(
              `Added ${response.data.name}`
            )
            setTimeout(() => {
              setsuccessMessage(null)
            }, 5000);
            //set the sucess message to null after 5 seconds 
          })
          
    // the method does not mutate the original person, but creating a new copy of the array with new added item
      
    }
    setNewName('')
    setNewNumber('')
    
  }

  const handleNameChange = (event)=>{
    const input = event.target.value;
    console.log(input)
    setNewName(input);
  
  }

  const handleNumberChange = (event)=>{
    setNewNumber(event.target.value);
    console.log("number", event.target.value)
  }

  const handleFilter = (event)=>{
    setwordType(event.target.value);
  }
  const deleteNumber=(person)=>{
    if (window.confirm(`Delete ${person.name}`)){
      const id = parseInt(person.id)
      console.log(id);
      axios.delete('http://localhost:3001/persons/' + id).then((response)=>{
        console.log(response);
      })
      
      
    }

  }

  useEffect(()=>{
    console.log("effect")

    axios.get('http://localhost:3001/persons').then(response=>{
      console.log('promise fulfilled')
      setPersons(response.data)
    })
  },[])

  const [value, setValue] = useState('')
  const [country, setCountry] = useState(null)
  const [searchResult, setSearchResult] = useState([])
  const [countryDetail, setcountryDetail] = useState('')
  const [weather, setWeather] = useState('')

  const api_key = 'e06eb7b105b20a81e61d3a47771a7523';
  //handle country
  useEffect(()=>{

      console.log("fetching countries")
      if (country){
          axios
              .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
              .then(response=>{
                const countries = response.data
                console.log("response data",countries)

                const result = countries.filter((country)=> country.name.common.toLowerCase().includes(value.toLowerCase()))
                if (result.length > 10){
                  setSearchResult(null);
                }
                else if (result.length == 1){
                      setcountryDetail(result[0]);
                      fetchWeather(result[0].capital[0]); //get the capital name
                }
                else if (result.length === 0){
                  setSearchResult('not result')
                }
                else{
                setSearchResult(result)
                }
                
              })
      
      

      }
      
      
      

    

  },[country])

  const fetchWeather = (countryCapital)=>{
    axios
        .get(
            `https://cors-anywhere.herokuapp.com/https://api.openweathermap.org/data/2.5/weather?q=${countryCapital}&appid=${api_key}&units=metric`
        )
        .then((response) =>{
          console.log("weather", response.data)
          setWeather(response.data);
        })
  }

  const handleCountryChange=(event)=>{
    setValue(event.target.value)
  }

  const onSearch = (event)=>{
    event.preventDefault()
    setSearchResult([]) //clear the last previous result
    setcountryDetail('')
    setCountry(value)
  }

  const handleshowDetail= (Country)=>{
    setcountryDetail(Country)
  }

  const SuccessNotification= ({message})=>{
    if (message === null){
      return null
    }
    return (
      <div className='success'>
        {message}
      </div>
    )
  }
  const ErrorNotification= ({message})=>{
    if (message === null){
      return null
    }
    return (
      <div className='error'>
        {message}
      </div>
    )
  }
  
  return (
    <div>
      //web development course section
      <h1>1. Web development curriculum</h1>
        {courses.map((course)=>
            <div key={course.id}>
             <Header name={course.name}/>
              <Content parts={course.parts}/>
             <Total parts = {course.parts}/>
           </div>
        )}


        //phone number
        <div>
          <h2>2. Phonebook</h2>
          <SuccessNotification message={successMessage}/>
          <ErrorNotification message={errorMessage}/>
          <Filter addFilter={addFilter}  wordType ={wordType} handleFilter={handleFilter} />
          
          <h2>Add a new</h2>
          <PersonForm newName={newName} newNumber={newNumber} addNumber={addNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange}/>
          
          <h2>Numbers</h2>
          <div>
            {
              persons.map((person)=>
                <div key={person.id}>
                  <p>{person.name} {person.number} <button onClick={()=> deleteNumber(person)}>delete</button></p>
                </div>
              )
            }
          </div>
           
        </div>

        <div>
          <h2>3. Country</h2>
          <form onSubmit={onSearch}>
            find countries<input value ={value} onChange={handleCountryChange}/>

          </form>
          {searchResult === null ? (<p>Too many matches, specify another filter</p>) :
          searchResult === 'not result'?
          (
            <p>No result to display</p>
          ):
          
            (
            <ul>
              {searchResult.map((country, index) =>(
                <li key={index}>{country.name.common} <button onClick={()=> handleshowDetail(country)}>show</button></li>
              ))}
            </ul>
            )
          }
          {countryDetail &&(
            <div>
              <h2>{countryDetail.name.common}</h2>
              <br></br>
              <p>capital: {countryDetail.capital[0]}</p>
              <p>area: {countryDetail.area} </p>
              <h3>languages:</h3>
              <br></br>
              <ul>
                {Object.values(countryDetail.languages).map((language, index) =>(
                  <li key={index}>{language}</li>
                ))}
              </ul>
            <img
                src={countryDetail.flags.png}
              alt={` ${countryDetail.name.common} flag`}
              style={{ width: '100px' }}
            />

            {weather &&(
              <div>
                <h3>Weather in {countryDetail.capital[0]}</h3>
                <p>temperature: {weather.main.temp} Celcius</p>
                <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={'weather icon'}
              style={{ width: '100px' }}
            />
                <p>Wind: {weather.wind.speed} m/s</p>
              </div>
            )}
                
              
            </div>
          )}
        </div>
     
    </div>
  )

  
}

export default App
