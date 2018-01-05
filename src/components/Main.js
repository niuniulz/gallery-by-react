require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import {findDOMNode} from 'react-dom';

// 获取图片相关的数据
let imageDatas = require('../data/imageData.json');

// 利用自执行函数， 将图片名信息转换成图片URL路径信息
imageDatas = (function genImageUrl(imageDatasArr) {
  for (let i = 0; i < imageDatasArr.length; i++) {
    let singleImageData = imageDatasArr[i];

    singleImageData.imageUrl = require(`../images/${singleImageData.fileName}`);

    imageDatasArr[i] = singleImageData
  }
  return imageDatasArr;
})(imageDatas);

class ImgFigure extends React.Component {
  /**
   *
   * @returns {XML}
   */
  handleClick = (e) => {

    this.props.inverse();

    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var styleObj = {};

    // 如果 props 属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    // 如果图片的旋转角度有值且不为0， 添加旋转角度
    if (this.props.arrange.rotate) {
      let _self = this;
      ['-moz-', '-ms-', '-webkit-', ''].forEach(value => {
        styleObj[value + 'transform'] = `rotate(${_self.props.arrange.rotate}deg)`;
      })
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageUrl} alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class AppComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      imagesArrangeArr: [
        /*{
         pos: {
         left: '0',
         top: '0'
         },
         rotate: 0,
         isInverse: false
         }*/
      ]
    },
      this.Constant = {
        centerPos: {
          left: 0,
          top: 0
        },
        hPosRange: {
          leftSecX: [0, 0],
          rightSecX: [0, 0],
          y: [0, 0]
        },
        vPosRange: {
          x: [0, 0],
          topY: [0, 0]
        }
      }
  }

  // 获取区间内的一个随机值
  getRangeRandom = (low, high) => {
    return Math.ceil(Math.random() * (high - low) + low);
  }

  // 获取 0 - 30 度之间的任意正副值
  get30DegRandom = () => {
    return (Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30);
  }

  /**
   * 翻转图片
   * @params index 输入当前被执行inverse操作的图片对应的图片信息的index值
   * @return {function} 这是一个闭包函数
   */
  inverse = (index) => {
    return function () {
      var imgsArrangeArr = this.state.imagesArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imagesArrangeArr: imgsArrangeArr
      })
    }.bind(this);
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中排布那个图片
   */
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imagesArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2),
      topImgSpliceIndex = 0,

      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    // 首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    //居中的 centerIndex 不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上册的图片
    if (imgsArrangeTopArr) {
      imgsArrangeTopArr.forEach(value => {
        value = {
          pos: {
            top: this.getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
            left: this.getRangeRandom(vPosRangeX[0], vPosRangeX[1])
          },
          rotate: this.get30DegRandom()
        };
      })
    }

    //布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      // 前半部分左边， 右半部分右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: this.getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: this.getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: this.get30DegRandom()
      }
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imagesArrangeArr: imgsArrangeArr
    })

  }

  componentDidMount() {
    // 拿到舞台的大小
    var stageDOM = this.refs.stage,
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imgFigure的大小
    var imgFigureDOM = findDOMNode(this.refs.imgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach(function (value, index) {
      if (!this.state.imagesArrangeArr[index]) {
        this.state.imagesArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false
        }
      }
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index}
                                 arrange={this.state.imagesArrangeArr[index]} inverse={this.inverse(index)}/>)
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {};

export default AppComponent;
