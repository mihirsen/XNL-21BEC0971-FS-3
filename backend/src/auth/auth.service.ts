import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(user: any) {
    const payload = {
      username: user.username,
      sub: user.userId,
      roles: user.roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload;
    } catch (error) {
      return null;
    }
  }
}
