process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

const data = JSON.stringify({
    policyId: 1,
    numberOfMonths: 6
});

const req = https.request('https://localhost:7207/api/Billing/emi', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
}, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => console.log('STATUS:', res.statusCode, 'BODY:', body));
});

req.on('error', console.error);
req.write(data);
req.end();
