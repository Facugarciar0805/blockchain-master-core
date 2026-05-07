import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from "../authentication/auth.guard";
import type { Request } from 'express'

@Controller('transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService, private authGuard: AuthGuard) {}

    @Post()
    @UseGuards(AuthGuard)
    create(@Req() req: Request, @Body() createTransactionDto: CreateTransactionDto) {
        const sender: string = req.user.sub;
        return this.transactionsService.create(sender, createTransactionDto);
    }

    @Get()
    @UseGuards(AuthGuard)
    findAll(@Req() req: Request) {
        const user: string = req.user.sub;
        return this.transactionsService.findAll(user);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    findOne(@Req() req: Request, @Param('id') transactionId: string) {
        const user: string = req.user.sub;
        return this.transactionsService.findOne(user, transactionId);
    }

    @Get('/user/:id')
    @UseGuards(AuthGuard)
    findWithUser(@Req() req: Request, @Param('id') userTwo: string) {
        const userOne: string = req.user.sub;
        return this.transactionsService.findWithUser(userOne, userTwo);
    }
}
