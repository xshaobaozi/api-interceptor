## Chrome插件
### 功能
-   匹配URL 和 Method 修改请求返回值
-   管理接口模块 【完成情况】 【是否启用Mock】
-   模块化接口管理

### 修改请求
-   修改Response 【完成】
-   根据Method修改请求 【完成】
-   匹配URL 【完成】
-   正则匹配URL 【待续】
-   修改返回Code 【待续】

### 接口模块管理
-   接口分组 【完成】
-   区分已完成 【完成】
-   区分启用Mock 【完成】
-   全局是否开启Mock 【完成】
-   模块是否开启 【完成】
-   区分数据来源 【Kelper|插件数据】【完成】
### 例子

Kelper = Swagger格式
Kepler数据只关注这部分数据
```json
    {
        "info": {
            "title": "测试",
        },
        "paths": {
            "/login": {
                "post": {
                    "summary": "登录"
                }
            }
        }
    }
```

插件格式
```json
    {
    "schema": [
        {
        "id": "ae01e7d0-aa17-1844-8e29-5159b6d2022c",
        "disabled": true,
        "name": "222",
        "schema": {
            "info": {
            "title": "模块名字"
            },
            "paths": [
            {
                "id": "9006e086-2d28-5d85-a057-9c0931d0164a",
                "uri": "/uri",
                "desc": "1",
                "methods": "post",
                "response": {},
                "finish": false,
                "disabled": true
            }
            ]
        },
        }
    ]
    }
```
