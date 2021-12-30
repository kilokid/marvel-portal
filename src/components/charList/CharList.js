import { Component } from 'react';
import PropTypes from 'prop-types';

import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';

class CharList extends Component {
    static defaultProps = {
        onCharSelected: () => {console.log('An error has occurred')}
    }

    marvelService = new MarvelService();

    state = {
        chars: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false,
    };
    
    componentDidMount = () => {
        this.onReuqest();
    };

    onReuqest = (offset) => {
        this.onCharListLoading();
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharsLoaded)
            .catch(this.onError);
    }

    onCharListLoading = () => {
        this.setState({newItemLoading: true});
    }


    onCharsLoaded = (newChars) => {
        let ended = false;
        if (newChars.length < 9) {
            ended = true;
        }

        this.setState(({offset, chars}) => ({
            chars: [...chars, ...newChars],
            loading: false,
            error: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended,
        }));
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        });
    };

    renderItems = (arr) => {
        const items = arr.map(item => {
            const imgStyle = /image_not_available/.test(item.thumbnail) ? {'objectFit': 'fill'} : null;

            return (
                <li 
                    className="char__item" 
                    key={item.id} 
                    onClick={() => this.props.onCharSelected(item.id)}
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

    render() {
        const {chars, loading, error, offset, newItemLoading, charEnded} = this.state;

        const items = this.renderItems(chars);

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
                    onClick={() => this.onReuqest(offset)}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    };
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;