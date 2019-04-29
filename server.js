const express = require('express');
const request = require('request');
const morgan = require('morgan');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();

const PORT = process.env.PORT || 8080;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static('public'));

app.set('views', './views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/thanks', (req, res) => {

  console.log(req.body);

  const { firstName, lastName, email } = req.body;

  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us17.api.mailchimp.com/3.0/lists/19ec0ec430',
    method: 'POST',
    headers: {
      Authorization: process.env.HEROKU_API_KEY
    },
    body: postData
  }

  request(options, (err, response, body) => {
    if (err) {
      console.log('error');
    } else {
      if (response.statusCode === 200) {
        res.render('thanks', { contact: req.body });
      } else {
        console.log('error')
      }
    }
  });

});

app.listen(PORT, () => {
  console.log('listening at http://localhost:8080')
})