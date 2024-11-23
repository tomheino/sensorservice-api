// import { PassportStrategy } from "@nestjs/passport";
// import { Strategy } from "passport-local";
// import { AuthService } from "./auth.service";
// import { User } from "src/user/entities/user.entity";
// import { Injectable, UnauthorizedException } from "@nestjs/common";

// @Injectable()
// export class LocalStrategy extends PassportStrategy(Strategy) {
//     constructor(private readonly authService: AuthService) {
//         super();
//     }
//     async validate(email: string, password: string): Promise<User> {
//         const user = this.authService.validateUser(email, password);
//         console.log(`validate ${JSON.stringify(email)}`);
//         if(!user) {
//             throw new UnauthorizedException("username or password error")
//         }
//         return user;
//     }
// }



// local.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }

    async validate(email: string, password: string): Promise<User> {
        const user = await this.authService.validateUser(email, password);
        console.log(`validate ${JSON.stringify(user)}`);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return user;
    }
}
