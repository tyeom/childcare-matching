# ERD (Entity Relationship Diagram)
<img width="1798" height="892" alt="image" src="https://github.com/user-attachments/assets/f7cf04de-633e-40af-b441-845f14528c9d" />

# Flow Chart
<img width="1710" height="1439" alt="image" src="https://github.com/user-attachments/assets/9655ca1f-86bd-4e51-9bca-75ffb0b87e46" />

***

# 실행 방법
- 요구 사항
  Docker와 Docker Compose가 설치되어 있어야 합니다.

```
# 도커 빌드 및 컨테이너 실행
$ docker-compose up --build

# CHILDCARE-MATCHING-SERVICE 디버그 실행
$ pnpm start:debug
```

> **서비스 접근 : http://localhost:3002** <br/><br/>
>
> **swagger : http://localhost:3002/swagger** <br/><br/>
>
> **서비스가 처음 실행될 때 다음 테스트 계정이 자동으로 생성됩니다:<br/>**
> 
> **1. 기본 관리자 계정**<br/>
>  - id : admin<br/>
>  - password : 1234<br/><br/>

> **2. 기본 학부모1 계정**<br/>
> - id : parents1<br/>
> - password : 1234<br/><br/>
>
> **3. 기본 학부모2 계정**<br/>
> - id : parents2<br/>
> - password : 1234<br/><br/>
>
> **4. 기본 선생님1 계정**<br/>
> - id : teacher1<br/>
> - password : 1234<br/><br/>
>
> **5. 기본 선생님2 계정**<br/>
> - id : teacher2<br/>
> - password : 1234<br/><br/>

# 주요 APIs 정보
#### 기본 데이터 생성
```
curl -X 'POST' \
  '/admin/seed' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NzYzOTkxOSwiZXhwIjoxNzU4NTAzOTE5fQ.PlUPL15f2zvIv5RSIXed16ep5Y34FnrSLGfG4e4y9jc' \
  -d ''
```

#### 추천 선생님 조회
```
curl -X 'GET' \
  '/job-post/{공고id}/matching-teachers' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer {Bearer 토큰}'
```

#### 공고 등록 [학부모]
```
curl -X 'POST' \
  '/job-post' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer {Bearer 토큰}'
  -H 'Content-Type: application/json' \
  -d '{
  "title": "string",
  "jobDetails": "string",
  "studentLevel": "미취학",
  "sessionDuration": 240,
  "preferredDays": [
    "월",
    "수",
    "금"
  ],
  "preferredStartTime": "14:00",
  "requirements": "string",
  "addresses": [
    {
      "detailedAddress": "string",
      "district": "string",
      "cityProvince": "string",
      "addressType": "PRIMARY"
    }
  ]
}'
```

#### 선호 지역 등록 [선생님]
```
curl -X 'POST' \
  '/teachers-preference' \
  -H 'accept: */*' \
  -H 'Authorization: Bearer {Bearer 토큰}'
  -H 'Content-Type: application/json' \
  -d '{
  "address": "string",
  "preferredRegions": [
    "서울",
    "수원"
  ],
  "preferredSubwayStations": [
    "강남역",
    "수원역"
  ],
  "alertPreferenceType": "ADDRESS",
  "maxDistance": 5
}'
```


<br/><br/><br/>

***

<br/><br/><br/>


<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

