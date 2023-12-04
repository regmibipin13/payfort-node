require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

const CryptoJS = require('crypto-js');
const sha2String = require('./sha');

const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(express.static(__dirname + '/assets/'));
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/',(req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// After getting success from tokenization directly call for authorization
app.post('/api-success',(req, res) => {

    console.log(req.body);

    if(req.body.response_message == 'Success') {

        const data = {
            // Either take details from the request itself or fetch from env or database
            command:'AUTHORIZATION',
            amount:req.body.amount,
            merchant_identifier:req.body.merchant_identifier,
            access_code:req.body.access_code,
            merchant_reference:req.body.merchant_reference,
            currency:req.body.currency,
            language:req.body.language,
            // Token Name is comming from response
            token_name:req.body.token_name,
            // Get detials of current logged in user
            customer_email:'test@gmail.com'
        };


        const shaRequestPassphrase = process.env.SHA_REQ;
        const str = sha2String(data);
        const concatenatedString = shaRequestPassphrase + str + shaRequestPassphrase;
        const hash = CryptoJS.SHA256(concatenatedString).toString();

        data.signature = hash;

        console.log(data);

        const api = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

            axios.post(api, data).then((response) => {
                console.log(response.data);
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify(response.data));
            }).catch((err) => {
                console.log(err)
            })
    } else {
        res.setHeader('Content-Type','application/json')
        res.send(req.body);
    }
});


// capture
app.post('/capture',(req, res) => {

    const data = {
        command:'CAPTURE',
        access_code:process.env.ACCESS_CODE,
        merchant_identifier:process.env.MERCHANT_IDENTIFIER,
        merchant_reference:req.body.merchant_reference,
        amount:req.body.amount,
        currency:'EGP',
        language:'en',
        fort_id:req.body.fort_id
    }
    const shaRequestPassphrase = process.env.SHA_REQ;
    const str = sha2String(data);
    const concatenatedString = shaRequestPassphrase + str + shaRequestPassphrase;
    const hash = CryptoJS.SHA256(concatenatedString).toString();
    data.signature = hash;

    const api = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

    axios.post(api, data).then((response) => {
        console.log(response.data);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response.data));
    }).catch((err) => {
        console.log(err)
    })
});



// void authorization
app.post('/void-authorization',(req, res) => {

    const data = {
        command:'VOID_AUTHORIZATION',
        access_code:process.env.ACCESS_CODE,
        merchant_identifier:process.env.MERCHANT_IDENTIFIER,
        merchant_reference:req.body.merchant_reference,
        language:'en',
        fort_id:req.body.fort_id
    }
    const shaRequestPassphrase = process.env.SHA_REQ;
    const str = sha2String(data);
    const concatenatedString = shaRequestPassphrase + str + shaRequestPassphrase;
    const hash = CryptoJS.SHA256(concatenatedString).toString();
    data.signature = hash;

    const api = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

    axios.post(api, data).then((response) => {
        console.log(response.data);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response.data));
    }).catch((err) => {
        console.log(err)
    })

});


// Refund 
app.post('/refund',(req, res) => {

    const data = {
        command:'REFUND',
        access_code:process.env.ACCESS_CODE,
        merchant_identifier:process.env.MERCHANT_IDENTIFIER,
        merchant_reference:req.body.merchant_reference,
        currency:'EGP',
        language:'en',
        fort_id:req.body.fort_id,
        amount:req.body.amount,
    }
    const shaRequestPassphrase = process.env.SHA_REQ;
    const str = sha2String(data);
    const concatenatedString = shaRequestPassphrase + str + shaRequestPassphrase;
    const hash = CryptoJS.SHA256(concatenatedString).toString();
    data.signature = hash;

    const api = 'https://sbpaymentservices.payfort.com/FortAPI/paymentApi';

    axios.post(api, data).then((response) => {
        console.log(response.data);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response.data));
    }).catch((err) => {
        console.log(err)
    })

});


// create and return signature 
app.post('/signature',(req, res) => {
    
    const data = {
        // Either take details from the request itself or fetch from env or database
        service_command:'TOKENIZATION',
        amount:req.body.amount,
        merchant_identifier:process.env.MERCHANT_IDENTIFIER,
        access_code:process.env.ACCESS_CODE,
        merchant_reference:req.body.merchant_reference,
        currency:'EGP',
        language:'en',
        return_url:'http://localhost:3000/api-success',
    };
    const shaRequestPassphrase = process.env.SHA_REQ;
    const str = sha2String(data);
    const concatenatedString = shaRequestPassphrase + str + shaRequestPassphrase;
    const hash = CryptoJS.SHA256(concatenatedString).toString();
    res.json({signature:hash, merchant_identifier:process.env.MERCHANT_IDENTIFIER, access_code: process.env.ACCESS_CODE});
});



app.listen(port, () => {
    console.log(`Server is listening on ${port}`);

})