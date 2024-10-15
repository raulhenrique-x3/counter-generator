const PORT = 8001;
import app from "./index";
import http from "http";
import connectToMongo from "./services/database";

const server = http.createServer(app);

connectToMongo()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database: ", error);
  });
