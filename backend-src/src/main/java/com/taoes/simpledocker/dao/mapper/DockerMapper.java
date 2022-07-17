package com.taoes.simpledocker.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.taoes.simpledocker.dao.bean.DockerConfigDao;
import org.apache.ibatis.annotations.Mapper;

/**
 * Docker 的数据库映射对象
 *
 * @author 枕上江南 zhoutao825638@vip.qq.com
 * @date 2021/12/15 1:17 下午
 */
@Mapper
public interface DockerMapper extends BaseMapper<DockerConfigDao> {
}
