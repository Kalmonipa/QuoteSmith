## Quotes API

A simple webpage and API that returns a random quote from the chosen file. This can be used for movie/TV quotes, books or
inspirational quotes from your favourite philosopher.


### Demo
A demo can be found at https://quotesmith.net 

<img src="QuoteSmith-main-page.png" alt="Main Page" width="500"/>

<img src="QuoteSmith-categories.png" alt="Categories" width="500"/>


along with the public API:
```
curl https://quotesmith.net/quotes/avatar_the_last_airbender
{
  "author": "Uncle Iroh",
  "quote": "It is important to draw wisdom from different places. If you take it from only one place, it becomes rigid and stale."
}
```

### Installation
The recommended way to run is via a Docker container. Refer to [docker-compose.yml](docker-compose.yml) for an example compose file.

To add your own custom quotes, map a directory to the specified path in the container and add in the .txt files with the quotes. 
They must be in the format specified above.

DockerHub link: https://hub.docker.com/r/kalmonipa/quotesmith

### Development
Refer to [CONTRIBUTING.md](CONTRIBUTING.md)
