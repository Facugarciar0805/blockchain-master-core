import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards, Req} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import {AuthGuard} from "../authentication/auth.guard";
import type { Request } from 'express'

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService, private authGuard: AuthGuard) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: Request, @Body() createTransactionDto: CreateTransactionDto) {
    const sender: number = req.user.sub;
    return this.transactionsService.create(sender, createTransactionDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: Request) {
      const user: number = req.user.sub;
      return this.transactionsService.findAll(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req: Request, @Param('id', ParseIntPipe) transactionId: number) {
      const user: number = req.user.sub;
      return this.transactionsService.findOne(user, transactionId);
  }

  @Get('/user/:id')
  @UseGuards(AuthGuard)
  findWithUser(@Req() req: Request,@Param('id', ParseIntPipe) userTwo: number) {
      const userOne: number = req.user.sub;
      return this.transactionsService.findWithUser(userOne, userTwo);
  }
}
