import { Controller, Post, Body, UsePipes, ValidationPipe, ForbiddenException, BadRequestException, ClassSerializerInterceptor, UseInterceptors, Headers, NotFoundException, BadGatewayException, Get, Query } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UsersService } from '../user/user.service';
import { ForgotPasswordBody, HeaderParams, LoginBody, RegisterBody, ResetPasswordBody, TokenParams, ActivateUserBody } from './auth.dto';
import { AuthService } from './auth.service';
import { UAParser } from 'ua-parser-js'
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) { }

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() body: LoginBody, @Headers() headers: HeaderParams): Promise<User & { access_token: string, token_expiry: number }> {

    const userInfo: User = await this.userService.getUserByEmail(body.email);

    if (!userInfo) {
      throw new BadRequestException("User Not found")
    }

    const loginPassword: string = this.userService.getPasswordHash(body.password);

    if (userInfo.password !== loginPassword) {
      throw new BadRequestException("Password mismatch")
    }

    const parser = new UAParser();
    parser.setUA(headers['user-agent'])

    const tokenInfo: TokenParams = {
      device_type: parser.getDevice().type,
      browser_name: parser.getBrowser().name,
      email: userInfo.email,
      user_id: userInfo.id,
      api_key: headers['x-api-key'],
    }

    delete userInfo.password;

    return {
      ...userInfo,
      access_token: await this.authService.generateToken(tokenInfo),
      token_expiry: 86400
    }
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() body: RegisterBody, @Headers() headers: HeaderParams): Promise<User & { access_token: string, token_expiry: number }> {

    if (body.password !== body.confirm_password) {
      throw new ForbiddenException("Password mismatch")
    }

    let userInfo: User = await this.userService.getUserByEmail(body.email);

    if (userInfo) {
      throw new ForbiddenException("User Already registered with email")
    }

    const parser = new UAParser();
    parser.setUA(headers['user-agent'])

    userInfo = await this.userService.createUser(body);

    const tokenInfo: TokenParams = {
      device_type: parser.getDevice().type,
      browser_name: parser.getBrowser().name,
      email: userInfo.email,
      user_id: userInfo.id,
      api_key: headers['x-api-key'],
    }

    delete userInfo.password;

    this.authService.sendActivationCode(userInfo)

    return {
      ...userInfo,
      access_token: await this.authService.generateToken(tokenInfo),
      token_expiry: 86400
    };
  }

  @Post('reset-password')
  @UsePipes(ValidationPipe) // Step after request has been made against user forgot code
  async resetPassword(@Body() body: ResetPasswordBody, @Headers() headers: HeaderParams): Promise<User & { access_token: string, token_expiry: number }> {
    const [tokenId, appId, userId, userEmail] = await this.authService.getDataFromResetCode(body.code);
    const userInfo = await this.userService.getUserByEmail(body.email);

    if (!userInfo) throw new NotFoundException(`User with email ${body.email} not found`);
    if (userInfo.id != userId || userInfo.email != userEmail) throw new BadGatewayException(`Code failed to verify ${body.email} information`)

    const parser = new UAParser();
    parser.setUA(headers['user-agent'])

    const tokenInfo: TokenParams = {
      id: tokenId,
      device_type: parser.getDevice().type,
      browser_name: parser.getBrowser().name,
      email: userInfo.email,
      user_id: userInfo.id,
      api_key: headers['x-api-key'],
    }

    delete userInfo.password;

    return {
      ...userInfo,
      access_token: await this.authService.generateToken(tokenInfo),
      token_expiry: 86400
    };
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() body: ForgotPasswordBody): Promise<string> {
    const userInfo = await this.userService.getUserByEmail(body.email);

    if (!userInfo) throw new NotFoundException(`User with email ${body.email} not found`);

    const resetCode = await this.authService.generateResetCode(userInfo);
    // Send this code to user's email address for secure Authentication

    return resetCode || "The code has been sent to your email address. Kindly verify the code for further processing"
  }

  @Get('activate')
  @UsePipes(ValidationPipe)
  activateUser(@Query() query: ActivateUserBody) {
    // Logic here to activate against code
    console.log(query.id, query.code)
  }

  @Get('activation-template')
  async getActivationTemplate(@Query('id') id): Promise<string> {
    const user = await this.userService.getUser(id)
    const code = await this.authService.generateActivationCode(user);
    return this.authService.generateActivationMarkup(user, code);
  }

}
