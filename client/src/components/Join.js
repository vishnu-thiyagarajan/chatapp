import React,{useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import useForm from './hooks/useForm';
import {Redirect} from 'react-router-dom';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="http://tvishnu.netlify.app/">
        Vishnu T
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Join() {
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const onSubmit = ()=>setRedirect(true);
  const validation = (values)=>{
      let err = {} 
      if (values.name && values.room) return err
      if (!values.name) err.name = "Name is required"
      if (!values.room) err.room = "Room is required"
      return err
  }
  const [handleChange, handleSubmit, values, errors] = useForm(onSubmit, {name: '', room: ''}, validation)
  if (redirect) {
    return <Redirect to={`/chat?name=${values.name}&room=${values.room}`} />
  }
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AddCircleOutlineIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Join
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            value={values.name}
            error={!!errors.name}
            helperText={errors.name}
            onChange={handleChange}
            required
            fullWidth
            id="name"
            label="Name"
            name="name"
            autoComplete="name"
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            value={values.room}
            error={!!errors.room}
            helperText={errors.room}
            onChange={handleChange}
            required
            fullWidth
            name="room"
            label="Room"
            type="room"
            id="room"
            autoComplete="current-room"
          />
          <Button
            type="submit"
            fullWidth
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Join Room
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot room?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account?"}
              </Link>
            </Grid> */}
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}