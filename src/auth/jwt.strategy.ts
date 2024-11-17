import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService,
        private readonly usersService: UserService) {
        super({
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: 'My-very-secret-passphrase'
        })
    }
    async validate(payload: any): Promise<any> {
        // const user = await this.usersService.findUserByUsername(payload.username);
        const user = await this.usersService.findUserById(payload.sub);

        if(!user) {
            throw new UnauthorizedException('Not found')
        }
        console.log(`JwtStrategy: ${JSON.stringify(user)}`);
        return {id: user.id, username: user.email}
    }
}