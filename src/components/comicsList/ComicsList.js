import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useMarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './comicsList.scss';

const ComicsList = () => {
    const [comics, setComics] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicEnded, setComicEnded] = useState(false);

    const {loading, error, getAllComics} = useMarvelService();

    useEffect(() => {
        onReuqest(offset, true);
    }, []);

    const onReuqest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);

        getAllComics(offset)
            .then(onCharsLoaded);
    }

    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 8) {
            ended = true;
        }

        setComics(chars => [...chars, ...newChars]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicEnded(charEnded => ended);
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            return (
                <li 
                    key={i}
                    className="comics__item"
                >
                    <Link to={`/comics/${item.id}`}>
                        <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                        <div className="comics__item-name">{item.title}</div>
                        <div className="comics__item-price">{item.price}</div>
                    </Link>
                </li>
            );
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        );
    }

    const items = renderItems(comics);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicEnded ? 'none' : 'block'}}
                onClick={() => onReuqest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;