import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Auth } from '../auth/auth.decorator'
import { ApiTags } from '@nestjs/swagger'
import { PaymentService } from './payment.service'
import {
  ConfirmPaymentParamsDto,
  ConfirmUserAllPaymentParamsDto,
  CreatePaymentParamsDto,
  GetPaymentsParamsDto,
} from './dto/payment-params.dto'
import { TransactionManager, EntityManager, Transaction } from 'typeorm'

@ApiTags('payments')
@Controller('v1/payments')
@Auth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  async getPayments(@Query() query: GetPaymentsParamsDto) {
    return this.paymentService.getPayments(query)
  }

  @Post()
  @Transaction()
  async createTransactions(
    @Body() body: CreatePaymentParamsDto,
    @TransactionManager() etm: EntityManager,
  ) {
    return this.paymentService.createPayment(body, etm)
  }

  @Post(':paymentId/confirm')
  @Transaction()
  async confirmPayment(
    @Param() params: ConfirmPaymentParamsDto,
    @TransactionManager() etm: EntityManager,
  ) {
    return this.paymentService.confirmPayment(params, etm)
  }

  @Post('/confirm-all')
  @Transaction()
  async confirmUserAllPayments(
    @Body() bodyParams: ConfirmUserAllPaymentParamsDto,
    @TransactionManager() etm: EntityManager,
  ) {
    return this.paymentService.confirmUserAllPayments(bodyParams, etm)
  }
}
