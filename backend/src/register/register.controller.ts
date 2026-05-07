import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterDto } from './dto/register.dto';
import { UpdateRegisterDto } from './dto/update.register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() createRegisterDto: RegisterDto) {
    return this.registerService.create(createRegisterDto);
  }

  @Get()
  findAll() {
    return this.registerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.registerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateRegisterDto: UpdateRegisterDto,
  ) {
    return this.registerService.update(id, updateRegisterDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseIntPipe()) id: number) {
    return this.registerService.remove(id);
  }
}
