import dayjs from 'dayjs'
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query'
import { api } from '../../utils/api'
import {
  CreateTransactionParams,
  CreateTransactionResponse,
  GetTransactionsHistoryParams,
  GetTransactionsHistoryResponse,
  GetTransactionsParams,
  GetTransactionsResponse,
  TransactionEntity,
  GetTransactionParams,
  GetTransactionResponse,
} from './transaction-types'

export const TRANSACTION_URL = 'transactions'
export const TRANSACTION_HISTORY_URL = `${TRANSACTION_URL}/history`

export const useGetTransactions = (
  params?: GetTransactionsParams,
  option?: UseQueryOptions<GetTransactionsResponse>,
) => {
  return useQuery(
    [TRANSACTION_URL, { params }],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionsResponse>(
        TRANSACTION_URL,
        params,
      )
      return data
    },
    {
      ...option,
    },
  )
}

export const useGetTransaction = (
  params?: GetTransactionParams,
  option?: UseQueryOptions<GetTransactionResponse>,
) => {
  const { transactionId } = params || {}
  return useQuery(
    [TRANSACTION_URL, params],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionResponse>(
        `${TRANSACTION_URL}/${transactionId}`,
      )
      return data
    },
    {
      enabled: !!transactionId,
      ...option,
    },
  )
}

export const useGetTransactionsHistory = (
  params?: GetTransactionsHistoryParams,
) => {
  return useQuery(
    [TRANSACTION_URL, TRANSACTION_HISTORY_URL, { ...params }],
    async () => {
      const { data } = await api.tomtom.get<GetTransactionsHistoryResponse>(
        TRANSACTION_HISTORY_URL,
        params,
      )
      return data.transactions
    },
  )
}

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()
  return useMutation(
    [TRANSACTION_URL],
    async (params: CreateTransactionParams) => {
      const { userIds, templateId } = params
      const { data } = await api.tomtom.post<CreateTransactionResponse>(
        TRANSACTION_URL,
        {
          userIds,
          templateId,
        },
      )
      return data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([TRANSACTION_URL])
      },
    },
  )
}

export const modifyTransaction = (transaction: TransactionEntity) => {
  const {
    ref,
    users,
    resources,
    createdAt,
    completed,
    ...restTransactoion
  } = transaction
  return {
    ...restTransactoion,
    ref: ref.toString().padStart(6, '0'),
    totalUser: users?.length || 0,
    completed: completed ? 'Completed' : 'Pending',
    date: dayjs(createdAt)
      .tz('Asia/Bangkok')
      .format('DD/MM/YYYY hh:mm:ss'),
  }
}
