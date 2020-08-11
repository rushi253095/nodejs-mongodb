import * as http from 'http';
import * as dotenv from "dotenv";

dotenv.config();

import app from './App';

http.createServer(app).listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});
