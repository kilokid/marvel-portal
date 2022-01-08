import { useState } from "react";

import ComicsList from "../comicsList/ComicsList";
import AppBanner from "../appBanner/AppBanner";

const ComicsPage = () => {
    const [selectedComics, setComics] = useState(null);

    const onComicsSelected = (id) => {
        setComics(id);
    }

    return (
        <>
            <AppBanner />
            <ComicsList onComicsSelected={onComicsSelected} />
        </>
    );
}

export default ComicsPage;