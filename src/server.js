const express = require('express');
const bodyParser = require('body-parser');
const programmer = require('./database/tables/programmer');

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.get('/syncDatabase', async (req, res) => {
    const database = require('./database/db');

    try {
        await database.sync();

        res.send('Database successfully sync');
    } catch (error) {
        res.send(error);
    }
});

app.post('/createProgrammer', async (req, res) => {
    try {
        const params = req.body;

        const properties = ['name', 'javascript', 'java', 'python'];

        const check = properties.every((property) => {
            return property in params;
        });

        if (!check) {
            const propStr = properties.join(', ');
            res.send(`All parameters needed to create a programmer must be sent ${propStr}`);
            return;
        }

        const newProgrammer = await programmer.create({
            name: params.name,
            javascript: params.javascript,
            java: params.java,
            python: params.python
        });
    } catch (error) {
        res.send(error);
    }
});

app.get('/retrieveProgrammer',async(req,res)=>{
    try {
        const params = req.body;

        if('id' in params){
            const record = await programmer.findByPk(params.id);

            if(record){
                res.send(record);
            }else{
                res.send('No programmer found using received ID.');
            }
        }

        const records = await programmer.findAll();

    } catch (error) {
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});