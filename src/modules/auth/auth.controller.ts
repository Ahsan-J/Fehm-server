import { Controller, Post, Body, UsePipes, ValidationPipe, ForbiddenException, BadRequestException, Headers, Get, Query, Inject } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UsersService } from '../user/user.service';
import { ForgotPasswordBody, HeaderParams, LoginBody, RegisterBody, ResetPasswordBody, ActivateUserBody } from './auth.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from '../../helper-modules/mail/mail.service';
import { UserStatus } from '../user/user.enum';
import { CommonService } from 'src/helper-modules/common/common.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private mailService: MailService,
    @Inject(CommonService)
    private commonService: CommonService
  ) { }

  @Post('login')
  @UsePipes(ValidationPipe)
  async loginUser(@Body() body: LoginBody, @Headers() headers: HeaderParams): Promise<User & { access_token: string, token_expiry: number }> {

    const userInfo: User = await this.userService.getUserByEmail(body.email);

    if (this.commonService.checkValue(userInfo.status, UserStatus.InActive)) {
      throw new ForbiddenException("Your account is not active at the moment. Check your email and follow steps to activate")
    }

    if (this.commonService.checkValue(userInfo.status, UserStatus.Blocked)) {
      throw new ForbiddenException("Your Account has been temporarily blocked");
    }

    const loginPassword: string = this.userService.getPasswordHash(body.password);

    if (userInfo.password !== loginPassword) {
      throw new BadRequestException("Password mismatch")
    }


    delete userInfo.password;

    const access_token = await this.authService.generateToken(userInfo, headers);

    return {
      ...userInfo,
      access_token,
      token_expiry: 86400
    }
  }

  @Post('register')
  @UsePipes(ValidationPipe)
  async registerUser(@Body() body: RegisterBody, @Headers() headers: HeaderParams): Promise<User & { access_token: string, token_expiry: number }> {

    const userInfo = await this.userService.createUser(body);

    const markup = await this.authService.generateActivationMarkup(userInfo)
    
    await this.mailService.sendEmailTemplate(userInfo.email, "Activate Your Account", markup)

    const access_token = await this.authService.generateToken(userInfo, headers);

    return {
      ...userInfo,
      access_token,
      token_expiry: 86400
    };
  }

  @Post('reset-password')
  @UsePipes(ValidationPipe) // Step after request has been made against user forgot code
  async resetPassword(@Body() body: ResetPasswordBody): Promise<string> {
    const userInfo = await this.userService.getUserByEmail(body.email);

    await this.authService.validateResetCode(userInfo, body.code);
    
    if(body.confirm_password !== body.password) {
      throw new BadRequestException("User Password mismatch")
    }
    
    if(body.password === userInfo.password) {
      throw new BadRequestException("User new password is matching the old password")
    }

    return "Password Reset Successful. Try logging with new Password";
  }

  @Post('forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() body: ForgotPasswordBody): Promise<string> {
    const userInfo = await this.userService.getUserByEmail(body.email);

    const markup = await this.authService.generateResetMarkup(userInfo)
    
    await this.mailService.sendEmailTemplate(userInfo.email, "Reset Your Account", markup)

    return "The code has been sent to your email address. Kindly verify the code for further processing"
  }

  @Get('activate')
  @UsePipes(ValidationPipe)
  async activateUser(@Query() query: ActivateUserBody): Promise<User> {
    const user = await this.userService.getUser(query.id);
    await this.authService.validateActivationCode(user, query.code)
    user.status = this.commonService.setValue(user.status, UserStatus.Active);
    return user;
  }

  @Get('activation-template')
  async getActivationTemplate(@Query('id') id): Promise<string> {
    const user = await this.userService.getUser(id)
    const code = await this.authService.generateActivationCode(user);
    return this.authService.generateActivationMarkup(user, code);
  }

  @Get('reset-template')
  async getResetTemplate(@Query('id') id): Promise<string> {
    const user = await this.userService.getUser(id)
    const code = await this.authService.generateResetCode(user);
    return this.authService.generateResetMarkup(user, code);
  }

}
