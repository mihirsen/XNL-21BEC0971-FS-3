import { JwtService } from "@nestjs/jwt";
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    generateToken(user: any): Promise<{
        access_token: string;
    }>;
    validateToken(token: string): Promise<any>;
}
