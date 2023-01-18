import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './Popup.css';
import {
    IconButton,
    Link,
    Toolbar,
    Typography,
    Container,
    Stack,
    Button,
    TextField,
    InputAdornment,
    Divider,
    ButtonGroup,
    Box,
    Hidden
} from "@mui/material";
import {AccessTime, Add, Delete, MoreVert} from "@mui/icons-material";

export default class Popup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            calculation: 0,
            times: ['']
        }
    }

    handleChangeTime = index => event => {
        const { times } = this.state;
        const newTimes = times.slice(0); // Create a shallow copy of the roles
        newTimes[index] = event.target.value; // Set the new value
        this.setState({ times: newTimes });
    }

    handleAddTime = event => {
        const { times } = this.state;
        const newTimes = times.slice(0); // Create a shallow copy of the roles
        newTimes.push(''); // Set the new value
        this.setState({ times: newTimes });
    }

    handleDeleteTime = index => event => {
        const { times } = this.state;
        const newTimes = times.slice(0); // Create a shallow copy of the roles
        newTimes.splice(index, 1); // Remove time
        this.setState({ times: newTimes });
    }

    render() {
        return (
            <div className="App">
                <Toolbar className="Header">
                    <AccessTime sx={{marginRight: 1, backgroundColor: '#229ad6', borderRadius: '50%'}}/>
                    <Typography variant="h6" color="inherit" component="div"
                                sx={{flexGrow: 1, alignSelf: 'flex-end', margin: 'auto'}}>
                        Rally Time
                    </Typography>
                    <Link href="/options.html" target="_blank" sx={{color: '#fff'}}>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="display more actions"
                            color="inherit"
                        >
                            <MoreVert/>
                        </IconButton>
                    </Link>
                </Toolbar>
                <Container className="Content">
                    <Stack direction="row"
                           divider={<Divider orientation="vertical" flexItem />}
                           spacing={2}>
                        <Typography variant="subtitle2">
                            Enter time(s):
                        </Typography>
                        <Typography variant="caption" sx={{color:'#888', marginTop:'auto !important'}}>
                            e.g. 7d 4h 30m
                        </Typography>
                    </Stack>
                    <Stack direction="column">
                        {
                            this.state.times.map((time, index) =>
                                <TextField
                                    key={`times[${index}]`}
                                    value={time}
                                    onChange={this.handleChangeTime(index)}
                                    size="small"
                                    margin="dense"
                                    sx={{backgroundColor: '#fff', color: '#000'}}
                                    InputProps={{
                                        endAdornment:
                                        <InputAdornment position="end">
                                            <IconButton
                                            aria-label="delete time"
                                            onClick={this.handleDeleteTime(index)}
                                            edge="end"
                                            >
                                                <Delete />
                                            </IconButton>
                                        </InputAdornment>
                                    }}
                                />
                            )
                        }
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Add />}
                            onClick={this.handleAddTime}
                            sx={{marginTop:1,marginBottom:2}}
                        >
                            Time
                        </Button>
                    </Stack>
                    <Divider />
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > *': {
                            m: 1,
                        },
                    }}>
                        <Typography variant="h3" sx={{marginTop:1}}>
                            {this.state.calculation}
                        </Typography>
                        <ButtonGroup size="small" variant="outlined">
                            <Button>Copy</Button>
                            <Button>Estimate</Button>
                            <Button>Actual</Button>
                        </ButtonGroup>
                    </Box>
                    <Hidden only="xs">
                        <Divider />
                        <ul>
                            {
                                this.state.times.map((time, index) => (
                                    <li key={`times[${index}]`}>
                                        {`${index} : ${time}`}
                                    </li>
                                ))
                            }
                        </ul>
                    </Hidden>
                </Container>
            </div>
        );
    }
}
