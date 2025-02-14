## Quotes API

A customisable webserver that returns a random quote from the specified TV Show/Movie/Book/etc.

Running example is at https://quotesmith.net.

It uses .txt files as the source of quotes and the associated authors. Feel free to add your own .txt files if self hosting or 
submit a PR to add/update pre-existing files.

There are 2 endpoints available for the API.
- `/categories` - lists the names of media available (i.e. rickandmorty, spongebob, etc).
- `/quotes/[Show Name]` - returns a random quote from the show/movie/etc

### To add quotes
Add a .txt file into the `data` folder with the name of the TV Show/Movie/Book etc that it comes from. You will then be able to
send a request to the webserver with the path being the name of the file without the extension. 

The strings must match this format:
`[Author] [Hyphen] [Quote]`
Refer to the `data/` folder for examples.

### Self hosting
The recommended way to run is via a Docker container. Refer to [docker-compose.yml](docker-compose.yml) for an example compose file.

To add your own custom quotes, map a directory to the specified path in the container and add in the .txt files with the quotes. 
They must be in the format specified above.

## Running locally
Pull the repo and run `npm start`.

To run it in dev mode, use `npm run dev` which will restart the app when file changes are detected.

### Testing
There are tests which can be run by running `npm test`. If you are submitting a PR that changes logic, please add tests 
for your code and make sure all tests pass.