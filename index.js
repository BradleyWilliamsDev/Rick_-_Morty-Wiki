import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const baseURL = "https://rickandmortyapi.com/api";
const characterEndpoint = "/character";

let characterPage = 1;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// This get uses axios to retrieve data from the rick and morty api and list the first 20 characters.
app.get("/", async (req, res) => {
  characterPage = 1;
  //   try {
  //     const content = await axios.get(
  //       `${baseURL}${characterEndpoint}/?page=${characterPage}`
  //     );
  //     res.render("index.ejs", { data: content.data });
  //   } catch (error) {
  //     res.status(500).send("Unable to retrieve data please try again");
  //   }
  // added the redirect to keep the url consistent and have the app.get that checks which page you are on
  res.redirect(`/pages=${characterPage}`);
});

// This is triggered when one of the read more anchors is clicked and it then gets the data with
// axios through an api call using that characters id.
app.get("/characters/:id", async (req, res) => {
  const characterID = req.params.id;
  try {
    const characterContent = await axios.get(
      `${baseURL}${characterEndpoint}/${characterID}`
    );
    res.render("character_page.ejs", { data: characterContent.data });
  } catch (error) {
    res.status(500).send("Unable to retrieve data please try again");
  }
});

app.post("/next-page", async (req, res) => {
  try {
    characterPage++;
    res.redirect(`/pages=${characterPage}`);
  } catch (error) {
    res.status(500).send("Page does not exist");
  }
});

app.post("/prev-page", async (req, res) => {
  if (characterPage > 1) {
    characterPage--;
    res.redirect(`/pages=${characterPage}`);
  } else {
    res.redirect("/");
  }
});

app.get("/pages=:pageNum", async (req, res) => {
  const pageNum = req.params.pageNum;
  try {
    const content = await axios.get(
      `${baseURL}${characterEndpoint}/?page=${pageNum}`
    );
    res.render("index.ejs", { data: content.data });
  } catch (error) {
    res.status(500).send("Unable to retrieve data please try again");
  }
});

app.listen(port, () => {
  console.log(`Server is running on localhost port: ${port}`);
});
