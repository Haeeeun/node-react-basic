const express = require('express'); //express 모듈 가져오기
const app = express(); //express app 만들기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

//application/x-www-form-urlencoded 이런 형태를 분석 할 수 있게끔 하기 위해
app.use(bodyParser.urlencoded({extended: true}));

//application/json 형태를 분석할 수 있게끔 하기 위해
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDb Connected...')).catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World! 노드몬 사용중입니다!')
}) //루트 디렉토리 '/'에 오면 Hello World 이 출력되게끔

app.get('/api/hello', (req, res) => {
    res.send("안녕하세요")
})

app.post('/api/users/register', (req,res) => {
    //회원 가입 할 때 필요한 정보들을 client 에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.

    const user = new User(req.body);

    user.save((err, userInfo) =>{
        if(err) return res.json({ success: false, err})
        return res.status(200).json({
            userInfo: userInfo,
            success: true
        })
    })
})

app.post('/api/users/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 찾는다
    User.findOne({ email: req.body.email }, (err, user) =>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "비밀번호가 틀렸습니다."
                })
            }

            //비밀번호까지 맞다면 토큰 생설
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다
                res.cookie('x_auth', user.token).status(200).json({
                    loginSuccess: true,
                    userId: user._id
                })

            })
        })
    })
})

//auth 는 req 하기 전에 실행되는 미들웨어
//role 0 --> 일반 유저, role 1 --> 관리자
app.get('/api/users/auth', auth, (req,res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate(
    {_id: req.user._id},
    { token: "" },
    (err, user) =>{
        if(err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        })
    })
})


const port = 5000; //백서버 port number
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})