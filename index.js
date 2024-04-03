const axios = require('axios');

const baseUrl = 'http://localhost:8080';
const config = {
    proxy: false
}

async function getClients() {
    try {
        return await axios.get(`${baseUrl}/clients`, {
            config
        });
    } catch (err) {
        console.error(err);
    }
}

async function createClient() {
    try {
        return await axios.post(`${baseUrl}/clients/:id`, {
            config
        })
    } catch (err) {
        console.log(err);
    }
}

getClients().then((res) => {
    console.log(res.data);
})

createClient().then((res) => {
    console.log(res.data);
});