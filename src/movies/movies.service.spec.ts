import { Test, TestingModule } from "@nestjs/testing";
import { MoviesService } from "./movies.service"
import { NotFoundException } from "@nestjs/common";

describe('MoviesService', () => {
    let service: MoviesService;

    beforeEach(async () => { // 테스트가 시작하기 전 실행
        const module: TestingModule = await Test.createTestingModule({
            providers: [MoviesService]
        }).compile();

        service = module.get<MoviesService>(MoviesService);
        /* 아이템 생성을 미리 등록해 놓는 방법도 있다.
        service.create({
            title: "Tennet",
            genres: ["Test"],
            year: 2024
        });
        */
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // it("should be 4", () => {
    //     expect(2+2).toEqual(4); // 주어진 값.결과값 비교
    // })

    describe("전체 목록을 가져옵니다. getAll()", () => {
        it("배열을 반환합니다.", () => {
            const result = service.getAll();
            expect(result).toBeInstanceOf(Array); // 인스턴스가 배열인지 확인
        })
    })

    describe("getOne", () => { // 테스트 코드에 대한 설명 정의
        it("아이템 하나 가져오기", () => {
            service.create({ // 하나의 아이템을 가져오는 테스트 전 아이템 생성
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            })
            const result = service.getOne(1); // id가 1인 값 호출
            expect(result).toBeDefined(); // 정의가 되었는지 테스트
            expect(result.id).toEqual(1); // 결과값의 id가 1인지 테스트
            expect(result.title).toEqual("Tennet"); // 결과값의 제목이 1인지 테스트
            expect(result.genres).toEqual(["Test"]);
            expect(result.year).toEqual(2024);
        })
        it("404 Error 페이지 반환 확인", () => {
            try {
                service.getOne(999);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual("Movie with Id 999 not found.");
            }
        })
    })

    describe("아이템 삭제 테스트", () => {
        it("아이템 생성 후 삭제 테스트", () => {
            // 강의를 보기전 나의 테스트
            service.create({
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });
            const deleteBefore = service.getAll(); // 아이템 생성 후의 전체를 호출한다.
            expect(deleteBefore).toHaveLength(1); // 호출 된 아이템의 길이가 1인지 체크한다.
            const deleteTest = service.deleteOne(1); // ID 1번 아이템을 삭제한다.
            const deleteAfter = service.getAll(); // 삭제 이후의 아이템을 호출한다.
            expect(deleteAfter).toHaveLength(0); // 아이템의 길이가 0인지 체크한다.

            expect(deleteBefore).not.toEqual(deleteAfter); // 두 길이가 같지 않은 지 체크한다.
            expect(deleteAfter.length).toBeLessThan(deleteBefore.length); // 위의 방법보다 더 나은 방법인 것 같다.

            // 노마드 코더 방식
            service.create({ // 아이템 생성
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });
            const beforeDelete = service.getAll().length; // 전체 아이템의 길이를 가져온다. => 1
            service.deleteOne(1); // 1번 아이템을 삭제한다.
            const afterDelete = service.getAll().length; // 삭제 이후의 전체 아이템의 길이를 가져온다. => 0
            expect(afterDelete).toBeLessThan(beforeDelete); // 삭제 이후의 길이가 삭제 이전의 길이보다 작은지 체크
        });

        it("404 Error 페이지 반환 확인", () => {
            try {
                service.deleteOne(999);
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual("Movie with Id 999 not found.");
            }
        });
    });

    describe("아이템 생성 테스트", () => {
        it("아이템 생성 후 체크", () => {
            service.create({
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });

            const getItemOne = service.getOne(1);
            expect(getItemOne.title).toEqual("Tennet");
        });

        it("노마드 코더 방식 생성 테스트", () => {
            const beforeCreate = service.getAll().length; // 아이템 생성 전 전체 아이템의 길이를 가져온다.
            service.create({
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });
            const afterCreate = service.getAll().length; // 아이템 생성 후 전체 아이템의 길이를 가져온다.
            console.log("beforeCreate.length: " + beforeCreate); // console.log로도 출력할 수 있다.
            console.log("afterCreate.length: " + afterCreate);
            expect(afterCreate).toBeGreaterThan(beforeCreate); // 생성 이후의 길이가 생성 이전의 길이보다 더 큰지 체크한다.
        });
    });

    describe("아이템 업데이트", () => {
        it("아이템 생성 후 업데이트 테스트", () => {
            service.create({
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });
            expect(service.getOne(1)).toHaveProperty("title", "Tennet"); // 해당 key: value가 존재하는지 체크한다.

            service.update(1, { "title": "Tennet Update" });
            expect(service.getOne(1)).toHaveProperty("title", "Tennet Update");
        });
    });

    describe("노마드코더 업데이트 테스트", () => {
        it("영화 업데이트", () => {
            service.create({
                title: "Tennet",
                genres: ["Test"],
                year: 2024
            });
            service.update(1, { title: "updated Test" });
            const movie = service.getOne(1);
            expect(movie.title).toEqual("updated Test");
        });

        it("404 Error 페이지 반환 확인", () => {
            try {
                service.update(999, {});
            } catch (error) {
                expect(error).toBeInstanceOf(NotFoundException);
                expect(error.message).toEqual("Movie with Id 999 not found.");
            }
        });
    })
});