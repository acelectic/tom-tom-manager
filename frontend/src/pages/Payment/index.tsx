import Page from '../../components/commons/Page'
import BasicList from '../../components/BasicList'
import {
  useConfirmPayment,
  useGetPayments,
} from '../../services/payment/payment-query'
import { Role } from '../../services/auth/auth-types'
import Authenlize from '../../components/commons/Authenlize'
import React, { lazy, ReactNode, Suspense, useCallback, useMemo } from 'react'
import {
  PaymentEntity,
  PaymentStatus,
} from '../../services/payment/payment-types'
import Space from '../../components/commons/Space'
import { Button } from '@material-ui/core'
import dayjs from 'dayjs'
import { usePageRunner } from '../../utils/custom-hook'
const PaymentForm = lazy(() => import('./PaymentForm'))

const Payment = () => {
  const { page, pageSize, setNewPage, changePageSize } = usePageRunner()

  const { data: paymentsPaginate } = useGetPayments({
    page,
    limit: pageSize,
  })
  const { mutate: confirmPayment } = useConfirmPayment()
  type PaymentType = Exclude<typeof payments, undefined>

  const renderActions = useCallback(
    (data: PaymentType[number]) => {
      const { id: paymentId, status } = data
      return (
        <>
          <Button
            variant="outlined"
            color={'primary'}
            style={{ fontWeight: 'bold' }}
            size="small"
            onClick={() => {
              confirmPayment({
                paymentId,
              })
            }}
            disabled={status !== PaymentStatus.PENDING}
          >
            Confirm
          </Button>
        </>
      )
    },
    [confirmPayment],
  )

  const payments = useMemo(() => {
    return paymentsPaginate
      ? paymentsPaginate?.items.map(payment => {
          const {
            user,
            resource,
            transaction,
            createdAt,
            ...restPayment
          } = payment
          return {
            userName: user.name,
            resource: resource
              ? [resource.name, resource.price].join(', ')
              : '-',
            transaction: transaction?.ref.toString().padStart(6, '0'),
            ...restPayment,
            date: dayjs(createdAt)
              .tz('Asia/Bangkok')
              .format('DD/MM/YYYY hh:mm:ss'),
          }
        })
      : []
  }, [paymentsPaginate])

  return (
    <Page title={'Payment Management'}>
      {/* <Authenlize roles={[Role.ADMIN, Role.MANAGER]}>
        <Suspense fallback={<div>Loading...</div>}>
          <PaymentForm />
        </Suspense>
      </Authenlize> */}
      <BasicList
        data={payments}
        columns={[
          'ref',
          'userName',
          'price',
          'type',
          'resource',
          'transaction',
          'date',
          'status',
        ]}
        renderActions={renderActions}
        paginate
        page={page}
        limit={pageSize}
        onChangePage={setNewPage}
        onChangeRowsPerPage={changePageSize}
        total={paymentsPaginate?.meta.totalItems || 0}
      />
    </Page>
  )
}
export default Payment
