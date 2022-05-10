---
title: 在 macOS 下配置 OpenGL
date: 2019-10-01 22:08:22
updated: 2019-10-01 22:08:22
tags:
  - macOS
  - CLion
  - OpenGL
  - 笔记
categories:
  - 云游的小笔记
---

More info in [从零开始的 WebGL](https://yunyoujun.cn/note/webgl-from-zero).

<!-- more -->

## Resource

### 书籍

- [计算机图形学（第四版）](https://book.douban.com/subject/10543022/)
- [交互式计算机图形学 基于 OpenGL 的自顶向下方法(第六版)](https://book.douban.com/subject/10777165/)

### Online

- [LearnOpenGL CN](https://learnopengl-cn.github.io/)
- [opengl-tutorial](http://www.opengl-tutorial.org/cn/)

## Progress

- macOS
- [CLion: A cross-platform IDE for C and C++](https://www.jetbrains.com/clion/)
- [glad](https://glad.dav1d.de/)

```bash
brew install glfw
```

下载 [glad](https://glad.dav1d.de/)，macOS 据说只支持 3.3，所以我选择了 `gl: 3.3` 和 `Profile: Core`。
解压后将 `glad` 文件夹直接放入 `/usr/local/Cellar` 文件夹下。

可以直接用命令 copy 或者，cd 到文件夹下输入 `open .` 用 finder 打开文件夹。

CLion 新建 C++ 相关默认项目，修改默认项目中的 `CMakeLists.txt` 即可。

```makefile
# CMakeLists.txt
cmake_minimum_required(VERSION 3.14)
set(PROJECT_NAME "testOpenGL")
project(${PROJECT_NAME})

set(CMAKE_CXX_STANDARD 14)

set(GLFW_H /usr/local/Cellar/glfw/3.3/include/GLFW)
set(GLAD_H /usr/local/Cellar/glad/include)
set(KH_H /usr/local/Cellar/glad/include/KHR)
include_directories(${GLFW_H} ${GLAD_H} ${KH_H})

# 添加目标链接
set(GLFW_LINK /usr/local/Cellar/glfw/3.3/lib/libglfw.3.dylib)
link_libraries(${OPENGL} ${GLFW_LINK})

# 执行编译命令
set(SOURCE_FILES "src/glad.c" "main.cpp")
add_executable(${PROJECT_NAME} ${SOURCE_FILES})

if (APPLE)
    target_link_libraries(${PROJECT_NAME} "-framework OpenGL")
    target_link_libraries(${PROJECT_NAME} "-framework GLUT")
endif()
```

修改后记得右击 `CMakeLists.txr` 执行 `Reload CMake Project`。

粘贴下方代码，尝试画一个三角形看看吧。

```cpp
#include <glfw3.h>
#include <iostream>
using namespace std;

void key_callback(GLFWwindow* window, int key, int scancode, int action, int mode)
{
    //如果按下ESC，把windowShouldClose设置为True，外面的循环会关闭应用
    if(key==GLFW_KEY_ESCAPE && action == GLFW_PRESS)
        glfwSetWindowShouldClose(window, GL_TRUE);
    std::cout<<"ESC"<<mode;
}

int main(void)
{
    if(!glfwInit())
        return -1;
    //创建窗口以及上下文
    GLFWwindow* window = glfwCreateWindow(640, 480, "hello world", NULL, NULL);
    if(!window)
    {
        //创建失败会返回NULL
        glfwTerminate();
    }
    //建立当前窗口的上下文
    glfwMakeContextCurrent(window);

    glfwSetKeyCallback(window, key_callback); //注册回调函数
    //循环，直到用户关闭窗口
    while(!glfwWindowShouldClose(window))
    {
        /*******轮询事件*******/
        glfwPollEvents();

        /*******渲染*******/
        //选择清空的颜色RGBA
        glClearColor(0.2, 0.3, 0.3, 1);
        glClear(GL_COLOR_BUFFER_BIT);

        //开始画一个三角形
        glBegin(GL_TRIANGLES);
        glColor3f(1, 0, 0); //Red
        glVertex3f(0, 1, 1);

        glColor3f(0, 1, 0); //Green
        glVertex3f(-1, -1, 0);

        glColor3f(0, 0, 1); //Blue
        glVertex3f(1, -1, 0);
        //结束一个画图步骤
        glEnd();

        /******交换缓冲区，更新window上的内容******/
        glfwSwapBuffers(window);
    }
    glfwTerminate();
    return 0;
}
```

> ref: <https://www.cnblogs.com/shayue/p/Mac-CLion-xiaOpenGL-huan-jing-pei-zhi.html>
> 对原文多处进行了修改，CMakeLists.txt 内容缩减。使得步骤更为简单。
