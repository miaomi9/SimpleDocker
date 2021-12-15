package com.taoes.simpledocker.dao.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.taoes.simpledocker.dao.bean.UserDao;
import org.apache.ibatis.annotations.Mapper;

/**
 * User的数据库映射对象
 *
 * @author eleme taozhou.tao@alibaba-inc.com
 * @date 2021/12/15 1:17 下午
 */
@Mapper
public interface UserMapper extends BaseMapper<UserDao> {
}
