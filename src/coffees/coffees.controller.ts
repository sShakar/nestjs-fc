import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('coffees')
export class CoffeesController {
  @Get()
  findAll() {
    return 'This action return all the coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Return flavors ${id}`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }
}
