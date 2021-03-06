import React, { Suspense } from 'react';
import LookOver from './lookover';
import CradList from '../checkinpage/cardlist';

export default class LookoverPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageTranslate: null,
      wordAnimate: null,
    }
  }

  componentDidMount() {
    document.addEventListener("touchmove", this.handleMove);
  }

  componentWillUnmount() {
    document.removeEventListener("touchmove", this.handleMove);
  }

  handleShowlist = () => {
    this.setState({
      pageTranslate: -1,
      wordAnimate: true,
    })
  }

  render() {
    const { wordAnimate } = this.state;
    const { screenHeight } = this.props;
    const bgstyle = wordAnimate ? { transition: 'background-position-y 1s ease', backgroundPositionY: 'bottom' } : null;
    return (<div className="root-bg" style={{ ...bgstyle, height: `${screenHeight}px` }}>
      <LookOver {...this.props} {...this.state} Showlist={this.handleShowlist} />
      <CradList {...this.state} {...this.props} />
    </div>)
  }
}
  