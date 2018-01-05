/**
 * Created by xinshen on 2017/12/27.
 */
import React from 'react';

class ImgFigure extends React.Component {
  render() {
    var styleObj = {};

    // 如果props
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

export default ImgFigure;
