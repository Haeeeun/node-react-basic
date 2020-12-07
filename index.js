const express = require('express') //express 모듈 가져오기
const app = express() //express app 만들기
const port = 3000 //백서버 port number
const bodyParser = require('body-parser');

const config = require('./config/key');

const { User } = require('./models/User');

//application/x-www-form-urlencoded 이런 형태를 분석 할 수 있게끔 하기 위해
app.use(bodyParser.urlencoded({extended: true}));

//application/json 형태를 분석할 수 있게끔 하기 위해
app.use(bodyParser.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDb Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World! 노드몬 사용중입니다!')
}) //루트 디렉토리 '/'에 오면 Hello World 이 출력되게끔

app.post('/register', (req,res) => {
    //회원 가입 할 때 필요한 정보들을 client 에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);
    user.save((err, userInfo) =>{
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})