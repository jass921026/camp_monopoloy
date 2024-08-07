import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Container,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Button,
  FormControl,
} from "@mui/material";
import Loading from "../Loading";
import SendIcon from "@mui/icons-material/Send";
import RoleContext from "../useRole";
import axios from "../axios";
import TeamSelect from "../TeamSelect";

const Resources = () => {
  let flag = false;
  const [team, setTeam] = useState(-1);
  const [teamToCheckBalance, setTeamToCheckBalance] = useState(0);
  const [resourceToCheckQuan, setResourceToCheckQuan] = useState(0);
  const [mode, setMode] = useState(0);
  const [resourceId, setResourceId] = useState(-1);
  const [number, setNumber] = useState(0);
  const { roleId, teams, setTeams, setNavBarId, resources, setResources } =
    useContext(RoleContext); // eslint-disable-line no-unused-vars

  const navigate = useNavigate();

  const columns = [
    { id: "name", label: "Type", minWidth: "15vw", align: "center" },
    { id: "price", label: "Price", minWidth: "17vw", align: "center" },
  ];

  const getResources = async () => {
    axios
      .get("/resourceInfo")
      .then((res) => {
        setResources(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCheck = async (team, resourceId) => {
    axios
      .get("/team/" + team)
      .then((res) => {
        setTeamToCheckBalance(res.data.money);

        if(resourceId == 0){
          setResourceToCheckQuan(res.data.resources.love);
          console.log(res.data.resources.love);
          console.log(resourceToCheckQuan);
        }else if(resourceId == 1){
          setResourceToCheckQuan(res.data.resources.eecoin);
        }

        console.log(resourceToCheckQuan);
      })
      .catch((error) => {
        console.error(error);
      });
  };
      
  
  const handleClick = async () => {
    const payload = {
      teamId: team,
      resourceId: resourceId,
      number: number,
      mode: mode, // 0 for sell, 1 for buy
    };

    console.log(payload);
    //check whether the trade is valid
    getCheck(team, resourceId);

    if(mode === 1){//buy
      console.log(resources[resourceId].price * number);
      console.log(teamToCheckBalance);
      if(teamToCheckBalance < resources[resourceId].price * number){
        alert("Not enough money to buy");
        return;
      }
    }else{//sell
      if(resourceToCheckQuan < number){
        alert("Not enough resource to sell");
        return;
      }
    }

    await axios.post("/sellResource", payload);
    navigate("/teams");
    setNavBarId(2);
  };

  const handleTeam = (team) => {
    if (team === 0) {
      setNumber(0);
    }
    setTeam(team);
  };

  const updatePrices = async () => {
    // console.log(resources);
    // console.log(1);
    // const payload = { resources: resources };
    await axios.post("/resource");
  };

  useEffect(() => {
    // getResourcesQuan();
    getResources();
    const update = setInterval(() => {
      // getResourcesQuan();
      getResources();
      flag = !flag;
      if (flag) updatePrices();
      console.log("update");
    }, 80000);

    return () => clearInterval(update);
  }, []);

  if (teams.length === 0) {
    return <Loading />;
  } else {
    return (
      <>
          <Container component="main" maxWidth="xs">
            <Box
              sx={{
                marginTop: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Resource Trading
              </Typography>

              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <TeamSelect
                  label="Team"
                  team={team}
                  handleTeam={handleTeam}
                  hasZero={false}
                />
              </FormControl>


              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="resource">Resource</InputLabel>
                <Select
                  value={resourceId}
                  labelId="resource"
                  onChange={(e) => {
                    setResourceId(e.target.value);
                  }}
                >
                  <MenuItem value={-1}>Select Resource</MenuItem>
                  {resources.map((resource, index) => (
                    <MenuItem value={index} key={index}>
                      {resource.name}
                    </MenuItem>
                  ))}
                </Select>

            {/* <Select
              value={resourceId}
              labelId="resource"
              onChange={(e) => {
                setResourceId(e.target.value);
              }}
            >
              <MenuItem value={-1}>Select Resource</MenuItem>
              {resources.map((resource, index) => (
                <MenuItem value={index} key={index}>
                  {Object.keys(resource).map((key) => (
                    <span key={key}>{key}, </span>
                  ))}
                </MenuItem>
              ))}
            </Select> */}
              </FormControl>


              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="mode">Mode</InputLabel>
                <Select
                  value={mode}
                  labelId="mode"
                  onChange={(e) => {
                    setMode(e.target.value);
                  }}
                >
                  <MenuItem value={0}>Sell</MenuItem>
                  <MenuItem value={1}>Buy</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                <InputLabel id="number-resource">Number of resource</InputLabel>
                <Select
                  value={number}
                  labelId="number-resource"
                  onChange={(e) => {
                    setNumber(e.target.value);
                  }}
                >
                  <MenuItem value={0}>0</MenuItem>
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={6}>6</MenuItem>
                  <MenuItem value={7}>7</MenuItem>
                  <MenuItem value={8}>8</MenuItem>
                  <MenuItem value={9}>9</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>
              <FormControl
                variant="standard"
                sx={{ minWidth: 250, marginTop: 2 }}
              >
                {/* <Button
                disabled={team === -1 || building === -1}
                onClick={handleClick}
                sx={{ marginTop: 2 }}
              >
                Submit
              </Button> */}
                <Button
                  variant="contained"
                  disabled={team === -1 || number === -1}
                  onClick={handleClick}
                  fullWidth
                  sx={{ marginTop: 2 }}
                >
                  <SendIcon/>
                </Button>
              </FormControl>
            </Box>
          </Container>

          <Paper
            elevation={0}
            sx={{
              overflow: "hidden",
              paddingTop: "60px",
              paddingBottom: "60px",
              marginLeft: "2vw",
              marginRight: "2vw",
            }}
          >
            <TableContainer
              sx={{
                maxHeight: 900,
              }}
            >
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((item) => (
                        <TableCell
                          key={item.id}
                          align={item.align}
                          style={{
                            minWidth: item.minWidth,
                            fontWeight: "800",
                            userSelect: "none",
                          }}
                        >
                          {item.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resources.map((resource, index) => (
                      <TableRow key={index}>
                        {columns.map((column) => (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            style={{ userSelect: "none" }}
                          >
                            {column.id === "name"
                              ? resource.name  // Assuming resourceName is aligned with resourcesQuan by index
                              : column.id === "price"
                              ? resource.price  // Assuming resourcePrice is aligned with resourcesQuan by index // Use the value from resourceQuan directly
                              : null}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
            </TableContainer>
          </Paper>
        
      </>
    );
  }
};

export default Resources;
