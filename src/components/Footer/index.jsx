import React, { Component } from 'react';
import './index.scss';


export default class Footer extends Component {
  render() {
    // console.log(styles);
    return (
      <div className="Footer-container">
        ©<span>Copyright</span>
        <span>2019</span>
        <span>
          <b>pipk.top</b>
        </span>
      </div>
    );
  }
};
