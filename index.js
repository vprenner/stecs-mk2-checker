const axios = require('axios');
const cheerio = require('cheerio');

const PUSHOVER_USER_KEY = process.env.PUSHOVER_USER_KEY;
const PUSHOVER_API_TOKEN = process.env.PUSHOVER_API_TOKEN;

const url = 'https://flightsimcontrols.com/product-category/controllers/throttles/';

async function sendNotification(message) {
    await axios.post('https://api.pushover.net/1/messages.json', {
        token: PUSHOVER_API_TOKEN,
        user: PUSHOVER_USER_KEY,
        message: message,
        title: "STECS Mk.II Alert",
    });
}

async function checkAvailability() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const productNames = $('.product-title').map((i, el) => $(el).text()).get();

        if (productNames.some(name => {
          const pname = name.replace(/[\.\s]/g, '').toLowerCase();
          return pname.includes('mki') || pname.includes('mk2');
        })) {
            console.log('STECS Mk.II is available!');
            await sendNotification('🚀 The STECS Mk.II throttle is now available! Check it out: ' + url);
        } else {
            console.log('STECS Mk.II is NOT available yet.');
        }
    } catch (error) {
        console.error('Error checking availability:', error);
    }
}

checkAvailability();
