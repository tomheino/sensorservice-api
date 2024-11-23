
// import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
// import { AppService } from './app.service';
// import { AuthService } from './auth/auth.service';
// import { AuthGuard } from '@nestjs/passport';
// import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

// @Controller()
// @ApiTags()
// export class AppController {
//   constructor(private readonly appService: AppService,
//   private readonly authService: AuthService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
//   @Post('login')
//   @ApiOperation({summary: 'Log in'})
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         email: { type: 'string' },
//         password: { type: 'string', format: 'password' },
//       },
//       required: ['email', 'password'],
//     },
//   })
//   @UseGuards(AuthGuard('local'))
//   async login(@Request() req) {
//     console.log(`login ${req.body.username}`);
//     const token = this.authService.login(req.user);
//     return token;
//     // return this.authService.validateUser(req.body.username, req.body.password);
//   }
// }


// app.controller.ts

import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags()
export class AppController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('login')
    @ApiOperation({ summary: 'Log in' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string' },
                password: { type: 'string', format: 'password' },
            },
            required: ['email', 'password'],
        },
    })
    @UseGuards(AuthGuard('local'))
    async login(@Request() req) {
        console.log(`login ${req.body.email}`);
        const response = await this.authService.login(req.user);

        // Palautetaan token ja käyttäjän ID
        return response;
    }
}

