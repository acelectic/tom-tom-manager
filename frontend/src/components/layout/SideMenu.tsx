import {
  Box,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core'
import paths from '../../constant/paths'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCurrUser } from '../../services/auth/auth-query'
import React, { useMemo } from 'react'
import Authenlize from '../commons/Authenlize'
import { Role } from '../../services/auth/auth-types'

import DashboardIcon from '@material-ui/icons/Dashboard'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import PeopleIcon from '@material-ui/icons/People'
import BarChartIcon from '@material-ui/icons/BarChart'
import SettingsIcon from '@material-ui/icons/Settings'
import LayersIcon from '@material-ui/icons/Layers'
import AssignmentIcon from '@material-ui/icons/Assignment'
import SecurityIcon from '@material-ui/icons/Security'
import MoneyOff from '@material-ui/icons/MoneyOff'
import MoneyRounded from '@material-ui/icons/MoneyRounded'

interface MenuProps {
  path: string
  label: string
  icon: ReturnType<typeof DashboardIcon>
}
const Menu = (props: MenuProps) => {
  const history = useHistory()

  const { pathname } = history.location

  const isFocus = useMemo(() => pathname.startsWith(props.path), [
    pathname,
    props.path,
  ])
  return (
    <Box
      style={{
        opacity: isFocus ? 1 : 0.7,
        backgroundColor: isFocus ? '#6EB5FF' : undefined,
      }}
    >
      <Link
        to={props.path}
        style={{
          textDecoration: 'none',
        }}
      >
        <ListItem button>
          <ListItemIcon>{props.icon}</ListItemIcon>
          <ListItemText
            primary={props.label}
            style={{
              color: isFocus ? '#FeFEFE' : 'WindowText',
              fontWeight: 'bold',
            }}
          />
        </ListItem>
      </Link>
    </Box>
  )
}

const SideMenu = () => {
  const { t } = useTranslation()
  const { data: user } = useCurrUser()
  return (
    <div>
      <Menu
        path={paths.dashboard()}
        label={t('page.dashboard')}
        icon={<BarChartIcon />}
      />
      <Menu
        path={paths.users()}
        label={t('page.users')}
        icon={<PeopleIcon />}
      />
      <Menu
        path={paths.resources()}
        label={t('page.resources')}
        icon={<AssignmentIcon />}
      />
      <Menu
        path={paths.transactions()}
        label={t('page.transactions')}
        icon={<ShoppingCartIcon />}
      />
      <Menu
        path={paths.payments()}
        label={t('page.payments')}
        icon={<MoneyRounded />}
      />
      <Authenlize roles={[Role.ADMIN, Role.MANAGER]} allowLocalAdmin>
        <Menu
          path={paths.setting()}
          label={t('page.setting')}
          icon={<SettingsIcon />}
        />
      </Authenlize>
      <Authenlize allowLocalAdmin>
        <Menu
          path={paths.admin()}
          label={t('page.admin')}
          icon={<SecurityIcon />}
        />
      </Authenlize>
    </div>
  )
}
export default SideMenu
