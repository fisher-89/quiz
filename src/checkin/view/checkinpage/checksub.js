import React from 'react';
import axios from 'axios';
import { Toast } from 'antd-mobile';
import './checksub.less';
import submit from 'public/checkin/submit.png';
import smline from 'public/checkin/smline.png';
import formimg from 'public/checkin/form.png';
import black from 'public/checkin/black.png';

export default class CheckSub extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      acountname: null,
      password: null,
      number: null,
      originalHeight: null,
      formW: null,
      fontSize: null,
    }
  }

  componentDidMount() {
    document.addEventListener('keypress', this.handelEnter);
    //动态获取高度
    const originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
    const that = this;
    window.onresize = function (e) {
      that.handleResize(originalHeight);
    };
  }

  componentWillUnmount() {
    document.removeEventListener('keypress', this.handelEnter);
    window.onresize = null;
  }

  handleBlur = () => {
    setTimeout(function () {
      const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
      window.scrollTo(0, Math.max(scrollHeight - 1, 0));
    }, 100);
  }

  handlegetName = (e) => {
    e.preventDefault();
    this.state.acountname = e.target.value;
  }

  handlePassword = (e) => {
    e.preventDefault();
    this.state.password = e.target.value;
  }
  handleNumber = (e) => {
    e.preventDefault();
    this.state.number = e.target.value;
  }
  handleMove = (e) => {
    e.preventDefault();
    return;
  }

  handleGetOenId = () => {
    let query = window.location.search;
    if(query.indexOf('?') !== -1){
      query = query.substr(1);
    }
    const reg = /([^=&\s]+)[=\s]*([^&\s]*)/g;
    const obj = {};
    while(reg.exec(query)){
      obj[RegExp.$1] = RegExp.$2;
    }
    const openId = obj.openid;

    // const currentUrl = window.location.href;
    // let openId = null;
    // try {
    //   openId = currentUrl.split('?')['1'].split('=')['1']
    // } catch (err) {
    //   console.log(err);
    // }

    return openId;
  }

  handleResize = (originalHeight) => {
    const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
    if (resizeHeight - 0 < originalHeight - 0) {
      document.removeEventListener('touchmove', this.props.Move)
      this.setState({
        originalHeight: originalHeight
      })
    } else {
      document.addEventListener("touchmove", this.props.Move);
      this.setState({
        originalHeight: null
      })
    }
  }
  handelEnter = (e) => {
    if (e.keyCode == 13) { //如果按的是enter键 13是enter 
      e.preventDefault(); //禁止默认事件（默认是换行）
      this.handleSubmit(e);
    }
    return;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    const { acountname, password, number } = this.state;
    if (!(acountname && password && number)) {
      Toast.fail('所填内容不能为空', 1);
      return;
    }
    if (!(/^1\d{10}$/.test(password))) {
      Toast.fail('手机号格式不正确', 1);
      return;
    }
    const data = {
      'name': acountname,
      'mobile': password,
      'number': number,
      'openid': this.handleGetOenId(),
    }
    axios.post('/api/sign', data).then(res => {
      console.log(res);
      if (res.status == '201') {
        localStorage.setItem('check_name', res.data['name']);
        Toast.success('签到成功', 1);
        this.props.Showlist();
        //提交成功跳转至，节目单页面
      }
    }).catch(err => {
      //错误返回码
      const { response } = err;
      console.log(response);
      if (response.status == '422' && response.data.errors['openid']) {
        axios.get(`/api/sign/${this.handleGetOenId()}`)
          .then(res => {
            localStorage.setItem('check_name', res.data['name']);
            Toast.success('签到成功', 1);
            this.props.Showlist();
          })
          .catch(err => {
            Toast.fail('提交表单出错', 1);
          })
        return;
      } else if (response.status == '422') {
        const key = Object.keys(response.data.errors)[0];
        const error = response.data.errors[key];
        Toast.fail(error[0], 1);
      }else if(response.status === 400){

        Toast.fail(response.data.message,1);
      }
    })
  }

  render() {
    const { wordAnimate, pageTranslate, pageHeight, pageWidth } = this.props;
    const { formW } = this.state;
    const firstanimate = wordAnimate ? { paddingRight: '0', transitionDelay: '1s' } : null;
    const secondanimate = wordAnimate ? { paddingRight: '0', transitionDelay: '1.7s' } : null;
    const threeanimate = wordAnimate ? { paddingRight: '0', transitionDelay: '2.4s' } : null;
    const formnimate = wordAnimate ? { opacity: 1, transitionDelay: '2.5s' } : null;
    const submitanimate = wordAnimate ? { opacity: 1, transitionDelay: '2.5s' } : null;
    const fontSize = pageWidth * .04;
    const pageStyle = pageWidth ? {
      height: `${pageHeight}px`,
      width: `${pageWidth}px`,
      marginLeft: `-${pageWidth / 2}px`,
      marginTop: `-${pageHeight / 2}px`
    } : null;
    return (
      <div className='submitPage'
           style={{ transition: 'top 1s ease', top: pageTranslate ? `${50 * pageTranslate}%` : null, ...pageStyle }}>
        <div className='lookback' style={{ width: formW }}>
          <div className='container'>
            <div className='first' style={firstanimate}></div>
            <img src={black} />
          </div>
          <div className='container'>
            <div className='second' style={secondanimate}></div>
            <img src={black} />
          </div>
          <div className='container'>
            <div className='three' style={threeanimate}></div>
            <img src={black} />
          </div>
        </div>
        <div className='form' style={{ width: formW, fontSize: `${fontSize}px`, ...formnimate }}>
          <div className='formcontainer'>
            <img className='imgCLient' src={formimg}></img>
            <input style={{ fontSize: `${fontSize}px` }} className='formname' type='text' onBlur={this.handleBlur}
                   onChange={this.handlegetName} />
            <input style={{ fontSize: `${fontSize}px` }} className='formphone' type='number' onBlur={this.handleBlur}
                   onChange={this.handlePassword} />
            <input style={{ fontSize: `${fontSize}px` }} className='formnumber' type='text' onBlur={this.handleBlur}
                   onChange={this.handleNumber} />
          </div>
        </div>
        <div className='submit' style={submitanimate}>
          <div className='submit-container'>
            <img className='submitbtn' src={submit} onClick={this.handleSubmit}></img>
            <div className='smline'>
              <img src={smline}></img>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
  