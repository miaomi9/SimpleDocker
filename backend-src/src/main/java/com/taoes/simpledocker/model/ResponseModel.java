package com.taoes.simpledocker.model;

import com.taoes.simpledocker.model.enums.ErrorCode;
import lombok.Data;

/**
 * TODO: please input file info
 *
 * @author 枕上江南 zhoutao825638@vip.qq.com
 * @date 2021/12/5 12:26 上午
 */
@Data
public class ResponseModel<T> {
    private String msg;

    private T data;

    /**
     *   错误代码
     * @apiNote 代码400表示登录异常，会被剔除出系统
     */
    private int code;


    public ResponseModel<T> setCode(int code) {
        this.code = code;
      return this;
    }

    public ResponseModel<T> setErrorCode(ErrorCode errorCode){
        this.code = errorCode.getCode();
        return this;
    }

    /**
     * 失败的数据
     *
     * @param data 数据
     * @param <T>  泛型
     * @return 失败的包裹数据
     */
    public static <T> ResponseModel<T> fail(String msg) {
        final ResponseModel<T> tResponseModel = new ResponseModel<>();
        return tResponseModel.setMsg(msg);
    }

    /**
     * 成功
     *
     * @param <T> 泛型对象
     * @return 包裹后的数据
     */
    public static <T> ResponseModel<T> ok(T t) {
        final ResponseModel<T> model = new ResponseModel<>();
        model.setData(t);
        model.setCode(0);
        return model;
    }
}
