const express =require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

app.use(express.json())

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck ",
        "number": "39-23-6423122",
        "id": 4
      }
]

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
    response.send(`<p>Phonebook has info for ${persons.length}</p>
                    <p>${date.toString()}</p>`)
})

app.get('/api/persons',(request,response)=> {
    response.json(persons)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=>person.id !== id)

    response.status(204).end()
})

const generateID = () => {
    const randomID = Math.floor(Math.random() * Math.floor(200))+5
    return randomID
}

app.post('/api/persons',(request,response)=>{
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
    let duplicate = persons.find(person=>person.name === body.name)
    console.log(duplicate)
    if(persons.find(person=>person.name === body.name)){
        return response.status(400).json({
            error: `${body.name} already exists in the phonebook` 
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateID()
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT||3001 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})