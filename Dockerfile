FROM nginx:alpine
COPY index.html style.css script.js favicon.ico /usr/share/nginx/html/
COPY images/ /usr/share/nginx/html/images/
EXPOSE 80
