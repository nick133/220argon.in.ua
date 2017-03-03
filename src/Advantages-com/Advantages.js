import Inferno from 'inferno';
import Component from 'inferno-component';

import './Advantages.css';


class Advantages extends Component {
  render() {
    return (
      <div class="advantages  /  grid  full-width  items-stretch  text-center">
      {

        this.props.data.items.map((item, n) => {
          let uid = Math.random().toString(36).substr(2, 8);
          
          let parityClassIcon = '';
          let parityClassItem = '';

          if ((n % 2) === 0) {
            // Left column
            parityClassIcon = 'col-2  col-md-3  col-sm-order-2';
            parityClassItem = 'col-10  col-md-9  col-sm-order-1  text-left  sm-text-right';
          } else {
            // Right column
            parityClassIcon = 'col-2  col-md-3';
            parityClassItem = 'col-10  col-md-9  text-left';
          }

          return (
            <div className="col-12  col-sm-6" key={uid}>
              <div className="grid  full-width  items-start">

                <div className={parityClassIcon}>
                  <div className="advntg-ico">
                    <img src={item.image} className="advntg-ico__svg" alt={item.title} />
                  </div>
                </div>

                <div className={parityClassItem}>
                  <h3 className="advntg-item-title">{item.title}</h3>
                  <p className="advntg-item-desc">{item.description}</p>
                </div>

              </div>
            </div>
          );
        })

      }
      </div>
    );
  }
}


export default Advantages;

