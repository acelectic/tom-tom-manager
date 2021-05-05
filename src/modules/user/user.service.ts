import { Injectable } from '@nestjs/common'
import { Transaction } from 'src/db/entities/Transaction'
import { EntityManager, Not, SelectQueryBuilder } from 'typeorm'
import { User } from '../../db/entities/User'
import { Role } from '../auth/auth.constant'
import { UpdateUserDto } from './dto/user-params.dto'
import { ParamsCreateUserSignIn } from './user.interface'
import bcrypt from 'bcrypt'
import { validateError } from 'src/utils/response-error'

@Injectable()
export class UserService {
  constructor() {}

  async getUsers() {
    const users = await User.find({
      order: {
        name: 'ASC',
      },
    })
    return {
      users,
    }
  }
  async getUser(userId: string) {
    return await User.findOne(userId)
  }

  async getUserWithId(userId: string) {
    return await User.findOne(userId)
  }

  async createUserSignIn(params: ParamsCreateUserSignIn, etm: EntityManager) {
    const { email, role, password, name } = params
    const user = await User.findOrInit({ email, role, password, name })
    return await etm.save(user)
  }

  async changeRole(userId: string, role: Role, etm: EntityManager) {
    const user = await User.findOne(userId)
    if (!user) return
    user.role = role
    return await etm.save(user)
  }

  async updateUser(userId: string, params: UpdateUserDto, etm: EntityManager) {
    const { name, password, role } = params
    const user = await User.findOne(userId)

    if (name) {
      user.name = name
    }
    if (password) {
      const encryptPassword = await bcrypt.hash(password, 10)
      user.password = encryptPassword
    }
    if (role) {
      user.role = role
    }
    return await etm.save(user)
  }

  private async validateUpdateUser(userId: string, params: UpdateUserDto) {
    const { name, password, role } = params
    const user = await User.findOne(userId)

    if (!user) {
      validateError('User not found')
    }

    if (!name || !password) {
      validateError('Invalid information')
    }
  }
}
