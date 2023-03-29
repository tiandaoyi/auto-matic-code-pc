FROM node:16-alpine as build
# 设置 maintai
LABEL maintainer "495060071@qq.com"
# 当前目录代码都拷贝到app下
COPY ./ /app

WORKDIR /app

# 安装npm
RUN npm config set registry https://registry.npmmirror.com/

# 安装pnpm
RUN npm install -g pnpm
RUN pnpm config set registry https://registry.npmmirror.com/
RUN pnpm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/

# 自动生成代码前端
RUN pnpm install
RUN pnpm build
# RUN mv dist auto-matic-code-pc


FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html/

# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# 将打包好的前端项目复制到容器中
# RUN MV dist auto-matic-code-pc
# COPY auto-matic-code-pc/ /usr/src/app/
# # 移动前端项目到宿主机中
# CMD mv /usr/src/app /nginx/html

# 暴露应用端口
# EXPOSE 80

# # 启动应用
# CMD ["npm", "run", "serve"]
