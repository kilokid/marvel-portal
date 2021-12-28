class MarvelService {
    #apiBase = 'https://gateway.marvel.com:443/v1/public/';
    #apiKey = 'apikey=5f4e79f3aaf80400e01eef32adfeb29f';

    getResource = async (url) => {
        let res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    }

    getAllCharacters = async () => {
        const res = await this.getResource(`${this.#apiBase}characters?limit=9&offset=210&${this.#apiKey}`);
        return res.data.results.map(this.#transformCharacter);
    }

    getCharacter = async (id) => {
        const res = await this.getResource(`${this.#apiBase}characters/${id}?${this.#apiKey}`);
        return this.#transformCharacter(res.data.results[0]);
    }

    #transformCharacter = (char) => {
        return {
            name: char.name,
            description: !char.description ? 'There is no information about this character' : char.description.length > 210 ? `${char.description.slice(0, 210)}...` : char.description,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            homepage: char.urls[0].url,
            wiki: char.urls[1].url
        }
    }
}

export default MarvelService;