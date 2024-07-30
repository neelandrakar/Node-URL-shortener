console.log('Trying to connect');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const DB = 'mongodb+srv://neelandra:Neelandra10@cluster0.tuqpog7.mongodb.net/?retryWrites=true&w=majority';
const PORT = 5000;
const shortUrl = require('./models/shortUrl');
app.set('view engine','ejs');
app.use(express.urlencoded({
    extended: false
}));

app.listen(PORT,'0.0.0.0',function(){
    console.log(`Connected at ${PORT}`);
});

//Connecting to mongo
mongoose.connect(DB)
.then(()=>{
    console.log('Connected Successfully');
})
.catch((e)=>{
    console.log(`Error while connecting. Error: ${e}`);
});

app.get('/', async (req,res) =>{ 
    const shortUrls = await shortUrl.find();
    res.render('index', { shortUrls: shortUrls });
});

app.post('/shortUrls', async (req,res) =>{ 
    await shortUrl.create({
        full: req.body.fullUrl
    });

    res.redirect('/');
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrlx = await shortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrlx == null) return res.sendStatus(404)
  
    shortUrlx.clicks++
    shortUrlx.save()
  
    res.redirect(shortUrlx.full)
  })