import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "./auth.service";
import { User } from "src/user/entities/user.entity";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super();
    }
    async validate(username: string, password: string): Promise<User> {
        const user = this.authService.validateUser(username, password);
        console.log(`validate ${JSON.stringify(username)}`);
        if(!user) {
            throw new UnauthorizedException("username or password error")
        }
        return user;
    }
}