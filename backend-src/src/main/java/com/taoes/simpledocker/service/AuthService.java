package com.taoes.simpledocker.service;

/**
 * 授权服务
 *
 * @author 枕上江南 zhoutao925638@vip.qq.com
 * @date 2021/12/15 1:23 下午
 */
public interface AuthService {
    /**
     * 登录接口
     *
     * @param username 账户民
     * @param password 密码
     * @return 生成的token
     */
    String login(String username, String password);
}
