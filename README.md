# Library-Management-Full-Stack-Mobile-Application

For backend side, to run: 

```bash
cd library-backend
mvn clean spring-boot:run
```

For frontend side, please run:
```bash
cd frontend
npm install
expo start
```

```bash
application.properties to configure database, email is gitignored, please set yours as below:

server.port=

spring.mail.host=
spring.mail.port=
spring.mail.username=
spring.mail.password=
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

host.url=


JWT.expiration=
JWT.secretKey=
secret.key.admin=


#Max file size.Default is 1MB
spring.servlet.multipart.max-file-size=

#Max request size.Default is 10MB
spring.servlet.multipart.max-request-size=
spring.servlet.multipart.enabled=true

limit.borrow=
spring.datasource.url=
spring.datasource.username=
spring.datasource.password=
spring.jpa.hibernate.ddl-auto=
spring.jpa.properties.hibernate.dialect=
```

Video:

https://drive.google.com/file/d/1-QiUQBJTTL10QorjBieuDPpEKMhlvdcy/view?usp=share_link


