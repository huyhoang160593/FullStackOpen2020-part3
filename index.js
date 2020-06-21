require('dotenv').config()
const express =require('express')
const morgan = require('morgan')
const cors = require('cors')
const Phonebook = require('./models/phonebook')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('jsonObject',(request,response)=>{
    const body = request.body
    const person= {
        name: body.name,
        number: body.number
    }

    return JSON.stringify(person)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jsonObject'))


app.get('/info',(request,response)=> {
    let date = new Date()
    Phonebook.estimatedDocumentCount()
    .then(count => {
        response.send(`<p>Phonebook has info for ${count} </p>
                    <p>${date.toString()}</p>`)
        //and do one super neat trick
    })
    .catch(err => {
        console.log(err)
    })
    
})

app.get('/api/persons',(request,response)=> {
    Phonebook.find({}).then(person=>{
        response.json(person)
    })
})

app.get('/api/persons/:id',(request,response,next)=>{
    Phonebook.findById(request.params.id)
    .then(person=>{
        if(person){
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

// const generateID = () => {
//     const randomID = Math.floor(Math.random() * Math.floor(200))+5
//     return randomID
// }

app.post('/api/persons',(request,response,next)=>{
    const body = request.body

    if(!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if(!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    // let duplicate = persons.find(person=>person.name === body.name)
    // console.log(duplicate)
    // if(persons.find(person=>person.name === body.name)){
    //     return response.status(400).json({
    //         error: `${body.name} already exists in the phonebook` 
    //     })
    // }

    const person = new Phonebook({
        name: body.name,
        number: body.number,
        date: new Date()
    })

    person
        .save()
        .then(savePerson => savePerson.toJSON)
        .then(saveFormattedPerson => {
            response.json(saveFormattedPerson)
        })
        .catch(error=>next(error))
})

app.delete('/api/persons/:id',(request,response,next)=>{
    Phonebook.findByIdAndDelete(request.params.id)
        .then(result=>response.status(204).end)
        .catch(error=>next(error))
})

app.put('/api/persons/:id',(request, response,next)=>{
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Phonebook.findByIdAndUpdate(request.params.id, person,{new:true, runValidators:true})
    .then(updatePerson => {
        response.json(updatePerson)
    })
    .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  } 
  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError'){
        return response.status(400).json({ error:error.message })
    }
  
    next(error)
  }
// handler of requests with result to errors
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})