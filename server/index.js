const app = require('express')();
const server = require('http').createServer(app);
const options = {};
const io = require('socket.io')(server, options);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

io.on('connection', socket => { 
    socket.on('join', ({name, room},callback)=>{
        const {error, user} = addUser({id: socket.id, name, room})
        console.log(`${name} has joined in ${room}`);
        if(error) callback(error)
        socket.emit('message', {user: 'admin', text: `Hi ${user.name}, welcome to the room ${user.room}`})
        socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name} has joined!`})
        socket.join(user.room);
        callback();
    })
    socket.on('sendMessage', (message, callback)=>{
        const user = getUser(socket.id);
        io.to(user.room).emit('message', {user: user.name, text: message})
        callback()
    })
    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)
        if (user) io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left!`})
    }) 
});
const PORT = process.env.PORT || 5000
server.listen(PORT, ()=>{
    console.log(`Server has started on port ${PORT}`);
});