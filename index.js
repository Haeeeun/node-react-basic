const express = require('express') //express 모듈 가져오기
const app = express() //express app 만들기
const port = 3000 //백서버 port number

app.get('/', (req, res) => {
    res.send('Hello World!')
}) //루트 디렉토리 '/'에 오면 Hello World 이 출력되게끔

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://haeeun:haeeun04@cluster0.5rfu8.mongodb.net/<dbname>?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDb Connected...')).catch(err => console.log(err))

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})