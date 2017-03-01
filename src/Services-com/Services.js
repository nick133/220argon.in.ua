import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';

import './Services.css';

import * as Defs from '../hostdefs/hostdefs.js';


let Com = {
  idPrefix: 'svarka-',
  headerId: 'main-header',

  // STYLUS css colors
  initColor:  Defs.defs.init_color,
  hoverColor: Defs.defs.hover_color,
};


/*------------------------------*\
  #SERVICES-COMPONENT
\*------------------------------*/

class Services extends Component {
  /*
   *  props:
   *    data = { id, title, image, items } // services JSON
   *    openId = 'alu'
   *    animation = true
   */
  constructor(props) {
    super(props);

    this.openedId = this.props.openId;

    this.state = {
      openedItemDOM: undefined,
      itemsDOM: [],
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.scrollHeight = -18 - window.getComputedStyle(
      document.getElementsByClassName(Com.headerId)[0]).height.replace('px', '');

    this.reorderItems(this.props.openId);
  }

  reorderItems(openId) {
    let vItems = [];

    this.props.data.items.forEach(function(item, n) {
      let vItem = (
        <li id={item.id} className="services-item">
          <ServiceItem
            key={item.id}
            data={item}
            opened={item.id === openId ? true : false}
            onClick={this.handleClick}
          />
        </li>
      );

      if (item.id === openId)
        this.setState({ openedItemDOM: vItem });
      else
        vItems.push(vItem);
    }, this);

    this.setState({ itemsDOM: vItems });

    if (openId === undefined)
      this.setState({ openedItemDOM: undefined });
    else {
      window.location.href = '#' + openId;
      window.scrollBy(0, this.scrollHeight);
    }
  }

  handleClick(instance, event) {
    /**
     *  Item is opened, close it!
     */ 
    if (instance.props.data.id === this.openedId) {
      this.openedId = '';

      this.reorderItems();
  
    /**
     *  Item is closed, open it!
     */ 
    } else {
      this.openedId = instance.props.data.id;

      this.reorderItems(this.openedId);
    }
  }

  render() {
    return(
      <div className="full-width">
        { this.state.openedItemDOM !== undefined &&
          <ul className="services--open">{ this.state.openedItemDOM }</ul> }

        <div className="grid  full-width  items-stretch">
          <div className="col-12  col-sm-6">
            <ul className="services--rest">{ this.state.itemsDOM }</ul>
          </div>

          <div className="services-banner  /  col-6"
          style={ 'background-image: url(' + this.props.data.banner + ')' } />
        </div>
      </div>
    );
  }
}


/*------------------------------*\
  #SERVICE-ITEM-COMPONENT
\*------------------------------*/

class ServiceItem extends Component {
  constructor(props) {
    super(props);

    this._titleClass = 'services-item__header';

    this.state = {
      titleClass: this._titleClass
    };
  }

  componentDidMount() {
    if (this.props.opened)
      document.getElementById(this.props.data.id + '_content').style.display = 'flex';

    this.setState({ titleClass: this._titleClass + (this.props.opened ?
      ' services-item__header--open' : ' services-item__header--close') });
  }

  render() {
    return (
      <div className="full-width">
        <div className={this.state.titleClass} onClick={ linkEvent(this, this.props.onClick) }>
          {this.props.data.title}
        </div>

        <div id={this.props.data.id + '_content'} className="services-item__content">
          <div className="services-item__content-a">
            <div className="services-item__content-is" dangerouslySetInnerHTML={ {__html:
              '<div class="text-center"><img class="services-item__image" src="' +
              this.props.data.image + '" alt="' + this.props.data.title + '"></div>' +
              this.props.data.header.join('') +
              this.props.data.content.join('')
            } } />
          </div>
        </div>

      </div>
    );
  }
}


export default Services;

