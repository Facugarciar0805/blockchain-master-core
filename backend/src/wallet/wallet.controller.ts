import {Controller, Get, Post, UseGuards, Req} from "@nestjs/common";
import {WalletService} from "./wallet.service";
import {AuthGuard} from "../authentication/auth.guard";
import type {Request} from "express";

@Controller("wallets")
export class WalletController {
    constructor(private readonly walletService: WalletService) {}

    @Get("me")
    @UseGuards(AuthGuard)
    getMyWallet(@Req() req: Request) {
        const user = req.user.sub;
        return this.walletService.getMyWallet(user);
    }

    @Post()
    @UseGuards(AuthGuard)
    createWallet(@Req() req: Request) {
        const user = req.user.sub;
        console.log(user);
        return this.walletService.createWallet(user);
    }
}
