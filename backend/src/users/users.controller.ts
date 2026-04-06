import { Controller, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('ADMIN', 'MODERATOR')
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('stats')
  @Roles('ADMIN', 'MODERATOR')
  async getStats() {
    return this.usersService.getStats();
  }

  @Patch(':id/role/:role')
  @Roles('ADMIN')
  async updateRole(@Param('id') id: string, @Param('role') role: string, @Req() req: any) {
    return this.usersService.updateRole(id, role, req.user.role);
  }

  @Delete(':id/ban')
  @Roles('ADMIN')
  async banUser(@Param('id') id: string, @Req() req: any) {
    return this.usersService.banUser(id, req.user.role);
  }
}
