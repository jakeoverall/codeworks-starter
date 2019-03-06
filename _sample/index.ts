import http from 'http'
import p from './server'

try {
  let server = http.createServer(p.expressApp)
  p.io.attach(server)
  server.listen(5000, () => {
    console.log("Listening on port 5000");
  })
} catch (err) {
  console.log(err);
}