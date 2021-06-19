const express = require('express')

const app = express()
app.use(require('cors')())
app.use(express.json())

app.use('/admin',express.static(__dirname + '/admin'))
require('./routes/admin')(app)
require('./plugins/db')(app)
app.listen(3000,()=>{
    console.log('App listening on port 3000!');
})