import React, {Component} from "react";


import {Button, Checkbox, Drawer, Form, Input, message, Modal, Skeleton, Space, Switch, Table, Tag} from "antd";
import {BuildOutlined, CloudDownloadOutlined, SyncOutlined} from '@ant-design/icons';


import {list, remove} from "../../api/ImageApi";
import formatDate from '../../utils/DateTime'
import bytesToSize from '../../utils/ByteSize'
import ImagePullModal from '../../components/image/pull'

import './index.css'
import RunNewContainerStep from "../../components/image/run";


import ImageDetail from "../../components/image/detail";

/**
 * 主页布局文件
 */
class ImagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            imageId: null,
            imageList: [],
            filterKey: '',
            pullImageModalStatus: false,
            runNewContainerModalStatus: false,
            showImageDetailModal: false,
            imageIdOfRun: {},
            showMoreOperatorModal: false,// 显示更多操作Draw
            currentImageId: null // 当前操作的镜像ID
        }

    }


    componentDidMount() {
        this.refreshList()
    }

    refreshList = () => {
        this.setState({tableLoading: true})
        list().then(resp => {
            let imageList = resp.data
            this.setState({imageList, tableLoading: false})
        }).catch(() => {
            message.info("获取镜像列表请求失败，请稍后重试")
            this.setState({imageList: [], tableLoading: false})
        })
    }


    // 更新镜像拉去Modal
    updateImagePullStatus(status) {
        this.setState({pullImageModalStatus: status})
    }


    // 更新运行镜像Modal
    showRunModal(image) {
        this.setState({runNewContainerModalStatus: true, imageIdOfRun: image.Id})
    }

    // 显示详情页
    async showImageDetail(image) {
        this.setState({showImageDetailModal: true, imageId: image.Id})
    }

    // 移除镜像
    showRemoveModal = () => {
        this.setState({showRemoveImageModal: true, removeImageId: this.state.currentImageId})
    }


    removeImage = (values) => {
        remove(this.state.currentImageId, values)
            .then(() => {
                message.info("容器删除成功");
                this.refreshList()
            })
            .catch(e => {
                message.error("容器删除失败:" + e)
            });
        this.setState({showRemoveImageModal: false})
    }

    // 显示更多操作
    showMoreModal(image) {
        this.setState({moreModalVisitable: true, currentImageId: image.Id})
    }

    render() {
        const
            columns = [
                {
                    title: '容器ID',
                    dataIndex: 'Id',
                    key: 'name',
                    render: id => <span>{!!id && id.substring(0, 30).replaceAll("sha256:", '')}</span>,
                    ellipsis: true,
                    width: 150,
                },
                {
                    title: '镜像标签',
                    dataIndex: 'RepoTags',
                    render: RepoTags => {
                        return RepoTags.map(t => {
                            let color = 'blue'
                            if (t.indexOf('none') !== -1) {
                                color = 'red'
                            } else if (t.indexOf('latest') !== -1) {
                                color = 'green'
                            }
                            return <Tag key={t} color={color}>{t}</Tag>
                        })
                    },
                    key: 'Size',
                    width: 700,
                },
                {
                    title: '镜像大小',
                    dataIndex: 'Size',
                    render: size => <span>{bytesToSize(size)}</span>,
                    key: 'Size',
                    width: 120,
                },
                {
                    title: '创建时间',
                    dataIndex: 'Created',
                    key: 'Created',
                    width: 120,
                    render: time => <span>{formatDate(time * 1000)}</span>,
                },
                {
                    title: '操作',
                    dataIndex: 'address',
                    key: 'address 4',
                    fixed: 'right',
                    width: 180,
                    render: (text, image) => {
                        return (
                            <Space>
                                <Button size="small" type="link" onClick={() => this.showRunModal(image)}>运行</Button>
                                <Button size="small" type="link" onClick={() => this.showImageDetail(image)}>详情</Button>
                                <Button size="small" type="link" onClick={() => this.showMoreModal(image)}>更多</Button>
                            </Space>
                        )
                    }

                },
            ];

        let imageListOfFilter = this.state.imageList.filter(image => {
            if (!this.state.filterKey) {
                return true
            }
            return image.Id.indexOf(this.state.filterKey) !== -1 || (JSON.stringify(image.RepoTags).indexOf(this.state.filterKey) !== -1);

        });

        return (
            <div>
                <div style={{
                    margin: 10
                }
                }>
                    <Space>
                        <Button type="primary"
                                icon={<SyncOutlined/>}
                                onClick={() => this.refreshList()}>刷新</Button>
                        <Button type="primary"
                                icon={<CloudDownloadOutlined/>}
                                onClick={() => this.updateImagePullStatus(true)}>拉取</Button>
                        <Button type="primary" icon={<BuildOutlined/>}>构建</Button>


                        <Input placeholder="请输入过滤词" style={{width: 400}} allowClear
                               onChange={(e) => this.setState({filterKey: e.target.value})}/>
                        <Checkbox checked>包含无效镜像</Checkbox>
                    </Space>
                </div>

                <Skeleton loading={this.state.tableLoading} active>
                    <Table
                        bordered
                        size="small"
                        pagination="bottomCenter"
                        columns={columns}
                        dataSource={imageListOfFilter}/>
                </Skeleton>
                <Modal
                    visible={this.state.pullImageModalStatus}
                    width={800}
                    style={{overflow: 'auto'}}
                    okText="关闭"
                    cancelText="导出"
                    destroyOnClose={true}
                    onCancel={() => this.setState({pullImageModalStatus: false})}
                    footer={[]}>
                    <ImagePullModal/>
                </Modal>

                <Modal
                    visible={this.state.runNewContainerModalStatus}
                    width={800}
                    title="创建新的容器"
                    footer={null}
                    destroyOnClose={true}
                    onCancel={() => this.setState({runNewContainerModalStatus: false})}>
                    <RunNewContainerStep imageId={this.state.imageIdOfRun}/>
                </Modal>


                {/*移除镜像对话框*/}
                <Modal
                    visible={this.state.showRemoveImageModal}
                    title="移除镜像"
                    destroyOnClose={true}
                    footer={null}
                    bodyStyle={{"padding": 20}}
                    onCancel={() => this.setState({showRemoveImageModal: false})}>
                    <p>确定移除该镜像吗?</p>
                    <p>Ps: 如果移除镜像失败，请勾选强制移除,强制移除会删除使用该镜像的容器</p>
                    <Form name="basic" onFinish={this.removeImage} autoComplete="off">
                        <Form.Item label="强制移除" name="force" wrapperCol={{offset: 1}}>
                            <Switch defaultChecked={false}/>
                        </Form.Item>

                        <Form.Item wrapperCol={{offset: 0}}>
                            <Button type="danger" htmlType="submit">移除</Button>
                        </Form.Item>
                    </Form>
                </Modal>

                {/*侧边栏 显示镜像详情信息*/}
                <Drawer title="镜像详情"
                        destroyOnClose={true}
                        okText="好"
                        width={720}
                        onClose={() => this.setState({showImageDetailModal: false})}
                        visible={this.state.showImageDetailModal}>
                    <ImageDetail imageId={this.state.imageId}/>
                </Drawer>

                {/*    侧边栏 显示更多操作 */}
                <Drawer
                    title="更多操作"
                    destroyOnClose={true}
                    okText="好"
                    width={320}
                    visible={this.state.moreModalVisitable}
                    onClose={() => this.setState({moreModalVisitable: false})}>

                    <Space>
                        <Button block type="primary" onClick={() => alert('开发中')}>更新标签</Button>
                        <Button block type="primary" onClick={() => alert('开发中')}>导出镜像</Button>
                        <Button block type="danger" onClick={this.showRemoveModal}>删除镜像</Button>
                    </Space>
                </Drawer>
            </div>
        )

    }
}

export default ImagePage;
