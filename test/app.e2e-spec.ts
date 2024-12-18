import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  //beforeEach(async () => { // 테스트 함수들이 실행될 때마다 불러진다.
  beforeAll(async () => { // 테스트 함수를 실행할 때 한번 호출된다.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // main.ts에서 했던 설정들을 테스트 환경에도 동일하게 가져와서 적용해야 한다.
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('/movies', () => {
    it('/movies (GET) main Page 호출 테스트', () => {
      return request(app.getHttpServer()).get('/movies').expect(200).expect([]);
    });

    it('/movies (POST) Item 생성 테스트', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Tennet',
          year: 2024,
          genres: ['action'],
        })
        .expect(201);
    });

    it('/movies (POST) Item 생성 오류 테스트', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Tennet',
          year: 2024,
          genres: ['action'],
          other: 'thing'
        })
        .expect(400);
    });

    it('/movies (DELETE) Item 삭제 테스트', () => {
      return request(app.getHttpServer()).delete('/movies').expect(404);
    });
  });

  describe('/movies/:id 정상적으로 호출되는지 테스트', () => {
    it('GET 200', () => {
      return request(app.getHttpServer())
        .get('/movies/1') // ValidationPipe의 transform 설정이 테스트 환경에는 적용되지 않아서 id가 string으로 바뀌는 현상이 발생한다.
        .expect(200);
    });
    it('GET 404 잘못된 값을 가져올 때 테스트', () => {
      return request(app.getHttpServer())
        .get('/movies/999')
        .expect(404);
    })

    it('PATCH 200 수정 테스트', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({ title: "Tennet Update" })
        .expect(200);
    });

    it('DELETE 삭제 테스트', () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200);
    }); 
    //it.todo('Method'); // TEST의 TODO LIST 설정이다.
  });
});
