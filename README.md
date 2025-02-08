## Quotes API

A customisable webserver that returns a random quote from the specified TV Show/Movie/Book/etc.

It uses .txt files as the source of quotes and the associated authors. Feel free to add your own .txt files if self hosting or 
submit a PR to add/update pre-existing files.


### To add quotes
Add a .txt file into the `data` folder with the name of the TV Show/Movie/Book etc that it comes from. You will then be able to
send a request to the webserver with the path being the name of the file without the extension. 

For example:
I add a file named rickandmorty.txt with the following contents:
```
Rick Sanchez - "Wubba lubba dub dub!"
Morty Smith - "I'm not a bad guy! I'm just a kid, Rick!"
Rick Sanchez - "You’re right, Morty. The world is just a big, giant, chaotic mess of meaninglessness. But that’s what makes it beautiful!"
Rick Sanchez - "Sometimes science is more art than science, Morty. A lot of people don’t get that."
```

I can then get a random quote from the list by hitting the endpoint `/rickandmorty` and getting the following response:
```
{
    "author":"Morty Smith",
    "quote":"\"I'm not a bad guy! I'm just a kid, Rick!\""
}
```

## Running locally
Pull the repo and run `npm start`.

To run it in dev mode, use `npm run dev` which will restart the app when file changes are detected.

### Testing
There are unit tests which can be run by running `npm test`. If you are submitting a PR that changes logic, please add tests 
for your code and make sure all tests pass.