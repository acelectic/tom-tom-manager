import { Transform } from 'class-transformer'
import { sumBy } from 'lodash'
import { transformerDecimalToNumber } from 'src/utils/entity-transform'
import { debugLog, roundUpOnly } from 'src/utils/helper'
import {
  Column,
  Entity,
  DeleteDateColumn,
  Index,
  FindConditions,
  ObjectType,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  AfterInsert,
  getConnection,
  Connection,
  EntityManager,
  AfterUpdate,
  Generated,
  OneToOne,
  RelationId,
  ManyToOne,
} from 'typeorm'
import { AppEntity } from './AppEntity'
import { Payment, PaymentStatus, PaymentType } from './Payment'
import { Resource } from './Resource'
import { Template } from './Template'
import { User } from './User'

@Entity({ name: 'transactions' })
export class Transaction extends AppEntity {
  @Column({
    name: 'price',
    type: 'numeric',
    nullable: false,
    transformer: transformerDecimalToNumber,
  })
  price: number

  @Column({
    name: 'remain',
    type: 'numeric',
    nullable: false,
    default: 0,
    transformer: transformerDecimalToNumber,
  })
  remain: number

  @Column({ name: 'detail', nullable: true })
  detail: string

  @Column({ name: 'completed', type: 'boolean', default: false, nullable: true })
  completed: boolean

  @Generated('rowid')
  @Column({
    name: 'ref',
    nullable: true,
  })
  @Transform(({ value }) => `${value}`.padStart(6, '0'))
  ref: string

  @ManyToMany(
    () => User,
    users => users.transactions,
  )
  @JoinTable({
    name: 'users_transactions',
    joinColumn: {
      name: 'transactionId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[]
  // @RelationId((transaction: Transaction) => transaction.users)
  // userIds: string[]

  @OneToMany(
    () => Payment,
    payments => payments.transaction,
    {
      cascade: true,
    },
  )
  payments: Payment[]

  @ManyToOne(
    () => Template,
    template => template.transactions,
    {
      lazy: true,
      nullable: true,
    },
  )
  template: Template
  @RelationId((transaction: Transaction) => transaction.template)
  templateId: string

  async updateRemain(etm: EntityManager) {
    const transactionId = this.id
    const paymentsWaitPaid = await etm.find(Payment, {
      where: {
        transactionId,
        status: PaymentStatus.PENDING,
      },
    })
    const totalWaitPaided = sumBy(paymentsWaitPaid, payment => Number(payment.price))
    const remain = totalWaitPaided
    this.remain = Math.max(0, remain)
    if (remain <= 0) this.completed = true
    await etm.save(this)
  }
}
