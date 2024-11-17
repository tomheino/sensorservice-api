// import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

// @Controller()
// export class AppController {
//   constructor(private readonly appService: AppService) {}

//   @Get()
//   getHello(): string {
//     return this.appService.getHello();
//   }
// }

import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags()
export class AppController {
  constructor(private readonly appService: AppService,
  private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('login')
  @ApiOperation({summary: 'Log in'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string', format: 'password' },
      },
      required: ['username', 'password'],
    },
  })
  @UseGuards(AuthGuard('local'))
  async login(@Request() req) {
    console.log(`login ${req.body.username}`);
    const token = this.authService.login(req.user);
    return token;
    // return this.authService.validateUser(req.body.username, req.body.password);
  }
}
