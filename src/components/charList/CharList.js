import { Component } from 'react';

import MarvelService from '../../services/MarvelService';

import './charList.scss';
import abyss from '../../resources/img/abyss.jpg';

class CharList extends Component {
    state = {
        chars: [],
    };
    
    componentDidMount = () => {
        this.updateChars();
    };

    marvelService = new MarvelService();

    onCharsLoaded = (chars) => {
        this.setState({
            chars,
        });
    }

    updateChars = () => {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharsLoaded);
    }

    render() {
        
        const element = this.state.chars.map(item => {
            const imgStyle = /image_not_available/.test(item.thumbnail) ? {'object-fit': 'fill'} : null;

            return (
                <li className="char__item">
                    <img src={item.thumbnail} alt={item.name} style={imgStyle} />
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return (
            <div className="char__list">
                <ul className="char__grid">
                    {element}
                </ul>
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    };
}

export default CharList;