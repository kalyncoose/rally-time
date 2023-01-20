import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './Popup.css';
import {
  IconButton,
  Toolbar,
  Typography,
  Container,
  Stack,
  Button,
  InputAdornment,
  Divider,
  ButtonGroup,
  Box,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel
} from "@mui/material";
import {AccessTime, Add, ArrowBackIos, Delete, MoreVert, Replay} from "@mui/icons-material";

export default class Popup extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showSettings: false,
      showTimesArray: false,
      calculation: 0,
      pointsPerDay: 1,
      hoursPerDay: 8,
      pointInterval: 0.25,
      minPoints: 0.25,
      times: ['']
    }

    this.checkLocalStorage()
  }

  checkLocalStorage() {
    console.log("[Rally Time] Checking local storage...");
    chrome.storage.local.get(["pointsPerDay"]).then((result) => {
      if (result.pointsPerDay) {
        console.log(`[Rally Time] Found pointsPerDay: ${result.pointsPerDay}`);
        this.state.pointsPerDay = result.pointsPerDay;
      }
    });
    chrome.storage.local.get(["hoursPerDay"]).then((result) => {
      if (result.hoursPerDay) {
        console.log(`[Rally Time] Found hoursPerDay: ${result.hoursPerDay}`);
        this.state.hoursPerDay = result.hoursPerDay;
      }
    });
    chrome.storage.local.get(["pointInterval"]).then((result) => {
      if (result.pointInterval) {
        console.log(`[Rally Time] Found pointInterval: ${result.pointInterval}`);
        this.state.pointInterval = result.pointInterval;
      }
    });
    chrome.storage.local.get(["minPoints"]).then((result) => {
      if (result.minPoints) {
        console.log(`[Rally Time] Found minPoints: ${result.minPoints}`);
        this.state.minPoints = result.minPoints;
      }
    });
  }

  handleUpdateCalculation(times) {
    // Conversions
    const pointsPerDay = this.state.pointsPerDay;
    const hoursPerDay = this.state.hoursPerDay;
    const pointInterval = this.state.pointInterval;
    const minPoints = this.state.minPoints;
    const pointsPerHour = pointsPerDay/hoursPerDay;
    const pointsPerMinute = pointsPerHour/60;

    // Concat all times
    let input = ""
    for (const time of times) {
      input += String(time)+',' // insert comma to stop time coalescing
    }

    // Set regex and match
    const  regex = /\s*(?<days>\d+)d\s*|\s*(?<hours>\d+)h\s*|\s*(?<minutes>\d+)m\s*/g;
    const matches = input.matchAll(regex);

    // Check for matches and calculate
    let points = 0
    for (const match of matches) {

      // Calculate days
      if (match.groups.days > 0) {
        console.log(`[Rally Time] Matched days: ${match.groups.days}`);
        let days = match.groups.days * pointsPerDay;
        console.log(`[Rally Time] Calculated days: ${days}`);
        points += days
      }

      // Calculate hours
      if (match.groups.hours > 0) {
        console.log(`[Rally Time] Matched hours: ${match.groups.hours}`);
        let hours = match.groups.hours * pointsPerHour;
        console.log(`[Rally Time] Calculated hours: ${hours}`);
        points += hours
      }

      // Calculate minutes
      if (match.groups.minutes > 0) {
        console.log(`[Rally Time] Matched minutes: ${match.groups.minutes}`);
        let minutes = match.groups.minutes * pointsPerMinute;
        console.log(`[Rally Time] Calculated minutes: ${minutes}`);
        points += minutes
      }
    }
    // Round to the nearest point interval
    console.log(`[Rally Time] Rounded points to nearest interval: ${points} to ${Math.round(points/pointInterval) * pointInterval}`);
    points = Math.round(points/pointInterval) * pointInterval;

    // Truncate if decimal is zero
    if (points % 1 === 0) {
      console.log(`[Rally Time] Truncating points: ${points} to ${Number(points)}`);
      points = Number(points)
    }
    // Base case for minimum points
    if (points > 0 && points < minPoints) {
      console.log(`[Rally Time] Setting minimum points: ${points} to ${minPoints}`);
      points = minPoints
    }
    this.setState({calculation: points});
  }

  handleResetTimes = event => {
    const { times, calculation } = this.state;
    console.log(`[Rally Time] Resetting times and calculation`);
    this.setState({times: [''], calculation: 0})

  }

  handleShowSettings = event => {
    const { showSettings } = this.state;
    this.setState({showSettings: !showSettings})
  }

  handleShowTimesArray = event => {
    const { showTimesArray } = this.state;
    this.setState({showTimesArray: !showTimesArray})
  }

  handleChangePointsPerDay = event => {
    const { pointsPerDay } = this.state;
    this.setState({pointsPerDay: event.target.value})
    if (event.target.value) {
      chrome.storage.local.set({ pointsPerDay: event.target.value }).then(() => {
        console.log(`[Rally Time] Set storage for pointsPerDay: ${event.target.value}`);
      });
    }
  }

  handleChangeHoursPerDay = event => {
    const { hoursPerDay } = this.state;
    this.setState({hoursPerDay: event.target.value})
    if (event.target.value) {
      chrome.storage.local.set({ hoursPerDay: event.target.value }).then(() => {
        console.log(`[Rally Time] Set storage for hoursPerDay: ${event.target.value}`);
      });
    }
  }

  handleChangePointInterval = event => {
    const { pointInterval } = this.state;
    this.setState({pointInterval: event.target.value})
    if (event.target.value) {
      chrome.storage.local.set({ pointInterval: event.target.value }).then(() => {
        console.log(`[Rally Time] Set storage for pointInterval: ${event.target.value}`);
      });
    }
  }

  handleChangeMinPoints = event => {
    const { minPoints } = this.state;
    this.setState({minPoints: event.target.value})
    if (event.target.value) {
      chrome.storage.local.set({ minPoints: event.target.value }).then(() => {
        console.log(`[Rally Time] Set storage for minPoints: ${event.target.value}`);
      });
    }
  }

  handleChangeTime = index => event => {
    const { times } = this.state;
    const newTimes = times.slice(0); // Create a shallow copy of the roles
    newTimes[index] = event.target.value; // Set the new value
    this.setState({ times: newTimes });
    this.handleUpdateCalculation(newTimes);
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
    if (times.length === 1) {
      this.handleResetTimes();
    } else {
      newTimes.splice(index, 1); // Remove time
      this.setState({ times: newTimes });
      this.handleUpdateCalculation(newTimes);
    }
  }

  handleCopy = value => event => {
    navigator.clipboard.writeText(value).then(function() {
      console.log(`[Rally Time] Successfully copied "${value}" to clipboard`);
    }, function(err) {
      console.error(`[Rally Time] Failed to copy "${value}" with error "${err}"`);
    });
    window.close(); // Close popup
  }

  handleSendMessage = (field, points) => event => {
    console.log(`[Rally Time] [Popup] sendMessage with field "${field}" and points "${points}"`)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {field: field, points: points}, function (response) {
        console.log(`[Rally Time] [Popup] Received response: "${JSON.stringify(response.status)}"`)
      })
    });
    window.close(); // Close popup
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
            <IconButton
                size="large"
                edge="end"
                aria-label="display more actions"
                color="inherit"
                onClick={this.handleShowSettings}
            >
              { this.state.showSettings
                ? <ArrowBackIos />
                : <MoreVert/>
              }
            </IconButton>
          </Toolbar>
          { this.state.showSettings &&
              <Container className="Content">
                <Typography variant="subtitle2">
                  Settings
                  <Divider />
                  <Stack direction="column" spacing={2} sx={{marginTop: 1.5, marginBottom: 1}}>
                    <Stack direction="row" spacing={1}>
                    <TextField
                        label="Points Per Day"
                        value={this.state.pointsPerDay}
                        onChange={this.handleChangePointsPerDay}
                        size="small"
                        required
                    />
                    <TextField
                        label="Hours Per Day"
                        value={this.state.hoursPerDay}
                        onChange={this.handleChangeHoursPerDay}
                        size="small"
                        required
                    />
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      <TextField
                          label="Point Interval"
                          value={this.state.pointInterval}
                          onChange={this.handleChangePointInterval}
                          size="small"
                          required
                      />
                      <TextField
                          label="Minimum Points"
                          value={this.state.minPoints}
                          onChange={this.handleChangeMinPoints}
                          size="small"
                          required
                      />
                    </Stack>
                    {/*
                      const pointsPerHour = pointsPerDay/hoursPerDay;
                      const pointsPerMinute = pointsPerHour/60;
                    */}
                    <Stack direction="row" spacing={1}>
                      <TextField
                          label="Points Per Hour"
                          value={this.state.pointsPerDay/this.state.hoursPerDay}
                          size="small"
                          disabled
                          helperText="Auto-calculated"
                      />
                      <TextField
                          label="Points Per Minute"
                          value={(this.state.pointsPerDay/this.state.hoursPerDay)/60}
                          size="small"
                          disabled
                          helperText="Auto-calculated"
                      />
                    </Stack>
                  </Stack>
                  <FormGroup>
                    <FormControlLabel
                        label="Debug Times Array"
                        labelPlacement="end"
                        control={
                      <Switch
                        checked={this.state.showTimesArray}
                        onChange={this.handleShowTimesArray}
                    />} />
                  </FormGroup>
                </Typography>
              </Container>
          }
          { !this.state.showSettings &&
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
                                  <Delete sx={{opacity:0.3}} />
                                </IconButton>
                              </InputAdornment>
                        }}
                    />
                )
              }
            </Stack>
            <Stack direction="row" spacing={1} sx={{marginBottom:1}}>
              <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={this.handleAddTime}
              >
                Time
              </Button>
              <IconButton
                  size="small"
                  onClick={this.handleResetTimes}
              ><Replay sx={{opacity:0.5}} />
              </IconButton>
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
                <Button onClick={this.handleCopy(this.state.calculation)}>Copy</Button>
                <Button onClick={this.handleSendMessage("Estimate", this.state.calculation)}>Estimate</Button>
                <Button onClick={this.handleSendMessage("Actual", this.state.calculation)}>Actual</Button>
              </ButtonGroup>
            </Box>
            { this.state.showTimesArray &&
              <div>
              <Divider/>
              <Typography variant="caption">
                Times Array
              </Typography>
              <ul>
                {
                  this.state.times.map((time, index) => (
                      <li key={`times[${index}]`}>
                        {`${index} : ${time}`}
                      </li>
                  ))
                }
              </ul>
            </div>
            }
          </Container>
          }
        </div>
    );
  }
}
