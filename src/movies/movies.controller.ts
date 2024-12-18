import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Controller('movies') // 메인 URL
export class MoviesController {
    constructor(private readonly moviesService: MoviesService) {}
  @Get()
  getAll() :Movie[]{
    return this.moviesService.getAll();
  }

  @Get('search')
  search(@Query('year') searchingYear: string) {
    return `We are Searching for a movie title for ${searchingYear} after`
  }

  @Get("/:id") // id값을 입력했을때
  getOne(@Param('id') id: number): Movie { // 파라미터 값 가져오기
    console.log(typeof id);
    return this.moviesService.getOne(id);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviesService.create(movieData)
  }

  @Delete("/:id") 
  toDelete(@Param('id') id: number) {
    return this.moviesService.deleteOne(id);
  }

  @Put("/:id") // 모든 리소스를 업데이트 한다.
  allUpdate(@Param('id') movieId: string) {
    return `update to Item ${movieId}`
  }

  @Patch("/:id") // 리소스의 일부분만 업데이트
  patchUpdate(@Param('id') movieId: number, @Body() updateData: UpdateMovieDto) {
    return this.moviesService.update(movieId, updateData);
  }
} 
