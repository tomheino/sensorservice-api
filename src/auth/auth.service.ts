import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UserService,
        private readonly jwtService: JwtService) {}

    async validateUser(username: string, password:string): Promise<User> {
        const user = await this.usersService.findUserByUsername(username);

        if(user && user.password === password) {
            // Removes the password from the return value. Same as below but more efficient
            // let { password, ...result } = user;

            const result = {
                id: user.id,
                email: user.email,
                password: "",
                firstName: user.firstName,
                lastName: user.lastName
            }
            return result;
        }
        return null;
    }
    async login(user: User) {
        const payload = {username: user.email, sub: user.id};
        return { accessToken: this.jwtService.sign(payload) };
    }
}
