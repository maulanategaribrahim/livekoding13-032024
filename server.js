const app = require('./app')

// const app = express();
const PORT = 8000;

app.listen(PORT, () => {
    console.log(`APP running on port : ${PORT}`);
});