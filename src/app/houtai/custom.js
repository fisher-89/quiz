import React, { PureComponent, Fragment } from 'react';
import axios from 'axios';
import { Table, Form, Modal, Input, Row, Col } from 'antd';


const FormItem = Form.Item;

class AA extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      custom: [],
      visible: false,
      initialvalue: undefined,
    };
  }

  componentWillMount() {
    const _this = this;
    axios.get('/api/sign')
      .then(function (response) {
        _this.setState({ custom: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleSubmit = () => {
    const _this = this;
    const { getFieldsValue } = this.props.form;
    const { custom } = this.state;
    const params = getFieldsValue();
    axios.patch(`/api/sign/${params.openid}`,
      params
    )
      .then(function (response) {
        const midkey = [];
        custom.forEach(item => {
          if (item.openid === response.data.openid) {
            midkey.push(response.data);
          } else {
            midkey.push(item);
          }
        })
        _this.setState({ visible: false, custom: midkey });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  handleModalVisible = () => {
    this.setState({ visible: false });
  }

  change = (RowData) => {
    const _this = this;
    _this.setState({ initialvalue: RowData, visible: true });
  }

  afterClose = () => {
    const _this = this;
    const { resetFields } = this.props.form;
    _this.setState({ initialvalue: undefined });
    resetFields();
  }
  render() {
    const { custom, visible, initialvalue } = this.state;
    const { getFieldDecorator } = this.props.form;
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      }, {
        title: '编号',
        dataIndex: 'number',
      }, {
        title: '头像',
        dataIndex: 'avatar',
        render: key => {
          return (
            <div>
              <img style={{ width: 40 }} src={key} alt={key} />
            </div>
          )
        },
      }, {
        title: '姓名',
        dataIndex: 'name',
      }, {
        title: '微信昵称',
        dataIndex: 'nickname',

      }, {
        title: '手机号',
        dataIndex: 'mobile',
      }, {
        title: '酒店名称',
        dataIndex: 'hotel_name',
      }, {
        title: '酒店房间号',
        dataIndex: 'hotel_num',
      }, {
        title: '身份证',
        dataIndex: 'idcard',
      }, {
        title: '操作',
        render: (RowData) => {
          return (
            <Fragment>
              <a onClick={() => this.change(RowData)} >修改</a>
            </Fragment>
          )

        }
      }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };
    const longFormItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const colSpan = { xs: 24, lg: 12 };
    const colS = { xs: 24, lg: 17 };

    return (
      <Fragment>
        <Table
          columns={columns}
          rowKey="id"
          dataSource={custom}
        />
        <Modal
          afterClose={this.afterClose}
          onCancel={this.handleModalVisible}
          title="修改信息"
          visible={visible}
          onOk={this.handleSubmit}
        >
          <Form >
            {getFieldDecorator('openid', {
              initialValue: { ...initialvalue }.openid || undefined,
            })(
              <Input type="hidden" />
            )}
            <Row >
              <Col {...colSpan}>
                <FormItem {...formItemLayout} label="姓名" >{{ ...initialvalue }.name}</FormItem>
              </Col>
              <Col {...colSpan}>
                <FormItem {...formItemLayout} label="手机号" >{{ ...initialvalue }.mobile}</FormItem>
              </Col>
            </Row>

            <Row >
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="编号" >
                  {getFieldDecorator('number', {
                    initialValue: { ...initialvalue }.number || undefined,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row >
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="酒店名称" >
                  {getFieldDecorator('hotel_name', {
                    initialValue: { ...initialvalue }.hotel_name || undefined,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row >
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="房间号" >
                  {getFieldDecorator('hotel_num', {
                    initialValue: { ...initialvalue }.hotel_num || undefined,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

            <Row >
              <Col {...colS}>
                <FormItem {...longFormItemLayout} label="身份证号" >
                  {getFieldDecorator('idcard', {
                    initialValue: { ...initialvalue }.idcard || undefined,
                  })(
                    <Input />
                  )}
                </FormItem>
              </Col>
            </Row>

          </Form>
        </Modal>
      </Fragment>
    )
  }
}

export default Form.create()(AA)