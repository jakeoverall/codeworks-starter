import http from 'http'
import testArea from './server'

try {
  let server = http.createServer(testArea.expressApp)
  testArea.io.attach(server)
  server.listen(5000, () => {
    console.log("Listening on port 5000");
  })
} catch (err) {
  console.log(err);
}