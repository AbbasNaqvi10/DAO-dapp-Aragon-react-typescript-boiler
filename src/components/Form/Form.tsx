import "./styles.css";
import { Typography, AppBar, Toolbar, TextField, Button } from "@mui/material";
export default function CreateDAOForm() {
  return (
    <div className="App">
      <AppBar>
        <Toolbar>
          <h1>SIGNIN FORM </h1>
        </Toolbar>
      </AppBar>

      <Typography variant="h5">BASIC WITH MATERIAL UI</Typography>
      <form>
        <TextField style={{ width: "200px", margin: "5px" }} type="text" label="setgoal" variant="outlined" />
        <br />
        <TextField style={{ width: "200px", margin: "5px" }} type="text" label="goal description" variant="outlined" />
        <br />
        <TextField
          style={{ width: "200px", margin: "5px" }}
          type="text"
          label="Diversity catagory"
          variant="outlined"
        />
        <br />
        <TextField style={{ width: "200px", margin: "5px" }} type="text" label="Attribute" variant="outlined" />
        <br />
        <TextField style={{ width: "200px", margin: "5px" }} type="text" label="goal stage" variant="outlined" />
        <br />
        <TextField style={{ width: "200px", margin: "5px" }} type="number" label="job id" variant="outlined" />
        <br />
        <TextField style={{ width: "200px", margin: "5px" }} type="text" label="job region" variant="outlined" />
        <br />
        <Button variant="contained" color="primary">
          save
        </Button>
      </form>
    </div>
  );
}
