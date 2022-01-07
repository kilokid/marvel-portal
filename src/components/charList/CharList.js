import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

const CharList = (props) => {

    const [chars, setChars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);
    
    const marvelService = new MarvelService();

    useEffect(() => {
        document.addEventListener('scroll', onRequestByScroll);

        return () => {
            window.removeEventListener('scroll', onRequestByScroll);
        }
    }, []);

    useEffect(() => {
        if (offset < 219) {
            onReuqest();
        }
    }, [charEnded]);

    const onRequestByScroll = (event) => {
        if (offset < 219) return;
        if (newItemLoading) return;
    
        if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1) {
            onCharListLoading();
            onReuqest(offset);
        }
    }
    // window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1
    const onReuqest = (offset) => {
        onCharListLoading();
        marvelService
            .getAllCharacters(offset)
            .then(onCharsLoaded)
            .catch(onError);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }


    const onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        setChars(chars => [...chars, ...newChars]);
        setLoading(loading => false);
        setError(false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setLoading(loading => false);
        setError(true);
    };

    const itemRefs = useRef([]);

    const focusOnItem = (id) => {
        itemRefs.current.forEach((item) => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

    const renderItems = (arr) => {
        const items = arr.map((item, i) => {
            const imgStyle = /image_not_available/.test(item.thumbnail) ? {'objectFit': 'fill'} : null;

            return (
                <li 
                    className="char__item" 
                    key={item.id} 
                    onClick={() => {
                        props.onCharSelected(item.id);
                        focusOnItem(i);
                    }}
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    onKeyPress={(e) => {
                        e.preventDefault();
                        if (e.key === ' ' || e.key === "Enter") {
                            props.onCharSelected(item.id);
                            focusOnItem(i);
                        }
                    }}
                >
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {items}
            </ul>
        )
    }

    const items = renderItems(chars);

    const errorMessage = error ? <ErrorMessage /> : null;
    const spinner = loading ? <Spinner /> : null;
    const content = !(loading || error) ? items : null;


    return (
        <div className="char__list">
            {errorMessage}
            {spinner}
            {content}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': charEnded ? 'none' : 'block'}}
                onClick={() => onReuqest(offset)}
            >
                <div className="inner">load more</div>
            </button>
        </div>
    )
};

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;