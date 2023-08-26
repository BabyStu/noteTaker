const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

notes.get('/', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./db/notes.json', 'utf8')))
});

notes.delete('/:id', (req, res) => {
    console.log('inside delete')
    const noteId = req.params.id;
    console.log(noteId)

    fs.readFile('./db/notes.json', 'utf8', (readErr, data) => {
        console.log(noteId)

        if (readErr) {
            console.error('ERROR', readErr);
            return;
        }

        const json = JSON.parse(data);

        const updatedJson = json.filter(note => note.id !== noteId);

        console.log(noteId)

        fs.writeFile('./db/notes.json', JSON.stringify(updatedJson), (writeErr) => {
            if (writeErr) {
                console.log('ERROR', writeErr);
                return;
            }

            res.json('DELETED NOTE');
        });
    });
});

notes.post('/', (req, res) => {

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        let noteString = JSON.stringify(newNote)

        fs.readFile('./db/notes.json', 'utf8', (error, noteString) => {
            if (error) {
                console.log('ERROR:', error);
                return;
            }
        
            let noteParse = JSON.parse(noteString) || [];
            noteParse.push(newNote);
        
            fs.writeFile('./db/notes.json', JSON.stringify(noteParse), (error) => {
                if (error) {
                    console.log('ERROR:', error);
                    return;
                }
        
                console.log('Note added!');
                res.json(noteParse);
            });
        });
        
        
    } else {
        console.log('ERROR!');
    }
});



module.exports = notes;
