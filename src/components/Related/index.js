import Inferno from 'inferno';
import Component from 'inferno-component';

import css from './index.styl';


class Related extends Component {
  render() {
    return (
      <div className={css.related}>
        <div className={css.title}>{this.props.data.title}</div>
        <div className="grid  full-width  items-stretch  justify-center  text-center">
        {
          this.props.data.items
            .filter(i => i.disable !== true)
            .map(item => {
              let uid = Math.random().toString(36).substr(2, 8);
    
              return (<RelatedItem
                key={uid}
                id={uid}
                title={item.title}
                image={item.image}
              />);
            })
        }
        </div>
      </div>
    );
  }
}


class RelatedItem extends Component {
  render() {
    return (
      <div className={css.item + '  col-6  col-sm-4  col-md-3  col-hd-2'}>
        <div className={css.itemIS}>
          <div className={css.itemTitle + '  grid  items-center  justify-center  text-center'}>
            <p className="col-auto">{this.props.title}</p>
          </div>
          <div className={css.itemThumb}>
            <img className={css.itemThumbIS} alt={this.props.title} src={this.props.image} />
          </div>
        </div>
      </div>
    );
  }
}


export default Related;

