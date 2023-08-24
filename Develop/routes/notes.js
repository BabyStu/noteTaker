const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const fs = require('fs')

notes.get('/', (req, res) => {
    res.json(JSON.parse(fs.readFileSync('./db/notes.json', 'utf8')))
});

// notes.delete('/:note_id', (req, res) => {
//     console.log('inside delete')
//     const noteId = req.params.note_id;
//     console.log(noteId)

//     fs.readFile(./db/notes.json, 'utf8', (readErr, data) => {
//         console.log(noteId)

//         if (readErr) {
//             console.error('ERROR', readErr);
//             return;
//         }

//         const json = JSON.parse(data);

//         const updatedJson = json.filter(note => note.note_id !== noteId);

//         console.log(noteId)

//         fs.writeFile(./db/notes.json, JSON.stringify(updatedJson), (writeErr) => {
//             if (writeErr) {
//                 console.log('ERROR', writeErr);
//                 return;
//             }

//             res.json('DELETED NOTE');
//         });
//     });
// });

notes.post('/', (req, res) => {

    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            note_id: uuidv4(),
        };

        const noteString = JSON.stringify(newNote)

        fs.readFile('./db/notes.json', 'utf8', (readErr, noteString) => {
            if (readErr) {
                console.error('ERROR:', readErr);
                res.status(500).json({ error: 'An error occurred while reading the file' });
                return;
            }
        
            let noteParse = JSON.parse(noteString) || [];
            noteParse.push(newNote);
        
            fs.writeFile('./db/notes.json', JSON.stringify(noteParse), (writeErr) => {
                if (writeErr) {
                    console.error('ERROR:', writeErr);
                    res.status(500).json({ error: 'An error occurred while writing the file' });
                    return;
                }
        
                console.log('Note added!');
                res.json('Note added!');
            });
        });
        
        
    } else {
        console.error('ERROR!');
    }
});



module.exports = notes;
