# Step 1: Node.js 공식 이미지를 Parent로 이용
FROM node:20

# Install tzdata and set the timezone
ENV TZ=Asia/Seoul
RUN apt-get update && apt-get install -y tzdata && \
    ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && \
    dpkg-reconfigure --frontend noninteractive tzdata


# Step 2: Container 내부에서 이용할 Directory 지정
WORKDIR /usr/src/app

# Step 3: Container로 package.json과 package-lock.json 복사
COPY package.json ./
COPY yarn.lock ./

# Step 4: Container에서 npm install 실행
RUN yarn install

# Step 5: Container로 소스코드 이동
COPY . .

# Step 6: Container의 3000포트 오픈
EXPOSE 10010

# Step 7: 앱 실행을 위한 커멘드 전달
CMD ["npm", "run", "deploy"]