import Inferno, { linkEvent } from 'inferno';
import Component from 'inferno-component';

import css from './index.styl';


/*------------------------------*\
  #SERVICES-COMPONENT
\*------------------------------*/

class Services extends Component {
  /*
   *  props:
   *    data = { id, title, image, items } // services JSON
   *    openId = 'alu' // it's ok if it is invalid, just don't open anything
   *    animation = true
   *    scroll = 80px
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
    this.reorderItems(this.props.openId);
  }

  reorderItems(openId) {
    let vItems = [];

    this.props.data.items.forEach((item, n) => {
      let vItem = (
        <li id={item.id} className={css.item}>
          <ServiceItem
            key={item.id}
            data={item}
            opened={item.id === openId ? true : false}
            scroll={this.props.scroll}
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
      <div className={css.services}>
        { this.state.openedItemDOM !== undefined &&
          <ul>{ this.state.openedItemDOM }</ul> }

        <div className="grid  full-width  items-stretch">
          <div className="col-12  col-sm-6">
            <ul className={css.services_REST}>{ this.state.itemsDOM }</ul>
          </div>

          <div className={css.banner + '  col-6'}
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

    this._titleClass = css.item__header;

    this.state = {
      titleClass: this._titleClass
    };
  }

  componentDidMount() {
    if (this.props.opened){
      document.getElementById(this.props.data.id + '_content').style.display = 'flex';

      window.location.href = '#' + this.props.data.id;
      window.scrollBy(0, this.props.scroll);
    }

    this.setState({ titleClass: this._titleClass + ' ' + (this.props.opened ?
      css.item__header_OPEN : css.item__header_CLOSE) });
  }

  render() {
    let item = this.props.data;
    let itemImage = idx => {
      return item.images[idx] === undefined ? '' :
        '<div class="text-center"><img class="' + css.itemImage +
        (idx > 0 ? (' ' + css.itemImage_ADD) : '') + '" src="' +
        item.images[idx] + '" alt="' + item.title + '"></div>';
    }

    return (
      <div className="full-width">
        <div className={this.state.titleClass} onClick={ linkEvent(this, this.props.onClick) }>
          {this.props.opened ? this.props.data.titleOpen : this.props.data.title}
        </div>

        <div id={this.props.data.id + '_content'} className={css.item__content}>
          <div className={css.item__contentAA}>
            <div className={css.item__contentIS} dangerouslySetInnerHTML={ {__html:
              itemImage(0) + itemImage(1) +
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

