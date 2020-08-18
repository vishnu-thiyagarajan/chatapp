import React,{useState, useEffect, useRef} from 'react';
import queryString from "query-string";
import io from 'socket.io-client';
import Button from '@material-ui/core/Button';
import SendIcon from '@material-ui/icons/Send';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ReactEmoji from 'react-emoji';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      },
    root: {
      height: '80vh',
      overflowY: 'auto',
    },
    card:{
        width: '100%',
        marginBottom: '5px',
    },
    content: {
        padding: '8px 8px 8px 8px',
        '&:last-child': {
            paddingBottom: '8px',
        },
        overflowWrap : "break-word",
    },
  }));
let socket;
const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

function Chat({location}) {
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    const classes = useStyles();
    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    useEffect(()=>{
        const {name, room} = queryString.parse(location.search);
        socket = io(BACKEND_URI);
        setName(name)
        setRoom(room)
        socket.emit('join', {name, room},(error)=>{
            if (error) alert(error)
        })
        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[location.search])
    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message])
            scrollToBottom()
        })
    },[messages])
    const sendMessage = (event) => {
        event.preventDefault();
        if(message) {
          socket.emit('sendMessage', message, () => {
            setMessage('')
            scrollToBottom()
          });
        }
    }
  return (
    <>
    <Container component="main" maxWidth="xs">
    <CssBaseline />
    <div className={classes.paper}>
      <Grid container item xs={12} justify="center" alignItems="center" spacing={0}>
        <Grid item xs={12}>
            <Grid container item xs={12}>
                <Grid item xs>
                    <Typography variant="h4" color="textPrimary" gutterBottom>
                    <FiberManualRecordIcon style={{color:'green'}}/>Room : {room}
                    </Typography>
                </Grid>
                <Grid align="right" item xs={1}>
                <a href='/'><CloseIcon/></a>
                </Grid>
            </Grid>
            <Card className={classes.root} elevation={20}>
                <CardContent className={classes.content}>
                    <GridList>
                    {messages.map((msg,index) => (
                        <GridListTile cols={2} style={{ height: 'auto' }} key={index}>
                            <Card className={classes.card} elevation={20}>
                                <CardContent className={classes.content}>
                                    <Typography align={msg.user === name.trim().toLowerCase()? "right" : "left"} variant="body1" component="p" color="textSecondary" gutterBottom>
                                    {msg.user}
                                    </Typography>
                                    <Typography align={msg.user === name.trim().toLowerCase()? "right" : "left"} variant="body2" component="p">
                                    {ReactEmoji.emojify(msg.text)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </GridListTile>
                    ))}
                    <GridListTile cols={2} style={{ height: 'auto' }} ref={messagesEndRef} />
                    </GridList>
                </CardContent>
            </Card>
        </Grid>
      </Grid>  
      <Grid container item xs={12} justify="center" alignItems="center" spacing={0}>
          <Grid item xs={9}>
            <textarea
                autoFocus
                placeholder="Type a message..."
                style={{resize: 'none', width: '100%'}} 
                value={message} 
                onChange={(event)=>setMessage(event.target.value)} 
                onKeyPress={(event)=> event.key === 'Enter' ? sendMessage(event): null } />
          </Grid>
          <Grid item xs={3}>
            <Button
                variant="contained"
                color="primary"
                onClick={sendMessage}
                endIcon={<SendIcon />}
                >
                Send
            </Button>
          </Grid>
      </Grid>
      </div>
      </Container>
    </>
  );
}

export default Chat;
