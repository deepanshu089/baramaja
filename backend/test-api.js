const axios = require('axios');

const test = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/categories');
    console.log('Categories fetched from API:', JSON.stringify(res.data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('API Error:', err.message);
    process.exit(1);
  }
};

test();
