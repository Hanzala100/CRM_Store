FROM node:20 AS build
WORKDIR /www/app
COPY package*.json ./
RUN npm i
COPY . /www/app
WORKDIR /www/app
RUN npm install -g @ionic/cli && ionic build -c=sand && npx cap sync && npx cap copy

FROM nginx:1.25
COPY --from=build /www/app/www /usr/share/nginx/html

RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location ~* \.(?:ico|css|js|gif|jpe?g|png|woff2?|eot|ttf|svg)$ { \
        expires 1d; \
        add_header Cache-Control "public"; \
    } \
    error_page 500 502 503 504 /50x.html; \
    location = /50x.html { \
        root /usr/share/nginx/html; \
    } \
}' > /etc/nginx/conf.d/default.conf

RUN apt-get update && apt-get install -y libcap2-bin \
    && touch /var/run/nginx.pid \
    && chown -R nginx:nginx /var/run/nginx.pid /usr/share/nginx/html /var/cache/nginx /var/log/nginx /etc/nginx/conf.d \
    && chmod -R 777 /var/cache/ /var/run /var/run/nginx.pid \
    && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

USER nginx
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]