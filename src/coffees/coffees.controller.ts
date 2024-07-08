import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body) {
    return `This action updates ${id} coffee with ${body}`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `this action removes ${id}`;
  }
}
