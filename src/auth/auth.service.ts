import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

// @Injectable()
// export class AuthService {
//     constructor(private readonly usersService: UserService,
//         private readonly jwtService: JwtService) {}

//     async validateUser(email: string, password:string): Promise<User> {
//         const user = await this.usersService.findUserByUsername(email);

//         if(user && user.password === password) {
//             // Removes the password from the return value. Same as below but more efficient
//             // let { password, ...result } = user;

//             const result = {
//                 id: user.id,
//                 email: user.email,
//                 password: "",
//                 firstName: user.firstName,
//                 lastName: user.lastName
//             }
//             return result;
//         }
//         return null;
//     }
//     async login(user: User) {
//         const payload = {email: user.email, sub: user.id};
//         return { accessToken: this.jwtService.sign(payload) };
//     }
// }



// auth.service.ts

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UserService,
        private readonly jwtService: JwtService
    ) {}

    // Tarkista käyttäjän kirjautumistiedot
    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.usersService.findUserByUsername(email);

        if (user && user.password === password) {
            const result = {
                id: user.id,
                email: user.email,
                password: "",  // Emme palauta salasanaa
                firstName: user.firstName,
                lastName: user.lastName
            };
            return result;
        }
        return null;
    }

    // Kirjautuminen ja tokenin luominen
    async login(user: User) {
        const payload = { email: user.email, sub: user.id };
        const accessToken = this.jwtService.sign(payload);

        // Palautetaan tokenin lisäksi myös käyttäjän ID
        return {
            accessToken,
            userId: user.id  // Käyttäjän ID lisätään vastausobjektiin
        };
    }
}
