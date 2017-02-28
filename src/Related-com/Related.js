import Inferno from 'inferno';
import Component from 'inferno-component';

import './Related.css';

//import * as host from './hostlib.js';


class Related extends Component {
  render() {
    return (
      <div className="related">
        <div className="related-title  /  text-center">{this.props.data.title}</div>
        <div className="grid  full-width  items-stretch  justify-center  text-center">
        {

          this.props.data.items.map(function(item) {
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
      <div className="related__item  /  col-6  col-sm-4  col-md-3  col-hd-2">
        <div className="related__item-is">
          <div className="related__item-title  /  grid  items-center  justify-center  text-center">
            <p className="col-auto">{this.props.title}</p>
          </div>
          <div className="related__item-thumb">
            <img className="related__item-thumb-is" alt={this.props.title} src={this.props.image} />
          </div>
        </div>
      </div>
    );
  }
}


export default Related;

