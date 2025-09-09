import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ActiveUser } from '@/common/decorators/active-user.decorator';
import { ActiveUserData } from '@/common/interfaces/active-user-data.interface';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { PaginationQueryDto } from '@/common/dtos/pagination-query.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { ReportDto } from './dto/report-response.dto';
import { Report } from './entities/report.entity';

@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    async createUserReport(
        @Body() createReportDto: CreateReportDto,
        @ActiveUser() user: ActiveUserData
    ) {
        return this.reportsService.createUserReport(createReportDto, user.id);
    }

    @Get()
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async getReports(
        @Query() query: PaginationQueryDto,
        @Query('status') status?: string,
        @Query('type') type?: string
    ) {
        return this.reportsService.findAllPaginated(query, status, type);
    }


    @Get(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @ApiOkResponse({ type: ReportDto })
    async getReportDetail(@Param('id') id: string): Promise<ReportDto> {
        return this.reportsService.getReportDetail(id);
    }


    @Get(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    findOne(@Param('id') id: string) {
        return this.reportsService.findOne(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
        return this.reportsService.update(id, updateReportDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    remove(@Param('id') id: string) {
        return this.reportsService.remove(id);
    }

    @Patch(':id/approve')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async approveReport(@Param('id') id: string) {
        return this.reportsService.approveReport(id);
    }

    @Patch(':id/reject')
    @Roles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    async rejectReport(@Param('id') id: string): Promise<Report> {
        return this.reportsService.rejectReport(id);
    }
}
