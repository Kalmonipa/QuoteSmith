### Backend
The backend API reads in .txt files as the source of quotes and the associated authors. Feel free to add your own .txt files 
if self hosting or submit a PR to add/update pre-existing files.

There are 2 endpoints available for the API.
- `/categories` - lists the names of files available (i.e. rick_and_morty, spongebob, etc).
- `/quotes/[File Name]` - returns a random quote from the selected file

### Adding quotes
Files can be added in 2 ways by adding a file:
1. to `data/` in this repo and building a new docker image. These will be embedded in every image. Set the env 
var `EXCLUDE_DEFAULT_FILES=true` to disable the built in files.
2. to a local directory and mapping that dir to `/app/user-data` in the docker container. More customisable.

The quotes in the file must match this format:
`[Author] [Hyphen] [Quote]`
Refer to the `data/` folder for examples.

### Running locally
Pull the repo and run `npm start`.

To run it in dev mode, use `npm run dev` which will restart the app when file changes are detected.

### Testing
There are tests which can be run by running `npm test`. If you are submitting a PR that changes logic, please add tests 
for your code and make sure all tests pass.

### ToDo:
- [x] Provide option to exclude embedded files.
- [ ] Add lots more TV shows, movies, books