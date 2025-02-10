## Quotes API

A customisable webserver that returns a random quote from the specified TV Show/Movie/Book/etc.

It uses .txt files as the source of quotes and the associated authors. Feel free to add your own .txt files if self hosting or 
submit a PR to add/update pre-existing files.

There are 2 endpoints available for the API.
- `/list` - lists the names of media available (i.e. rickandmorty, spongebob, etc).
- `/quotes/[Show Name]` - returns a random quote from the show/movie/etc

### To add quotes
Add a .txt file into the `data` folder with the name of the TV Show/Movie/Book etc that it comes from. You will then be able to
send a request to the webserver with the path being the name of the file without the extension. 

The strings must match this format:
`[Author] [Hyphen] [Quote]`

For example:
I add a file named rickandmorty.txt with the following contents. 
```
Rick Sanchez - "Wubba lubba dub dub!"
Morty Smith - "I'm not a bad guy! I'm just a kid, Rick!"
Rick Sanchez - "You’re right, Morty. The world is just a big, giant, chaotic mess of meaninglessness. But that’s what makes it beautiful!"
Rick Sanchez - "Sometimes science is more art than science, Morty. A lot of people don’t get that."
```

I can then get a random quote from the list by hitting the endpoint `/quotes/rickandmorty` and getting the following response:
```
{
    "author":"Morty Smith",
    "quote":"\"I'm not a bad guy! I'm just a kid, Rick!\""
}
```

### Self hosting
The recommended way to run is via a Docker container. Refer to [docker-compose.yml] for an example compose file.

To add your own custom quotes, map a directory to the specified path in the container and add in the .txt files with the quotes. 
They must be in the format specified above.

## Running locally
Pull the repo and run `npm start`.

To run it in dev mode, use `npm run dev` which will restart the app when file changes are detected.

### Testing
There are unit tests which can be run by running `npm test`. If you are submitting a PR that changes logic, please add tests 
for your code and make sure all tests pass.