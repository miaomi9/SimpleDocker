import {Component} from "react";
import {Button, Checkbox, Divider, Input, Space, Table, Tag} from "antd";
import {getImageList} from "../api/ImageApi";
import formateDate from '../utils/DateTime'
import bytesToSize from '../utils/ByteSize'

/**
 * 主页布局文件
 */
class ImagePage extends Component {

    constructor(props) {
        super(props);
        this.state = {imageList: []}

    }


    componentDidMount() {
        getImageList().then(resp => {
            let imageList = resp.data
            console.log(imageList)
            this.setState({imageList})
        })
    }


    render() {
        const columns = [
            {
                title: '容器ID',
                dataIndex: 'Id',
                key: 'name',
                render: id => <span>{id.substring(0, 30)}</span>,
                ellipsis: true,
                width: 150,
            },
            {
                title: '镜像标签',
                dataIndex: 'RepoTags',
                render: RepoTags => {
                    let item = RepoTags.map(t => {
                        let color = 'blue'
                        if (t.indexOf('none') !== -1) {
                            color = 'red'
                        } else if (t.indexOf('latest') !== -1) {
                            color = 'green'
                        }
                        return <Tag key={t} color={color}>{t}</Tag>
                    })
                    return item
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
                render: time => <span>{formateDate(time * 1000)}</span>,
            },
            {
                title: '操作',
                dataIndex: 'address',
                key: 'address 4',
                fixed: 'right',
                width: 180,
                render: () =>
                    <div>
                        <Button size="small" type="primary">运行</Button>
                        <Divider type="vertical"/>
                        <Button size="small" type="danger">删除</Button>
                        <Divider type="vertical"/>
                        <Button size="small">更多</Button>
                    </div>

            },
        ];

        return (
            <div>
                <div style={{margin: 10}}>
                    <Input placeholder="请输入过滤词" style={{width: 400}}/>
                    <Checkbox checked style={{marginLeft:10}}>包含无效镜像</Checkbox>
                </div>
                <Table
                    bordered
                    pagination="bottomCenter"
                    columns={columns}
                    dataSource={this.state.imageList} size="small"/>
            </div>
        )

    }
}

export default ImagePage;